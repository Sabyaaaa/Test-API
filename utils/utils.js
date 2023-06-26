
const {
    ContractCreateTransaction,
    FileAppendTransaction,
    FileCreateTransaction
} = require("@hashgraph/sdk");

const Web3 = require('web3');

// Function to generate bytecode File Id
async function createByteCodeFileId(bytecode,client,operatorKey) {
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

async function createContractFactoryContractId(bytecodeFileId,gasLimit,client) {
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

module.exports={createByteCodeFileId,createContractFactoryContractId,}