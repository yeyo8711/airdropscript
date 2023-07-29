const fs = require("fs");
const { ethers } = require("ethers");

// CONTRACT STUFF
const abi = require("./abi.json");
const contractAddress = "0xcE973c7f15b7607c3320D45F302a69FD5E59EbCa"; // REPLACE WITH CORRECT ADDRESS
// ETHERS STUFF
const provider = new ethers.providers.JsonRpcProvider(
  "https://rpc.ankr.com/polygon"
);
const wallet = new ethers.Wallet("", provider); // REPLACE WITH PRIVATE KEY
const RecipientNFT8 = new ethers.Contract(contractAddress, abi, wallet);

// WALLETS
const addresses = require("./wallets.json");
const batchSize = 500; // AMOUNT PER BATCH
const numberOfBatches = Math.ceil(addresses.length / batchSize);

const main = async () => {
  for (let i = 0; i < numberOfBatches; i++) {
    const startIndex = i * batchSize;
    const endIndex = Math.min(startIndex + batchSize, addresses.length);
    const addressesBlock = addresses.slice(startIndex, endIndex);

    try {
      const gasPrice = await provider.getGasPrice();
      const formattedGas = ethers.utils.formatUnits(gasPrice, "gwei");
      console.log(
        `Minting ${startIndex} - ${endIndex} with ${formattedGas} gas`
      );

      const airdrop = await RecipientNFT8.airdrop1(addressesBlock, {
        gasPrice,
      });
      await airdrop.wait();
      console.log(
        `Successfull transaction https://polygonscan.com/${airdrop.hash}`
      );
    } catch (error) {
      console.log(error);
    }
  }

  // Handle the remaining addresses after processing the blocks of 500 addresses
  const remainingAddresses = addresses.slice(numberOfBatches * batchSize);
  if (remainingAddresses.length > 0) {
    console.log(
      `Processing remaining ${remainingAddresses.length} addresses...`
    );

    try {
      console.log(`Minting...`);

      const airdrop = await RecipientNFT8.airdrop1(remainingAddresses);
      await airdrop.wait();
      console.log(
        `Successfull transaction https://polygonscan.com/${airdrop.hash}`
      );
    } catch (error) {
      console.log(error);
    }
  }
};

main().catch((error) => console.log(error));
