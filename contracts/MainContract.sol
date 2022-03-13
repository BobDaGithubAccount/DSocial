pragma solidity 0.8.10;
// SPDX-License-Identifier: Proprietary
contract MainContract {
    
    address public owner;
    constructor() {
        owner = msg.sender;
    }

    event OwnershipChangeEvent(address owner);
    function transferOwnership(address target) public {
        require(msg.sender==owner,"You aren't the owner of DSocial!");
        owner = target;
        emit OwnershipChangeEvent(target);
    }

    string[] broadcasts;

    event BroadcastEvent();
    function sendBroadcast(string memory text) public {
        require(msg.sender==owner,"You aren't the owner of DSocial!");
        broadcasts.push(text);
        emit BroadcastEvent();
    }

    function getBroadcasts() public view returns(string[] memory) {
        return broadcasts;
    }

    mapping(string=>address) contracts;
    mapping(string=>string) contractABI;
    string[] contractNames;

    event ContractEvent(address target);

    function pushContract(string memory name, string memory ABI, address target) public {
        require(msg.sender==owner,"You aren't the owner of DSocial!");
        contracts[name] = target;
        contractABI[name] = ABI;
        contractNames.push(name);
        emit ContractEvent(target);
    }

    function deleteContract(string memory name) public {
        require(msg.sender==owner,"You aren't the owner of DSocial!");
        for(uint i = 0; i < contractNames.length; i++) {
            if(stringsEquals(contractNames[i],name)) {
                delete contractNames[i];
                delete contracts[name];
                delete contractABI[name];
                break;
            }
        }
    }

    function stringsEquals(string memory s1, string memory s2) private pure returns (bool) {
    bytes memory b1 = bytes(s1);
    bytes memory b2 = bytes(s2);
    uint256 l1 = b1.length;
    if (l1 != b2.length) return false;
    for (uint256 i=0; i<l1; i++) {
        if (b1[i] != b2[i]) return false;
    }
    return true;
    }   

    function getContract(string memory name) public view returns(address, string memory) {
        return(contracts[name], contractABI[name]);
    }

    function getContractNames() public view returns(string[] memory) {
        return contractNames;
    }
}
