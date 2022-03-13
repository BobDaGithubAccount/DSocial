pragma solidity 0.8.10;
// SPDX-License-Identifier: Proprietary
contract FileContract {
    
    struct File {
        string name;
        bool restrictAccess;
        address[] allowedToSee;
        bool isURL;
        string url;
        string data;
        address owner;
    }

    mapping(address=>uint256[]) GlobalFileUsers;
    mapping(uint256=>File) GlobalFileStorage;

    uint256 fileCounter = 0;

    event FileUploadEvent(uint256 id, address owner);
    function uploadFile(string memory name, bool restrictAccess, address[] memory allowedToSee, bool isURL, 
        string memory url, string memory data) public {
            fileCounter++;
            File memory file = File(name, restrictAccess, allowedToSee, isURL, url, data, msg.sender);
            GlobalFileStorage[fileCounter] = file;
            GlobalFileUsers[msg.sender].push(fileCounter);
            emit FileUploadEvent(fileCounter, msg.sender);
    }

    event FileUpdateEvent(uint256 id, address owner);
    function updateFile(uint256 id, string memory name, bool restrictAccess, address[] memory allowedToSee, bool isURL, 
        string memory url, string memory data) public {
            require(GlobalFileStorage[id].owner==msg.sender,"You don't own this file!");
            File memory file = File(name, restrictAccess, allowedToSee, isURL, url, data, msg.sender);
            GlobalFileStorage[id] = file;
            emit FileUpdateEvent(id, msg.sender);
    }

    function allowPublicAccess(uint256 id, bool value) public {
        require(GlobalFileStorage[id].owner==msg.sender,"You don't own this file!");
        GlobalFileStorage[id].restrictAccess = value;
    }

    function addPersonToWhitelist(uint256 id, address target) public {
        require(GlobalFileStorage[id].owner==msg.sender,"You don't own this file!");
        GlobalFileStorage[id].allowedToSee.push(target);
    }

    function removePersonFromWhitelist(uint256 id, address target) public {
        require(GlobalFileStorage[id].owner==msg.sender,"You don't own this file!");
        for(uint i = 0; i < GlobalFileStorage[id].allowedToSee.length; i++) {
            if(GlobalFileStorage[id].allowedToSee[i] == target) {
                delete GlobalFileStorage[id].allowedToSee[i];
                break;
            }
        }
    }

    function isWhitelisted(uint256 id, address target) public view returns(bool) {
        for(uint i = 0; i < GlobalFileStorage[id].allowedToSee.length; i++) {
            if(GlobalFileStorage[id].allowedToSee[i] == target) {
                return true;
            }
        }
        return false;
    }

    function getFiles() public view returns(uint256[] memory) {
        return GlobalFileUsers[msg.sender];
    }

    function getFile(uint256 id) public view returns(File memory) {
        require(GlobalFileStorage[id].owner==msg.sender||isWhitelisted(id,msg.sender),"You don't have the permission to see this file!");
        return GlobalFileStorage[id];
    }

}
