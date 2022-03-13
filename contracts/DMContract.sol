pragma solidity 0.8.10;
// SPDX-License-Identifier: Proprietary
contract DMContract {
    
    struct Dm {
        string text;
        address sender;
        address[] allowedToSee;
        uint256[] filesAttatched;
    }

    struct DmChat {
        uint256[] messages;
        string name;
        string description;
        address[] members;
    }

    mapping(uint256 => DmChat) GlobalChats;
    mapping(uint256 => Dm) GlobalMessages;
    mapping(address => uint256[]) GlobalDmUsersChats;
    mapping(address => address[]) GlobalDmUsersFriendLists;

    event DmSendEvent(uint256 messageID, uint256 chatID, address target, address sender);
    event DmCreateEvent(uint256 chatID, address target, address sender);
    event DmDeleteEvent(uint256 chatID, address target, address sender);

    function isFriend(address target1, address target2) public view returns(bool) {
        address[] memory target1_friends = GlobalDmUsersFriendLists[target1];
        bool returnValue = false;
        for(uint i = 0; i < target1_friends.length; i++) {
            if(target1_friends[i] == target2) {
                returnValue = true;
                break;
            }
        }
        return returnValue;
    }
    function addFriend(address target) public {
        GlobalDmUsersFriendLists[msg.sender].push(target);
    }
    function removeFriend(address target) public {
        address[] memory friends = GlobalDmUsersFriendLists[msg.sender];
        for(uint i = 0; i < friends.length; i++) {
            if(friends[i] == target) {
                delete friends[i];
                break;
            }
        }
        GlobalDmUsersFriendLists[msg.sender] = friends;
    }

    function getDmChats() public view returns(uint256[] memory) {
        return GlobalDmUsersChats[msg.sender];
    }

    function getDmChat(uint256 id) public view returns(DmChat memory) {
        require(GlobalChats[id].members[0] == msg.sender || GlobalChats[id].members[1] == msg.sender,
            "You don't have permission to access this DM!");
        return GlobalChats[id];
    }

    function getMessage(uint256 id) public view returns(Dm memory) {
        require(GlobalMessages[id].allowedToSee[0] == msg.sender || GlobalMessages[id].allowedToSee[1] == msg.sender,
            "You don't have permission to access this DM!");
        return GlobalMessages[id];
    }

    uint256 public globalChatCount = 0;

    function createDmChat(string memory name, string memory description, address target) public {
        require(isFriend(msg.sender, target),"You aren't friends with this person!");
        globalChatCount++;
        uint256[] memory messages;
        address[] memory members = new address[](2);
        members[0] = msg.sender;
        members[1] = target;
        DmChat memory chat = DmChat(messages, name, description, members);
        GlobalChats[globalChatCount] = chat;
        GlobalDmUsersChats[msg.sender].push(globalChatCount);
        GlobalDmUsersChats[target].push(globalChatCount);
        emit DmCreateEvent(globalChatCount, target, msg.sender);
    }

    uint256 public globalMessageCount = 0;

    function sendMessage(uint256 chatID, string memory text, address target, uint256[] memory filesAttatched) public {
        require(GlobalChats[chatID].members[0] == msg.sender || GlobalChats[chatID].members[1] == msg.sender,
                "You don't have permission to access this DM!");
        uint256 id = globalMessageCount + 1;
        globalMessageCount = id;
        address[] memory allowedToSee = new address[](2);
        allowedToSee[0] = msg.sender;
        allowedToSee[1] = target;
        Dm memory dm = Dm(text, msg.sender, allowedToSee, filesAttatched);
        GlobalMessages[id] = dm;
        GlobalChats[chatID].messages.push(id);
        emit DmSendEvent(id, chatID, target, msg.sender);
    }

    function deleteDmChat(uint256 chatID) public {
        address person1 = GlobalChats[chatID].members[0];
        address person2 = GlobalChats[chatID].members[1];
        bool shouldContinue = false;
        if(person1 == msg.sender) {
            delete GlobalChats[chatID];
            emit DmDeleteEvent(chatID, person2, msg.sender);
            shouldContinue=true;
        }
        else if(person2 == msg.sender) {
            delete GlobalChats[chatID];
            emit DmDeleteEvent(chatID, person1, msg.sender);
            shouldContinue=true;
        }
        if(shouldContinue == true) {
            for(uint i = 0; i < GlobalDmUsersChats[person1].length; i++) {
                if(GlobalDmUsersChats[person1][i]==chatID) {
                    delete GlobalDmUsersChats[person1][i];
                    break;
                }
            }
            for(uint i = 0; i < GlobalDmUsersChats[person2].length; i++) {
                if(GlobalDmUsersChats[person2][i]==chatID) {
                    delete GlobalDmUsersChats[person2][i];
                    break;
                }
            }
        }
    }
}
