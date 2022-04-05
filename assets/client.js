import { ethers } from "./ethers.js";

let MainContractAddress = "0x4f7AbE81467467e14ec1D907Ad28188056FC326a";
let MainContractABI = [ { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [], "name": "BroadcastEvent", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "target", "type": "address" } ], "name": "ContractEvent", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "owner", "type": "address" } ], "name": "OwnershipChangeEvent", "type": "event" }, { "inputs": [ { "internalType": "string", "name": "name", "type": "string" } ], "name": "deleteContract", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getBroadcasts", "outputs": [ { "internalType": "string[]", "name": "", "type": "string[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "name", "type": "string" } ], "name": "getContract", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getContractNames", "outputs": [ { "internalType": "string[]", "name": "", "type": "string[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "name", "type": "string" }, { "internalType": "address", "name": "target", "type": "address" } ], "name": "pushContract", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "text", "type": "string" } ], "name": "sendBroadcast", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "target", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ];

let EMailContractABI = [ { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "target", "type": "address" }, { "indexed": false, "internalType": "address", "name": "sender", "type": "address" } ], "name": "EmailSentEvent", "type": "event" }, { "inputs": [], "name": "getInbox", "outputs": [ { "components": [ { "internalType": "string", "name": "title", "type": "string" }, { "internalType": "string", "name": "about", "type": "string" }, { "internalType": "string", "name": "text", "type": "string" }, { "internalType": "uint256[]", "name": "files", "type": "uint256[]" }, { "internalType": "address", "name": "sender", "type": "address" } ], "internalType": "struct EMailContract.EMail[]", "name": "", "type": "tuple[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getSentItems", "outputs": [ { "components": [ { "internalType": "string", "name": "title", "type": "string" }, { "internalType": "string", "name": "about", "type": "string" }, { "internalType": "string", "name": "text", "type": "string" }, { "internalType": "uint256[]", "name": "files", "type": "uint256[]" }, { "internalType": "address", "name": "sender", "type": "address" } ], "internalType": "struct EMailContract.EMail[]", "name": "", "type": "tuple[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "target", "type": "address" }, { "internalType": "string", "name": "title", "type": "string" }, { "internalType": "string", "name": "about", "type": "string" }, { "internalType": "string", "name": "text", "type": "string" }, { "internalType": "uint256[]", "name": "files", "type": "uint256[]" } ], "name": "sendEmail", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ];

let provider = "";
let signer = "";
let connected = false;
let fetchedBroadcasts = false;

let DSocialContracts = new Map();
let fetchedContracts = false;

let thrownError = false;

connectToWeb3Provider();
clientLoop();

document.getElementById("sendEMAIL").addEventListener("click", sendEMAIL);

async function sendEMAIL() {
    let title = document.getElementById("title").value;
    let about = document.getElementById("about").value;
    let address = document.getElementById("address").value;
    let text = document.getElementById("text").value;
    try {
        logToClient("Sending EMAIL to " + address + " ...");
        if(fetchedContracts==false) {
            throw "Contracts have not been fetched and thus cannot send an EMAIL!";
        }
        let EMailContract = DSocialContracts.get("EMailContract");
        //sendEmail(address target, string memory title, string memory about, string memory text, uint256[] memory files
        let files = [];
        await EMailContract.sendEmail(address, title, about, text, files);
        logToClient("Sent EMAIL to " + address + " !!!");
    }
    catch(err) {
        console.log(err);
        logToClient(err);
    }
}

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
            const MainContract = new ethers.Contract( MainContractAddress , MainContractABI , signer );
			DSocialContracts.set("MainContract",MainContract);
            if(fetchedBroadcasts == false) {
                logToClient("Fetching network broadcasts...");
                var broadcasts = await MainContract.getBroadcasts();
                broadcasts.forEach(function (item, index) {
                    document.getElementById("broadcasts").innerHTML = document.getElementById("broadcasts").innerHTML + item + "<br>";
                });
                fetchedBroadcasts = true;
                logToClient("Fetched network broadcasts!");
            }
            if(fetchedContracts == false) {
                
                logToClient("Fetching network contracts...");
                var contractNames = await MainContract.getContractNames();
                
                for (var i = 0; i < contractNames.length; i++) {
					
                    logToClient(contractNames[i]);
                    var response = await MainContract.getContract(contractNames[i]);
					
                    if(contractNames[i] == "EMailContract") {
						
                        let EMailContract = new ethers.Contract(response, EMailContractABI, signer);
						DSocialContracts.set("EMailContract",EMailContract);
						
                        let inbox = await EMailContract.getInbox();
                        for (var ii = 0; ii < inbox.length; ii++) {
                            let element = inbox[ii];
                            let inboxTable = document.getElementById("inbox");
                            let row = inboxTable.insertRow(1);
                            let titleCollum = row.insertCell(0);
                            let aboutCollum = row.insertCell(1);
                            let senderCollum = row.insertCell(2);
                            let textCollum = row.insertCell(3);
                            titleCollum.innerHTML = element.title;
                            aboutCollum.innerHTML = element.about;
                            senderCollum.innerHTML = element.sender;
                            textCollum.innerHTML = element.text;
                        }

                        let sentItems = await EMailContract.getSentItems();
                        for (var iii = 0; iii < sentItems.length; iii++) {
                            let element = sentItems[iii];
                            let sentItemsTable = document.getElementById("sentItems");
                            let row = sentItemsTable.insertRow(1);
                            let titleCollum = row.insertCell(0);
                            let aboutCollum = row.insertCell(1);
                            let senderCollum = row.insertCell(2);
                            let textCollum = row.insertCell(3);
                            titleCollum.innerHTML = element.title;
                            aboutCollum.innerHTML = element.about;
                            senderCollum.innerHTML = element.sender;
                            textCollum.innerHTML = element.text;
                        }

					}
					
                    logToClient(response);
                }
                
                logToClient("Fetched network contracts!");
                fetchedContracts = true;
            }
        }
        catch(err) {
            console.log(err);
            logToClient(err);
            thrownError = true;
        }
    }
    await sleep(1000);
    clientLoop();
}

function logToClient(txt) {
    document.getElementById("logging").innerHTML = document.getElementById("logging").innerHTML + txt + "<br>";
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}