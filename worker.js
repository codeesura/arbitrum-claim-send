const { parentPort, workerData } = require('worker_threads');
const { armut, senderAddress, armutPrivateKey, senderPrivateKey ,claimAmount} = workerData;
const Web3 = require('web3');

const provider = 'http://....:8547/'; // Node url
const web3 = new Web3(provider);

// ARB contract address and ABI
const contractAddress = '0x912CE59144191C1204E64559FE8253a0e49E6548'; // ARB
const contractABI =""; // ARB token ABI
const recipientAddress = '0x1000409004200E0000C080E61F704a3BC162FF0D'; // Safe address

const contract = new web3.eth.Contract(contractABI, contractAddress);

const claimContractAddress = '0x67a24CE4321aB3aF51c2D0a4801c3E111D88C9d9'; // Claim contract address
const claimContractABI = ""; // Claim contract ABI

const claimContract = new web3.eth.Contract(claimContractABI, claimContractAddress);

async function claimAndSendARB(armut, senderAddress, armutPrivateKey, senderPrivateKey, claimAmount) {
    const gasPrice = await web3.eth.getGasPrice();
    const increasedGasPrice = web3.utils.toBN(gasPrice).mul(web3.utils.toBN(4)); // Gas price x4
    const tokenAmount = web3.utils.toWei(claimAmount.toString(), 'ether');
    let nonce = await web3.eth.getTransactionCount(armut, 'latest');
    let nonce_1 = await web3.eth.getTransactionCount(senderAddress, 'latest');

    // Fund sender account with Ether to pay for gas fees
    const fundSenderTx = {
      from: armut,
      to: senderAddress,
      value: web3.utils.toWei('0.001', 'ether'),
      gas: '360000',
      gasPrice: increasedGasPrice,
      nonce: nonce,
    };
  
    const signedFundSenderTx = await web3.eth.accounts.signTransaction(fundSenderTx, armutPrivateKey);
    web3.eth.sendSignedTransaction(signedFundSenderTx.rawTransaction);
  
    // Transactions to claim ARB and send to recipient
    const transactions = [
      {
        from: senderAddress,
        to: claimContractAddress,
        gas: '350000',
        gasPrice: increasedGasPrice,
        nonce: nonce_1,
        data: claimContract.methods.claim().encodeABI(),
      },
      {
        from: senderAddress,
        to: contractAddress,
        gas: '500000',
        gasPrice: increasedGasPrice,
        nonce: nonce_1 +1,
        data: contract.methods.transfer(recipientAddress, tokenAmount).encodeABI(),
      },
    ];
  
    await sendTransactions(transactions, senderPrivateKey);
  }

async function sendTransactions(transactions, senderPrivateKey) {
    for (const [index, transaction] of transactions.entries()) {
      console.log(`Sending transaction ${index + 1}`);
      await sendTransactionWithRetry(transaction, senderPrivateKey, 10);
    }
  }

// Function to send a transaction and retry if it fails
async function sendTransactionWithRetry(transaction, senderPrivateKey, retryCount) {
  try {
    const signedTransaction = await web3.eth.accounts.signTransaction(transaction, senderPrivateKey);
    web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)
      .once('transactionHash', (hash) => {
        console.log(`Transaction hash:`, hash);
      })
      .once('receipt', (receipt) => {
        console.log(`Transaction was successful?`, receipt.status);
      })
      .on('error', async (error) => {
          await sendTransactionWithRetry(transaction, senderPrivateKey, retryCount - 1);
      });

  } catch (error) {
    console.log('Error:', error);
  }
}

claimAndSendARB(armut, senderAddress, armutPrivateKey, senderPrivateKey, claimAmount)
  .then((result) => {
    parentPort.postMessage(result);
  })
  .catch((error) => {
    parentPort.postMessage({ error: error.message });
  });
