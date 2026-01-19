require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  paths: {
    sources: ".",
    tests: ".",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  networks: {
    hardhat: {},
    // In production, you would have two networks configured here:
    // sepolia: { url: ... },
    // mumbai: { url: ... }
  }
};
