import { ethers } from "./ethers.js";

let EmailContractAddress = "0x52195d6A559E8Ffec94cAC9D9C7130E9471e4A6d";
let EMailContractABI = [ { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "target", "type": "address" }, { "indexed": false, "internalType": "address", "name": "sender", "type": "address" } ], "name": "EmailSentEvent", "type": "event" }, { "inputs": [], "name": "clearInbox", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "clearSentItems", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getInbox", "outputs": [ { "components": [ { "internalType": "string", "name": "title", "type": "string" }, { "internalType": "string", "name": "about", "type": "string" }, { "internalType": "string", "name": "text", "type": "string" }, { "internalType": "uint256[]", "name": "files", "type": "uint256[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "address", "name": "sender", "type": "address" } ], "internalType": "struct EMailContract.EMail[]", "name": "", "type": "tuple[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getSentItems", "outputs": [ { "components": [ { "internalType": "string", "name": "title", "type": "string" }, { "internalType": "string", "name": "about", "type": "string" }, { "internalType": "string", "name": "text", "type": "string" }, { "internalType": "uint256[]", "name": "files", "type": "uint256[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "address", "name": "sender", "type": "address" } ], "internalType": "struct EMailContract.EMail[]", "name": "", "type": "tuple[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "target", "type": "address" }, { "internalType": "string", "name": "title", "type": "string" }, { "internalType": "string", "name": "about", "type": "string" }, { "internalType": "string", "name": "text", "type": "string" }, { "internalType": "uint256[]", "name": "files", "type": "uint256[]" } ], "name": "sendEmail", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ];

let EMailContract = "EMailContract";
let provider = "";
let signer = "";
let connected = false;

let DSocialContracts = new Map();
let fetchedContracts = false;

let thrownError = false;

connectToWeb3Provider();
clientLoop();

document.getElementById("sendEMAIL").addEventListener("click", sendEMAIL);
document.getElementById("CLEARINBOX").addEventListener("click", clearInbox);
document.getElementById("CLEAR_SENT_ITEMS").addEventListener("click", clearSentItems);

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
        thrownError = true;
    }
}

async function clientLoop() {
    if(connected == true && thrownError == false) {
        try {
            if(fetchedContracts == false) {
                
                fetchedContracts = true;

                logToClient("Fetching contract...");
                
                let EMailContract1 = new ethers.Contract(EmailContractAddress, EMailContractABI, signer);
                DSocialContracts.set(EMailContract,EMailContract1);

                logToClient(EmailContractAddress);

                loadInbox();
                loadSentItems();
                
                logToClient("Fetched contract!");
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
        let inbox = await DSocialContracts.get(EMailContract).getInbox();
        let inboxTable = document.getElementById("inbox");
        inboxTable.innerText = "";
        let header = inboxTable.insertRow(0);
        header.insertCell(0).innerText = "Title";
        header.insertCell(1).innerText = "About";
        header.insertCell(2).innerText = "From";
        header.insertCell(3).innerText = "Text";

        for (let ii = 0; ii < inbox.length; ii++) {
            let element = inbox[ii];
            let row = inboxTable.insertRow(1);
            let titleCollum = row.insertCell(0);
            let aboutCollum = row.insertCell(1);
            let senderCollum = row.insertCell(2);
            let textCollum = row.insertCell(3);
            titleCollum.innerText = element.title;
            aboutCollum.innerText = element.about;
            senderCollum.innerText = element.sender;
            textCollum.innerText = element.text;
        }
        logToClient("Loaded client inbox!");
    }
    catch(err) {
        console.log(err);
        logToClient("There was an error loading client inbox:");
        logToClient(err);
        thrownError = true;
    }
}

async function loadSentItems() {
    try {
        logToClient("Loading client sent-items...");
        let sentItems = await DSocialContracts.get(EMailContract).getSentItems();
        let sentItemsTable = document.getElementById("sentItems");
        sentItemsTable.innerText = "";
        let header = sentItemsTable.insertRow(0);
        header.insertCell(0).innerText = "Title";
        header.insertCell(1).innerText = "About";
        header.insertCell(2).innerText = "To";
        header.insertCell(3).innerText = "Text";

        for (let iii = 0; iii < sentItems.length; iii++) {
            let element = sentItems[iii];
            let row = sentItemsTable.insertRow(1);
            let titleCollum = row.insertCell(0);
            let aboutCollum = row.insertCell(1);
            let senderCollum = row.insertCell(2);
            let textCollum = row.insertCell(3);
            titleCollum.innerText = element.title;
            aboutCollum.innerText = element.about;
            senderCollum.innerText = element.to;
            textCollum.innerText = element.text;
        }
        logToClient("Loaded client sent-items!");
    }
    catch(err) {
        console.log(err);
        logToClient("There was an error loading client sent-items:");
        logToClient(err);
        thrownError = true;
    }
}

async function clearInbox() {
    try {
        logToClient("Clearing client inbox...");
        if(fetchedContracts==false) {
            throw "Contracts have not been fetched and thus cannot clear inbox!";
        }
        let EMailContract = DSocialContracts.get(EMailContract);
        await EMailContract.clearInbox();
        logToClient("Cleared client inbox!");
    }
    catch(err) {
        console.log(err);
        logToClient(err);
        thrownError = true;
    }
}

async function clearSentItems() {
    try {
        logToClient("Clearing client sent-items...");
        if(fetchedContracts==false) {
            throw "Contracts have not been fetched and thus cannot clear sent-items!";
        }
        let EMailContract = DSocialContracts.get(EMailContract);
        await EMailContract.clearSentItems();
        logToClient("Cleared client sent-items!");
    }
    catch(err) {
        console.log(err);
        logToClient(err);
        thrownError = true;
    }
}


async function sendEMAIL() {
    try {
        let title = document.getElementById("title").value;
        let about = document.getElementById("about").value;
        let address = document.getElementById("address").value;
        let text = document.getElementById("text").value;
        logToClient("Sending EMAIL to " + address + " ...");
        if(fetchedContracts==false) {
            throw "Contracts have not been fetched and thus cannot send an EMAIL!";
        }
        let EMailContract = DSocialContracts.get(EMailContract);
        let files = [];
        await EMailContract.sendEmail(address, title, about, text, files);
        logToClient("Sent EMAIL to " + address + " !!!");
    }
    catch(err) {
        console.log(err);
        logToClient(err);
        thrownError = true;
    }
}

async function EMailListenerLogic(target, sender) {
    try {
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
    catch(err) {
        console.log(err);
        logToClient(err);
        thrownError = true;
    }
}

async function registerEMailListener() {
    try {
        let contract = DSocialContracts.get(EMailContract);
        contract.on("EmailSentEvent", (target, sender) => {
            EMailListenerLogic(target,sender);
        });
    }
    catch(err) {
        console.log(err);
        logToClient(err);
        thrownError = true;
    }
}

function logToClient(txt) {
    document.getElementById("logging").innerHTML = document.getElementById("logging").innerHTML + "[" +(new Date().toLocaleString()) + "] " + txt + "<br>";
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}