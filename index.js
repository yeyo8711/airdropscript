const fs = require("fs");
const { ethers } = require("ethers");

// CONTRACT STUFF
const abi = require("./abi.json");
const contractAddress = "0xC690b21314E14649A1B01F3B6452a84Ab692140e"; // REPLACE WITH CORRECT ADDRESS
// ETHERS STUFF
const provider = new ethers.providers.JsonRpcProvider(
  "https://rpc.ankr.com/polygon"
);
const wallet = new ethers.Wallet(
  "", // UPDATE WITH YOUR PRIVATE KEY
  provider
);
const RecipientNFT8 = new ethers.Contract(contractAddress, abi, wallet);

// WALLETS
const addresses = require("./wallets.json");

const main = async () => {
  try {
    const airdrop = await RecipientNFT8.airdrop1(addresses);
    await airdrop.wait();
    console.log(
      `Successfull transaction https://polygonscan.com/${airdrop.hash}`
    );
  } catch (error) {
    console.log(error);
  }
};

main().catch((error) => console.log(error));
