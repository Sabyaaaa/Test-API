const { Client, AccountId, PrivateKey } = require("@hashgraph/sdk");
require("dotenv").config();
const fs = require("fs");
const utils=require("./utils/utils.js");

// Configure accounts and keys (testnet credentials)
const operatorId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
const operatorPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

if (operatorId == null || operatorPrivateKey == null) {
    throw new Error("Environment variables MY_ACCOUNT_ID and MY_PRIVATE_KEY are required.");
}

// setup the client
const client = Client.forTestnet().setOperator(operatorId, operatorPrivateKey);

// Generate the bytecode
let contractCompiled = require("./build/contracts/Factory.json");
const bytecode = contractCompiled.bytecode;


async function deployFactoryContract() {
    // Deploy the Factory Contract

	console.log(`\n ***************** \STEP 1 *****************\n`);
	console.log(`- File create bytecode...\n`);
    const [bytecodeFileId,fileAppendStatus]=await utils.createByteCodeFileId(bytecode,client,operatorPrivateKey);
    console.log(`\n Bytecode file Id :${bytecodeFileId}`);

    console.log(`\n File append status:${fileAppendStatus}`);


    console.log(`\n *****************\ STEP 2 *****************\n`);
	console.log(`- Deploying the Factory contract...\n`);
    let gasLim = 300000;

    const [contractId,contractAddress]=await utils.createContractFactoryContractId(bytecodeFileId,gasLim,client);
    console.log(`\n Factort contract Id: ${contractId}`);
    console.log(`\n Factory contract address: ${contractAddress}`);
}

deployFactoryContract();