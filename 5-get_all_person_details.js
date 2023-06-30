console.clear();
require("dotenv").config();
const {
    AccountId,
    PrivateKey,
    Client
    
} = require("@hashgraph/sdk");


const utils = require("./utils/utils.js");

// Configure accounts and client
const operatorId = AccountId.fromString(process.env.MY_ACCOUNT_ID); //purchaser
const operatorKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

const contractId = process.env.INSTANCE_CONTRACT_ID;
let contractCompiled = require("./build/contracts/EscrowDemo.json");
const abi = contractCompiled.abi;
// const bytecode = contractCompiled.bytecode;

async function main() {

    
    console.log(`\n ******* Calling Get Person Details function *******`);
    const result1 = await utils.getPersonDetails('get', [0], 10000000, contractId, abi,client);
    console.log(result1);

}
main();
