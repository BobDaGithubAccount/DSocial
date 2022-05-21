pragma solidity 0.8.14;
// SPDX-License-Identifier: Proprietary
contract EMailContract {
    
    struct EMail {
        string title;
        string about;
        string text;
        uint256[] files;
        address to;
        address sender;
    }
    
    mapping(address=>EMail[]) GlobalInbox;
    mapping(address=>EMail[]) GlobalSentItems;

    event UpdateInboxEvent(address person);
    function sendEmail(address target, string memory title, string memory about, string memory text, uint256[] memory files) public {
        EMail memory email = EMail(title,about,text,files,target,msg.sender);
        GlobalInbox[target].push(email);
        GlobalSentItems[msg.sender].push(email);
        emit UpdateInboxEvent(target);
        emit UpdateInboxEvent(msg.sender);
    }

    function getInbox() public view returns(EMail[] memory) {
        return GlobalInbox[msg.sender];
    }

    function getSentItems() public view returns(EMail[] memory) {
        return GlobalSentItems[msg.sender];
    }

    function clearInbox() public {
        delete GlobalInbox[msg.sender];
        emit UpdateInboxEvent(msg.sender);
    }

    function clearSentItems() public {
        delete GlobalSentItems[msg.sender];
        emit UpdateInboxEvent(msg.sender);
    }
}