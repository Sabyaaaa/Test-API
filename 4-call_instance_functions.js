console.clear();
// const personService = require('./PersonService/person.service');

require("dotenv").config();
const {
    AccountId,
    PrivateKey,
    Client, ContractExecuteTransaction, ContractFunctionParameters
} = require("@hashgraph/sdk");

// Configure accounts and client
const operatorId = AccountId.fromString(process.env.MY_ACCOUNT_ID); 
const operatorPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

const client = Client.forTestnet().setOperator(operatorId, operatorPrivateKey);

// let contractFactoryCompiled = require("./build/contracts/MilestoneContractTestEvent.json");
// const abi = contractFactoryCompiled.abi;


const contractId = process.env.INSTANCE_CONTRACT_ID;

async function main() {
    console.log('contractID', contractId);

    console.log(`\n ******* Calling function to add person information ******* `);

    // const { id, name, age } = await personService.getPersonDetails();

    const contractExecuteTx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(10000000)
        .setFunction(
            "add",
            new ContractFunctionParameters().addUint256(id).addString(name).addUint256(age)
        );
    const contractExecuteSubmit = await contractExecuteTx.execute(client);
    const contractExecuteRx = await contractExecuteSubmit.getReceipt(client);
    // console.log("The transaction status is " +receipt2.status.toString());
    console.log(`- Contract function call status: ${contractExecuteRx.status} \n`);


}
// async function getPersonDetails() {
//     const person = await personService.person.findFirst();
//     return { id: person.id, name: person.name, age: person.age };
//   }

    
main();




