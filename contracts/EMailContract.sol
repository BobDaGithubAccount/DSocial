pragma solidity 0.8.10;
// SPDX-License-Identifier: Proprietary
contract EMailContract {
    
    struct EMail {
        string title;
        string about;
        string text;
        uint256[] files;
        address sender;
    }
    
    mapping(address=>EMail[]) GlobalInbox;
    mapping(address=>EMail[]) GlobalSentItems;

    event EmailSentEvent(address target, address sender);
    function sendEmail(address target, string memory title, string memory about, string memory text, uint256[] memory files) public {
        EMail memory email = EMail(title,about,text,files,msg.sender);
        GlobalInbox[target].push(email);
        GlobalSentItems[msg.sender].push(email);
        emit EmailSentEvent(target, msg.sender);
    }

    function getInbox() public view returns(EMail[] memory) {
        return GlobalInbox[msg.sender];
    }

    function getSentItems() public view returns(EMail[] memory) {
        return GlobalSentItems[msg.sender];
    }
}