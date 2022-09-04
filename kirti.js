console.clear();
require("dotenv").config();
const {
	AccountId,
	PrivateKey,
	Client,
	FileCreateTransaction,
	ContractCreateTransaction,
	ContractFunctionParameters,
	ContractExecuteTransaction,
	ContractCallQuery,
	ContractCreateFlow,
	TransactionResponse,
	ContractId,
	Hbar,
} = require("@hashgraph/sdk");
const fs = require("fs");

// Configure accounts and client
const operatorId = AccountId.fromString("0.0.48153406");
const operatorKey = PrivateKey.fromString("302e020100300506032b657004220420161705d7c3c2e5219d8ee6bc55991ba49ca49135d4a050d5875f230c43bfca96");

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

async function main() {
	// Import the compiled contract bytecode
	const contractBytecode = fs.readFileSync("AddColab_sol_AddColab.bin");

	// Create a file on Hedera and store the bytecode
	// const fileCreateTx = new FileCreateTransaction()
	// 	.setContents(contractBytecode)
	// 	.setKeys([operatorKey])
	// 	.freezeWith(client);
	// 	console.log("a");
	// const fileCreateSign = await fileCreateTx.sign(operatorKey);
	// console.log("b");
	// const fileCreateSubmit = await fileCreateSign.execute(client);
	// console.log("c");
	// const fileCreateRx = await fileCreateSubmit.getReceipt(client);
	// console.log("d");
	// const bytecodeFileId = fileCreateRx.fileId;
	// console.log(`- The bytecode file ID is: ${bytecodeFileId} \n`);

	// // Instantiate the smart contract
	// const contractInstantiateTx = new ContractCreateTransaction()
	// 	.setBytecodeFileId(bytecodeFileId)
	// 	.setGas(100000)
	// 	// .setConstructorParameters(
	// 	// 	new ContractFunctionParameters().addString("Alice").addUint256(111111)
	// 	// );
	// const contractInstantiateSubmit = await contractInstantiateTx.execute(client);
	// const contractInstantiateRx = await contractInstantiateSubmit.getReceipt(client);
	// const contractId = contractInstantiateRx.contractId;

	// const contractAddress = contractId.toSolidityAddress();
	// console.log(`- The smart contract ID is: ${contractId} \n`);
	// console.log(`- The smart contract ID in Solidity format is: ${contractAddress} \n`);

//Create the transaction
const contractCreate = new ContractCreateFlow()
    .setGas(100000)
    .setBytecode(contractBytecode);

//Sign the transaction with the client operator key and submit to a Hedera network
const txResponse = contractCreate.execute(client);

//Get the receipt of the transaction
const receipt = (await txResponse).getReceipt(client);

//Get the new contract ID
const newContractId = (await receipt).contractId;
        
console.log("The new contract ID is " +newContractId);

	// // Query the contract to check changes in state variable
	const contractQueryTx = new ContractCallQuery() 
		.setContractId(newContractId)
		.setGas(100000)
		.setFunction("AddColab", new ContractFunctionParameters().addString("Alice").addString("name").addUint256(0).addUint256(1));
	console.log("q")
		const contractQuerySubmit = await contractQueryTx.execute(client);
	console.log("d");
	const contractQueryResult = contractQuerySubmit.getUint256(0);
	console.log(`- Here's the phone number that you asked for: ${contractQueryResult} \n`);

	// // Call contract function to update the state variable
	// const contractExecuteTx = new ContractExecuteTransaction()
	// 	.setContractId(contractId)
	// 	.setGas(100000)
	// 	.setFunction(
	// 		"setMobileNumber",
	// 		new ContractFunctionParameters().addString("Bob").addUint256(222222)
	// 	);
	// const contractExecuteSubmit = await contractExecuteTx.execute(client);
	// const contractExecuteRx = await contractExecuteSubmit.getReceipt(client);
	// console.log(`- Contract function call status: ${contractExecuteRx.status} \n`);

	// // Query the contract to check changes in state variable
	// const contractQueryTx1 = new ContractCallQuery()
	// 	.setContractId(contractId)
	// 	.setGas(100000)
	// 	.setFunction("getMobileNumber", new ContractFunctionParameters().addString("Bob"));
	// const contractQuerySubmit1 = await contractQueryTx1.execute(client);
	// const contractQueryResult1 = contractQuerySubmit1.getUint256(0);
	// console.log(`- Here's the phone number that you asked for: ${contractQueryResult1} \n`);
}
main();