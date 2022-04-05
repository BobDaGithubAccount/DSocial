import { ethers } from "./ethers.js";

let MainContractAddress = "0xf9B3Be3924651E3Cb5317aE082a0b35AF97576bE";
let MainContractABI = [ { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [], "name": "BroadcastEvent", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "target", "type": "address" } ], "name": "ContractEvent", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "owner", "type": "address" } ], "name": "OwnershipChangeEvent", "type": "event" }, { "inputs": [ { "internalType": "string", "name": "name", "type": "string" } ], "name": "deleteContract", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getBroadcasts", "outputs": [ { "internalType": "string[]", "name": "", "type": "string[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "name", "type": "string" } ], "name": "getContract", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getContractNames", "outputs": [ { "internalType": "string[]", "name": "", "type": "string[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "name", "type": "string" }, { "internalType": "address", "name": "target", "type": "address" } ], "name": "pushContract", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "text", "type": "string" } ], "name": "sendBroadcast", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "target", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ];

let EMailContractABI = [ { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "target", "type": "address" }, { "indexed": false, "internalType": "address", "name": "sender", "type": "address" } ], "name": "EmailSentEvent", "type": "event" }, { "inputs": [], "name": "getInbox", "outputs": [ { "components": [ { "internalType": "string", "name": "title", "type": "string" }, { "internalType": "string", "name": "about", "type": "string" }, { "internalType": "string", "name": "text", "type": "string" }, { "internalType": "uint256[]", "name": "files", "type": "uint256[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "address", "name": "sender", "type": "address" } ], "internalType": "struct EMailContract.EMail[]", "name": "", "type": "tuple[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getSentItems", "outputs": [ { "components": [ { "internalType": "string", "name": "title", "type": "string" }, { "internalType": "string", "name": "about", "type": "string" }, { "internalType": "string", "name": "text", "type": "string" }, { "internalType": "uint256[]", "name": "files", "type": "uint256[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "address", "name": "sender", "type": "address" } ], "internalType": "struct EMailContract.EMail[]", "name": "", "type": "tuple[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "target", "type": "address" }, { "internalType": "string", "name": "title", "type": "string" }, { "internalType": "string", "name": "about", "type": "string" }, { "internalType": "string", "name": "text", "type": "string" }, { "internalType": "uint256[]", "name": "files", "type": "uint256[]" } ], "name": "sendEmail", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ];

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

                        loadInbox();
                        loadSentItems();
					}
					
                    logToClient(response);
                }
                
                logToClient("Fetched network contracts!");
                fetchedContracts = true;
                registerEMailListener();
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

async function loadInbox() {
    try {
        
        logToClient("Loading client inbox...");
        let inbox = await DSocialContracts.get("EMailContract").getInbox();
        let inboxTable = document.getElementById("inbox");
        inboxTable.innerHTML = "";
        let header = inboxTable.insertRow(0);
        header.insertCell(0).innerHTML = "Title";
        header.insertCell(1).innerHTML = "About";
        header.insertCell(2).innerHTML = "From";
        header.insertCell(3).innerHTML = "Text";

        for (var ii = 0; ii < inbox.length; ii++) {
            let element = inbox[ii];
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
        logToClient("Loaded client inbox!");
    }
    catch(err) {
        console.log(err);
        logToClient("There was an error loading client inbox:");
        logToClient(err);
    }
}

async function loadSentItems() {
    try {
        logToClient("Loading client sent-items...");
        let sentItems = await DSocialContracts.get("EMailContract").getSentItems();
        let sentItemsTable = document.getElementById("sentItems");
        sentItemsTable.innerHTML = "";
        let header = sentItemsTable.insertRow(0);
        header.insertCell(0).innerHTML = "Title";
        header.insertCell(1).innerHTML = "About";
        header.insertCell(2).innerHTML = "To";
        header.insertCell(3).innerHTML = "Text";

        for (var iii = 0; iii < sentItems.length; iii++) {
            let element = sentItems[iii];
            let row = sentItemsTable.insertRow(1);
            let titleCollum = row.insertCell(0);
            let aboutCollum = row.insertCell(1);
            let senderCollum = row.insertCell(2);
            let textCollum = row.insertCell(3);
            titleCollum.innerHTML = element.title;
            aboutCollum.innerHTML = element.about;
            senderCollum.innerHTML = element.to;
            textCollum.innerHTML = element.text;
        }
        logToClient("Loaded client sent-items!");
    }
    catch(err) {
        console.log(err);
        logToClient("There was an error loading client sent-items:");
        logToClient(err);
    }
}

async function EMailListenerLogic(target, sender) {
    let signerAddress = await signer.getAddress();
    if(target == signerAddress) {
        logToClient("Inbox update detected!");
        loadInbox();
    }
    if(sender == signerAddress) {
        logToClient("Sent-items update detected!");
        loadSentItems();
    }
}

async function registerEMailListener() {
    let contract = DSocialContracts.get("EMailContract");
    contract.on("EmailSentEvent", (target, sender) => {
        EMailListenerLogic(target,sender);
    });
}

function logToClient(txt) {
    document.getElementById("logging").innerHTML = document.getElementById("logging").innerHTML + txt + "<br>";
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}