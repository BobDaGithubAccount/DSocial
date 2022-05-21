import { ethers } from "./ethers.js";

let EmailContractAddress = "0xD97ACb76b4Aea48C4b14127a248b6E3101c1f243";
let EMailContractABI = [ { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "person", "type": "address" } ], "name": "UpdateInboxEvent", "type": "event" }, { "inputs": [], "name": "clearInbox", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "clearSentItems", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getInbox", "outputs": [ { "components": [ { "internalType": "string", "name": "title", "type": "string" }, { "internalType": "string", "name": "about", "type": "string" }, { "internalType": "string", "name": "text", "type": "string" }, { "internalType": "uint256[]", "name": "files", "type": "uint256[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "address", "name": "sender", "type": "address" } ], "internalType": "struct EMailContract.EMail[]", "name": "", "type": "tuple[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getSentItems", "outputs": [ { "components": [ { "internalType": "string", "name": "title", "type": "string" }, { "internalType": "string", "name": "about", "type": "string" }, { "internalType": "string", "name": "text", "type": "string" }, { "internalType": "uint256[]", "name": "files", "type": "uint256[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "address", "name": "sender", "type": "address" } ], "internalType": "struct EMailContract.EMail[]", "name": "", "type": "tuple[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "target", "type": "address" }, { "internalType": "string", "name": "title", "type": "string" }, { "internalType": "string", "name": "about", "type": "string" }, { "internalType": "string", "name": "text", "type": "string" }, { "internalType": "uint256[]", "name": "files", "type": "uint256[]" } ], "name": "sendEmail", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ];

let EMailContract = "EMailContract";
let provider = "";
let signer = "";
let connected = false;

let DSocialContracts = new Map();
let fetchedContracts = false;

let thrownError = false;

connectToWeb3Provider();
clientLoop();

document.getElementById("clear").addEventListener("click", clear);
document.getElementById("refresh").addEventListener("click", refresh);
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

                refresh();
                
                logToClient("Fetched contract!");
                registerEMailListener();
            }
        }
        catch(err) {
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
        let EMailContract1 = DSocialContracts.get(EMailContract);
        await EMailContract1.clearInbox();
        logToClient("Cleared client inbox!");
    }
    catch(err) {
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
        let EMailContract1 = DSocialContracts.get(EMailContract);
        await EMailContract1.clearSentItems();
        logToClient("Cleared client sent-items!");
    }
    catch(err) {
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
        let EMailContract1 = DSocialContracts.get(EMailContract);
        let files = [];
        await EMailContract1.sendEmail(address, title, about, text, files);
        logToClient("Sent EMAIL to " + address + " !!!");
    }
    catch(err) {
        logToClient(err);
        thrownError = true;
    }
}

async function refresh() {
    loadInbox();
    loadSentItems();
}

async function EMailListenerLogic(person) {
    try {
        let signerAddress = await signer.getAddress();
        if(person == signerAddress) {
            logToClient("Inbox update detected!");
            refresh();
        }
    }
    catch(err) {
        logToClient(err);
        thrownError = true;
    }
}

async function registerEMailListener() {
    try {
        let contract = DSocialContracts.get(EMailContract);
        contract.on("UpdateInboxEvent", (person) => {
            EMailListenerLogic(person);
        });
    }
    catch(err) {
        logToClient(err);
        thrownError = true;
    }
}

function logToClient(txt) {
    console.log(txt);
    document.getElementById("logging").innerHTML = document.getElementById("logging").innerHTML + "[" +(new Date().toLocaleString()) + "] " + txt + "<br>";
}

async function clear() {
    document.getElementById("logging").innerHTML = "Client Logs: <br> ";
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}