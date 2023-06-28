
const {
    ContractCreateTransaction,
    FileAppendTransaction,
    FileCreateTransaction,
    ContractExecuteTransaction
} = require("@hashgraph/sdk");

const web3 = require('web3')

// Function to generate bytecode File Id
async function createByteCodeFileId(bytecode, client, operatorKey) {
    const fileCreateTx = await new FileCreateTransaction()

        //Set the bytecode of the contract
        .setKeys([operatorKey])
        .freezeWith(client)
        .sign(operatorKey);

    //Submit the file to the Hedera test network signing with the transaction fee payer key specified with the client
    const submitTx = await fileCreateTx.execute(client);

    //Get the receipt of the file create transaction
    const fileReceipt = await submitTx.getReceipt(client);

    //Get the file ID from the receipt
    const bytecodeFileId = fileReceipt.fileId;

    //Log the file ID
    // console.log("The smart contract byte code file ID is " + bytecodeFileId)
    const fileAppendTx = await new FileAppendTransaction()
        .setFileId(bytecodeFileId)
        .setContents(bytecode)
        .setMaxChunks(1000)
        .freezeWith(client)
        .sign(operatorKey);

    const fileAppendSubmit = await fileAppendTx.execute(client);
    const fileAppendRx = fileAppendSubmit.getReceipt(client);
    const fileAppendStatus = (await fileAppendRx).status;
    return [bytecodeFileId, fileAppendStatus];

}

// Function to deploy contract on hedera network and return contract Id

async function createContractFactoryContractId(bytecodeFileId, gasLimit, client) {
    console.log(" -------------------- Calling createContractId function --------------------");
    // Instantiate the contract instance
    const contractTx = await new ContractCreateTransaction()
        //Set the file ID of the Hedera file storing the bytecode
        .setBytecodeFileId(bytecodeFileId)
        //Set the gas to instantiate the contract
        .setGas(gasLimit);

    //Submit the transaction to the Hedera test network
    const contractResponse = await contractTx.execute(client);

    //Get the receipt of the file create transaction
    const contractReceipt = await contractResponse.getReceipt(client);

    //Get the smart contract ID
    const contractID = contractReceipt.contractId;

    // Retreive the contract Id
    const contractAddress = contractID.toSolidityAddress();

    return [contractID, contractAddress];
}

async function createChildContractInstance(cId, gasLim, fcnName, client) {
    const contractExecuteTx = new ContractExecuteTransaction()
        .setContractId(cId)
        .setGas(gasLim)
        .setFunction(fcnName)
    const contractExecuteSubmit = await contractExecuteTx.execute(client);
    //const contractExecuteRec = await contractExecuteSubmit.getRecord(client);// This will return all data->including logs,txnId,Timestamp etc
    const getReceipt = await contractExecuteSubmit.getReceipt(client);
    // const receiptStatus = getReceipt.status;
    // const contractID = getReceipt.contractId;

    // // Retreive the contract Id
    // const contractAddress = contractID.toSolidityAddress();

    // return [contractID, contractAddress, receiptStatus];
    return getReceipt.status;

}

async function getPersonDetails(functionName, parameters, gas, contractId, abi, client) {

    // generate function call with function name and parameters
    const functionCallAsUint8Array = await encodeFunctionCall(functionName, parameters, abi);

    // execute the transaction
    const transaction = await new ContractExecuteTransaction()
        .setContractId(contractId)
        .setFunctionParameters(functionCallAsUint8Array)
        .setGas(gas)
        .execute(client);
    //get receipt
    const receipt = await transaction.getReceipt(client);
    // a record contains the output of the function
    const record = await transaction.getRecord(client);


    const results = await decodeFunctionResult(functionName, record.contractFunctionResult.bytes, abi);
    return results;
}


// Encode the function
async function encodeFunctionCall(functionName, parameters, abi) {
    const functionAbi = abi.find(func => (func.name === functionName && func.type === "function"));
    const encodedParametersHex = web3.eth.abi.encodeFunctionCall(functionAbi, parameters).slice(2);
    return Buffer.from(encodedParametersHex, 'hex');
}


// Decode the function results
async function decodeFunctionResult(functionName, resultAsBytes, abi) {

    console.log("decodeFunctionResult STARTS HERE");
    const functionAbi = abi.find(func => func.name === functionName);
    const functionParameters = functionAbi.outputs;

    const resultHex = '0x'.concat(Buffer.from(resultAsBytes).toString('hex'));

    const result = web3.eth.abi.decodeParameters(functionParameters, resultHex);

    return result;
}


module.exports = {
    createByteCodeFileId, createContractFactoryContractId, createChildContractInstance, decodeFunctionResult, encodeFunctionCall
    , getPersonDetails
}