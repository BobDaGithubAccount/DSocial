import { ethers } from "./ethers.js";

let MainContractAddress = "0x7e87De776c92c7D8282171B0a19BD1f96B71159F";
let MainContractABI = [ { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [], "name": "BroadcastEvent", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "target", "type": "address" } ], "name": "ContractEvent", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "owner", "type": "address" } ], "name": "OwnershipChangeEvent", "type": "event" }, { "inputs": [ { "internalType": "string", "name": "name", "type": "string" } ], "name": "deleteContract", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getBroadcasts", "outputs": [ { "internalType": "string[]", "name": "", "type": "string[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "name", "type": "string" } ], "name": "getContract", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getContractNames", "outputs": [ { "internalType": "string[]", "name": "", "type": "string[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "name", "type": "string" }, { "internalType": "address", "name": "target", "type": "address" } ], "name": "pushContract", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "text", "type": "string" } ], "name": "sendBroadcast", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "target", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ];

let provider = "";
let signer = "";
let connected = false;
let fetchedBroadcasts = false;

let DSocialContracts = new Map();
let thrownError = false;

connectToWeb3Provider();
clientLoop();

document.getElementById("clear").addEventListener("click", clear);
document.getElementById("refresh").addEventListener("click", loadBroadcasts);

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
            DSocialContracts.set("MainContract", MainContract);
            if(fetchedBroadcasts == false) {
                loadBroadcasts();
                registerBroadcastListener();
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

async function loadBroadcasts() {
    let contract = DSocialContracts.get("MainContract");
    logToClient("Fetching network broadcasts...");
    let broadcasts = await contract.getBroadcasts();
    document.getElementById("broadcasts").innerHTML = "Network Broadcasts: <br> ";
    broadcasts.forEach(function (item, index) {
        document.getElementById("broadcasts").innerHTML = document.getElementById("broadcasts").innerHTML + item + "<br>";
    });
    fetchedBroadcasts = true;
    logToClient("Fetched network broadcasts!");
}

async function BroadcastListenerLogic() {
    try {
        location.reload();
    }
    catch(err) {
        logToClient(err);
        thrownError = true;
    }
}

async function registerBroadcastListener() {
    try {
        let contract = DSocialContracts.get("MainContract");
        contract.on("BroadcastEvent", () => {
            BroadcastListenerLogic();
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