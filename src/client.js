const ethers = import('/src/ethers.js');

const mainAddress = "0xcaeb3C321679e142A738CeC2C70BaD45365F8ed3"
const mainAbi = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [], "name": "BroadcastEvent", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "target", "type": "address" }], "name": "ContractEvent", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "owner", "type": "address" }], "name": "OwnershipChangeEvent", "type": "event" }, { "inputs": [{ "internalType": "string", "name": "name", "type": "string" }], "name": "deleteContract", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getBroadcasts", "outputs": [{ "internalType": "string[]", "name": "", "type": "string[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "name", "type": "string" }], "name": "getContract", "outputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getContractNames", "outputs": [{ "internalType": "string[]", "name": "", "type": "string[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "ABI", "type": "string" }, { "internalType": "address", "name": "target", "type": "address" }], "name": "pushContract", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "text", "type": "string" }], "name": "sendBroadcast", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "target", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];

async function run() {
    try {

        const accounts = await ethereum.send('eth_requestAccounts');
        let address = accounts.result[0];
        
        const AddressButton = document.getElementById("AddressButton");
        AddressButton.value = address;
        AddressButton.addEventListener("click", () => {
            console.log("Address in use for DSocial: " + address);
        });

        //let signer = signer.connect(provider)
        //let contract = new ethers.Contract(mainAddress, mainAbi, signer);
    } catch (error) {
        console.log(error);
    }
}

run();