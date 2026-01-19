const { ethers } = require("hardhat");
const config = require("./bridge_config.json");

async function main() {
    const [user] = await ethers.getSigners();
    
    // Connect to source components
    const bridge = await ethers.getContractAt("Bridge", config.source, user);
    const token = await ethers.getContractAt("OriginalToken", config.origToken, user);

    const amount = ethers.parseEther("50");

    console.log("Approving Bridge...");
    await token.approve(config.source, amount);

    console.log(`Locking 50 Tokens on Source Bridge...`);
    const tx = await bridge.lock(amount);
    await tx.wait();

    console.log("Tokens Locked! Waiting for Validator to pick this up...");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
