pragma solidity 0.8.10;
// SPDX-License-Identifier: Proprietary
contract GroupChatContract {
    struct Gm {
        string text;
        address sender;
        uint256 chatId;
        uint256[] filesAttatched;
    }

    struct GmChat {
        uint256[] messages;
        string name;
        string description;
        address owner;
        address[] moderators;
        address[] members;
    }

    mapping(uint256 => GmChat) GlobalGroupChats;
    mapping(uint256 => Gm) GlobalGroupMessages;
    mapping(address => uint256[]) GlobalGmUsersChats;
    mapping(address => address[]) GlobalGmUsersFriendLists;

    event GmSendEvent(uint256 messageID, uint256 chatID, address sender);
    event GmCreateEvent(uint256 chatID);
    event GmDeleteEvent(uint256 chatID);
    event GmPersonAddedToChat(uint256 chatID, address adder, address target);
    event GmPersonLeaveChat(uint256 chatID, address target);
    event GmPersonKickedFromChat(uint256 chatID, address remover, address target);
    event GmPersonPromotedToModerator(uint256 chatID, address target);
    event GmPersonDemotedFromModerator(uint256 chatID, address target);
    event GmChatUpdateEvent(uint256 id);

    function getChats() public view returns(uint256[] memory) {
        return GlobalGmUsersChats[msg.sender];
    }

    function getChat(uint256 id) public view returns(GmChat memory) {
        require(isMemberOfChat(msg.sender, id),"You don't have permission to access this Group Chat!");
        return GlobalGroupChats[id];
    }

    function getFriends() public view returns(address[] memory) {
        return GlobalGmUsersFriendLists[msg.sender];
    }

    function isFriend(address target1, address target2) public view returns(bool) {
        address[] memory target1_friends = GlobalGmUsersFriendLists[target1];
        bool returnValue = false;
        for(uint i = 0; i < target1_friends.length; i++) {
            if(target1_friends[i] == target2) {
                returnValue = true;
                break;
            }
        }
        return returnValue;
    }

    function isModerator(uint256 id, address target) public view returns(bool) {
        address[] memory moderators = GlobalGroupChats[id].moderators;
        bool returnValue = false;
        for(uint i = 0; i < moderators.length; i++) {
            if(moderators[i] == target) {
                returnValue = true;
                break;
            }
        }
        return returnValue;
    }

    function addFriend(address target) public {
        GlobalGmUsersFriendLists[msg.sender].push(target);
    }

    function removeFriend(address target) public {
        address[] memory friends = GlobalGmUsersFriendLists[msg.sender];
        for(uint i = 0; i < friends.length; i++) {
            if(friends[i] == target) {
                delete friends[i];
                break;
            }
        }
        GlobalGmUsersFriendLists[msg.sender] = friends;
    }

    uint256 groupChatCounter = 0;

    function createGroupChat(string memory name, string memory description) public {
        uint256[] memory messages;
        address[] memory moderators;
        address[] memory members;
        GmChat memory gc = GmChat(messages, name, description, msg.sender, moderators, members);
        groupChatCounter = groupChatCounter + 1;
        GlobalGroupChats[groupChatCounter] = gc;
        GlobalGmUsersChats[msg.sender].push(groupChatCounter);
        emit GmCreateEvent(groupChatCounter);
    }

    function deleteGroupChat(uint256 id) public {
        require(GlobalGroupChats[id].owner == msg.sender,"You don't have permission to access this Group Chat!");
        address[] memory members = GlobalGroupChats[id].members;
        for(uint i = 0; i < members.length; i++) {
            uint256[] memory chats = GlobalGmUsersChats[members[i]];
            for(uint a = 0; a < chats.length; a++) {
                if(chats[a] == id) {
                    delete chats[a];
                    break;
                }
            }
            GlobalGmUsersChats[members[i]] = chats;
        }
        address[] memory moderators = GlobalGroupChats[id].moderators;
        for(uint i = 0; i < moderators.length; i++) {
            uint256[] memory chats = GlobalGmUsersChats[moderators[i]];
            for(uint a = 0; a < chats.length; a++) {
                if(chats[a] == id) {
                    delete chats[a];
                    break;
                }
            }
            GlobalGmUsersChats[moderators[i]] = chats;
        }
        GlobalGroupChats[id].moderators = moderators;
        uint256[] memory ownerChats = GlobalGmUsersChats[GlobalGroupChats[id].owner];
        for(uint a = 0; a < ownerChats.length; a++) {
            if(ownerChats[a] == id) {
                delete ownerChats[a];
                break;
            }
        }
        GlobalGmUsersChats[GlobalGroupChats[id].owner] = ownerChats;
        delete GlobalGroupChats[id];
        emit GmDeleteEvent(id);
    }

    function addPersonToGroupChat(uint256 id, address target) public {
        require(isModerator(id, msg.sender) || GlobalGroupChats[id].owner == msg.sender,"You don't have permission to access this Group Chat!");
        require(isFriend(target, msg.sender),"You aren't friends with them!");
        GlobalGroupChats[id].members.push(target);
        GlobalGmUsersChats[target].push(id);
        emit GmPersonAddedToChat(id, msg.sender, target);
    }

    function kickPersonFromChat(uint256 id, address target) public {
        require(!isModerator(id, target) && GlobalGroupChats[id].owner != target,"You can't kick this person!");
        address[] memory members = GlobalGroupChats[id].members;
        for(uint i = 0; i < members.length; i++) {
            if(members[i] == target) {
                delete members[i];
                break;
            }
        }
        GlobalGroupChats[id].members = members;
        uint256[] memory chats = GlobalGmUsersChats[target];
        for(uint i = 0; i < chats.length; i++) {
            if(chats[i] == id) {
                delete chats[i];
                break;
            }
        }
        GlobalGmUsersChats[target] = chats;
        emit GmPersonKickedFromChat(id, msg.sender, target);
    }

    function leaveChat(uint256 id) public returns(bool) {
        bool found = false;
        if(found == false) {
            address[] memory members = GlobalGroupChats[id].members;
            for(uint i = 0; i < members.length; i++) {
                if(members[i] == msg.sender) {
                    delete members[i];
                    found = true;
                    break;
                }
            }
            if(found == true) {
                GlobalGroupChats[id].members = members;
                emit GmPersonLeaveChat(id, msg.sender);
                return true;
            }
        }
        if(found == false) {
            address[] memory moderators = GlobalGroupChats[id].moderators;
            for(uint i = 0; i < moderators.length; i++) {
                if(moderators[i] == msg.sender) {
                    delete moderators[i];
                    found = true;
                    break;
                }
            }
            if(found == true) {
                GlobalGroupChats[id].moderators = moderators;
                emit GmPersonLeaveChat(id, msg.sender);
                return true;
            }
        }
        return false;
    }

    function promoteToModerator(uint256 chatID, address target) public {
        require(GlobalGroupChats[chatID].owner == msg.sender && !isModerator(chatID, target),"You don't have permission to do this!");
        address[] memory members = GlobalGroupChats[chatID].members;
        for(uint i = 0; i < members.length; i++) {
            if(members[i] == target) {
                delete members[i];
                break;
            }
        }
        GlobalGroupChats[chatID].members = members;
        GlobalGroupChats[chatID].moderators.push(target);
        emit GmPersonPromotedToModerator(chatID, target);
    }

    function deomoteFromModerator(uint256 chatID, address target) public {
        require(GlobalGroupChats[chatID].owner == msg.sender  && isModerator(chatID, target),"You don't have permission to do this!");
        address[] memory moderators = GlobalGroupChats[chatID].moderators;
        for(uint i = 0; i < moderators.length; i++) {
            if(moderators[i] == target) {
                delete moderators[i];
                break;
            }
        }
        GlobalGroupChats[chatID].moderators = moderators;
        GlobalGroupChats[chatID].members.push(target);
        emit GmPersonDemotedFromModerator(chatID, target);
    }

    function updateChat(uint256 id, string memory name, string memory description) public {
        require(GlobalGroupChats[id].owner == msg.sender,"You don't have permission to do this!");
        GlobalGroupChats[id].name = name;
        GlobalGroupChats[id].description = description;
        emit GmChatUpdateEvent(id);
    }

    function getMembersOfChat(uint256 id) public view returns(address[] memory) {
        address[] memory members = GlobalGroupChats[id].members;
        address[] memory moderators = GlobalGroupChats[id].moderators;
        uint size = members.length + moderators.length + 1;
        address[] memory returnValue = new address[](size);
        returnValue[0] = GlobalGroupChats[id].owner;
        uint a = 1;
        for(uint i = 0; i < members.length; i++) {
            members[a] = members[i];
            a++;
        }
        for(uint i = 0; i < moderators.length; i++) {
            returnValue[a] = moderators[i];
            a++;
        }
        return returnValue;
    }

    function isMemberOfChat(address target, uint256 id) public view returns(bool) {
        bool returnValue = false;
        address[] memory members = GlobalGroupChats[id].members;
        address[] memory moderators = GlobalGroupChats[id].moderators;
        uint a = 1;
        for(uint i = 0; i < moderators.length; i++) {
            members[a] = moderators[i];
            a++;
        }
        if(returnValue == false) {
        for(uint i = 0; i < members.length; i++) {
            if(members[i]==target) {
                returnValue = true;
                break;
            }
        }
        }
        if(GlobalGroupChats[id].owner == target) {
            returnValue = true;
        }
        return returnValue;
    }


    uint256 messageCounter = 0;

    function sendMessage(uint256 id, string memory text, uint256[] memory filesAttatched) public {
        require(isMemberOfChat(msg.sender, id),"You don't have permission to send a message in this group chat!");
        Gm memory message = Gm(text, msg.sender, id, filesAttatched);
        messageCounter = messageCounter + 1;
        GlobalGroupMessages[messageCounter] = message;
        GlobalGroupChats[id].messages.push(messageCounter);
        emit GmSendEvent(messageCounter, id, msg.sender);
    }

    function getMessages(uint256 id) public view returns(uint256[] memory) {
        require(isMemberOfChat(msg.sender, id),"You don't have permission to access this group chat!");
        return GlobalGroupChats[id].messages;
    }

    function getMessage(uint256 messageID) public view returns(Gm memory) {
        require(isMemberOfChat(msg.sender, GlobalGroupMessages[messageID].chatId),"You don't have permission to access this group chat!");
        return GlobalGroupMessages[messageID];
    }
}
