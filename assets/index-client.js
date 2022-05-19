import { ethers } from "./ethers.js";

let MainContractAddress = "0x7e87De776c92c7D8282171B0a19BD1f96B71159F";
let MainContractABI = [ { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [], "name": "BroadcastEvent", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "target", "type": "address" } ], "name": "ContractEvent", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "owner", "type": "address" } ], "name": "OwnershipChangeEvent", "type": "event" }, { "inputs": [ { "internalType": "string", "name": "name", "type": "string" } ], "name": "deleteContract", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getBroadcasts", "outputs": [ { "internalType": "string[]", "name": "", "type": "string[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "name", "type": "string" } ], "name": "getContract", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getContractNames", "outputs": [ { "internalType": "string[]", "name": "", "type": "string[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "name", "type": "string" }, { "internalType": "address", "name": "target", "type": "address" } ], "name": "pushContract", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "text", "type": "string" } ], "name": "sendBroadcast", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "target", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ];

let provider = "";
let signer = "";
let connected = false;
let fetchedBroadcasts = false;

let thrownError = false;

connectToWeb3Provider();
clientLoop();

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
            if(fetchedBroadcasts == false) {
                logToClient("Fetching network broadcasts...");
                var broadcasts = await MainContract.getBroadcasts();
                broadcasts.forEach(function (item, index) {
                    document.getElementById("broadcasts").innerHTML = document.getElementById("broadcasts").innerHTML + item + "<br>";
                });
                fetchedBroadcasts = true;
                logToClient("Fetched network broadcasts!");
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

function logToClient(txt) {
    document.getElementById("logging").innerHTML = document.getElementById("logging").innerHTML + "[" +(new Date().toLocaleString()) + "] " + txt + "<br>";
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}