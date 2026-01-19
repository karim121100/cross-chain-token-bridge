const { ethers } = require("hardhat");
const config = require("./bridge_config.json");

async function main() {
    const [admin] = await ethers.getSigners();
    
    // Listen to Source, Write to Dest
    const sourceBridge = await ethers.getContractAt("Bridge", config.source, admin);
    const destBridge = await ethers.getContractAt("Bridge", config.dest, admin);

    console.log("--- Bridge Validator Node Started ---");
    console.log("Listening for Deposit events on Source...");

    // Event Listener
    sourceBridge.on("Deposit", async (user, amount, timestamp, event) => {
        console.log(`\n[EVENT DETECTED] User ${user} deposited ${ethers.formatEther(amount)} tokens.`);
        
        console.log("Validating transaction...");
        // In real life, wait for X block confirmations here

        console.log("Releasing Wrapped Tokens on Destination...");
        try {
            const tx = await destBridge.release(user, amount);
            await tx.wait();
            console.log(`[SUCCESS] Minted ${ethers.formatEther(amount)} wETHN to ${user}`);
        } catch (e) {
            console.error("[FAILED]", e.message);
        }
    });
}

main();
