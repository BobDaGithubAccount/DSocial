let DmContractAddress = "0xA00ab9bEBd61998AF4F93AF18a760f62Fe18c5D1";
let DmContractABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "chatID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "target",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "DmCreateEvent",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "chatID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "target",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "DmDeleteEvent",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "messageID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "chatID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "target",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "DmSendEvent",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "target",
				"type": "address"
			}
		],
		"name": "addFriend",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "target",
				"type": "address"
			}
		],
		"name": "createDmChat",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "chatID",
				"type": "uint256"
			}
		],
		"name": "deleteDmChat",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "target",
				"type": "address"
			}
		],
		"name": "removeFriend",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "chatID",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "text",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "target",
				"type": "address"
			},
			{
				"internalType": "uint256[]",
				"name": "filesAttatched",
				"type": "uint256[]"
			}
		],
		"name": "sendMessage",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "getDmChat",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256[]",
						"name": "messages",
						"type": "uint256[]"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "address[]",
						"name": "members",
						"type": "address[]"
					}
				],
				"internalType": "struct DMContract.DmChat",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getDmChats",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getFriends",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "getMessage",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "text",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "sender",
						"type": "address"
					},
					{
						"internalType": "address[]",
						"name": "allowedToSee",
						"type": "address[]"
					},
					{
						"internalType": "uint256[]",
						"name": "filesAttatched",
						"type": "uint256[]"
					}
				],
				"internalType": "struct DMContract.Dm",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "globalChatCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "globalMessageCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "target1",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "target2",
				"type": "address"
			}
		],
		"name": "isFriend",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

import { ethers } from "./ethers.js";

let DmContract = "DmContract";
let provider = "";
let signer = "";
let connected = false;

let DSocialContracts = new Map();
let fetchedContracts = false;

let thrownError = false;

connectToWeb3Provider();
clientLoop();

document.getElementById("FETCH_FRIEND_LIST").addEventListener("click", getFriends);
document.getElementById("addFriendButton").addEventListener("click", addFriend);

async function connectToWeb3Provider() {
    logToClient("Connecting to web3 provider...");
    try {
        provider = new ethers.providers.Web3Provider(window.ethereum)

        await provider.send("eth_requestAccounts", []);
    
        signer = provider.getSigner()
    
        connected = true;

        logToClient("Connected to web3 provider!");
    }
    catch(err) {
        logToClient("There was an error connecting to web3 provider:");
        logToClient(err);
        connected = false;
    }
}

async function clientLoop() {
    if(connected == true && thrownError == false) {
        try {
            if(fetchedContracts == false) {
                
                fetchedContracts = true;

                logToClient("Fetching contract...");
                
                let DMContract = new ethers.Contract(DmContractAddress, DmContractABI, signer);
                DSocialContracts.set(DmContract,DMContract);

                logToClient(DmContractAddress);

                getFriends();

                registerEvents();

                logToClient("Fetched contract!");
            }
        }
        catch(err) {
            console.log(err);
            logToClient("There was an error initializing DSocial:")
            logToClient(err);
            thrownError = true;
        }
    }
    await sleep(1000);
    clientLoop();
}

async function registerEvents() {
    let contract = DSocialContracts.get(DmContract);
    contract.on("DmSendEvent", (messageID, chatID, target, sender) => {
        DmSendEventLogic(messageID, chatID, target, sender);
    });
    contract.on("DmCreateEvent", (chatID, target, sender) => {
        DmCreateEvent(chatID, target, sender);
    });
    contract.on("DmDeleteEvent", (chatID, target, sender) => {
        DmDeleteEvent(chatID, target, sender);
    });
}

async function DmSendEventLogic(messageID, chatID, target, sender) {

}

async function DmCreateEvent(chatID, target, sender) {

}

async function DmDeleteEvent(chatID, target, sender) {

}

async function getFriends() {
    let contract = DSocialContracts.get(DmContract);
    let result = await contract.getFriends();

    logToClient(result);

    document.getElementById("Friends").innerHTML = "Friends: <br>";
    for (let ii = 0; ii < result.length; ii++) {
        document.getElementById("Friends").innerHTML = document.getElementById("Friends").innerHTML + result[ii] + "<br>";
    }
}

async function addFriend() {
    try {
        logToClient("Attempting to add a friend...");
        let contract = DSocialContracts.get(DmContract);
        let addressToAdd = document.getElementById("addFriendField").innerText;
        logToClient("Address: " + addressToAdd);
        addressToAdd = ethers.getAddress(addressToAdd);
        await contract.addFriend(addressToAdd);
    }
    catch(err) {
        console.log(err);
        logToClient(err);
        thrownError = true;
    }
}

function logToClient(txt) {
    document.getElementById("logging").innerHTML = document.getElementById("logging").innerHTML + "[" +(new Date().toLocaleString()) + "] " + txt + "<br>";
    console.log("Logged to client: " + txt);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}