const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying infrastructure...");

    // 1. Deploy Original Token (Source Chain)
    const Orig = await ethers.getContractFactory("OriginalToken");
    const origToken = await Orig.deploy();
    const origAddr = await origToken.getAddress();

    // 2. Deploy Wrapped Token (Dest Chain)
    const Wrap = await ethers.getContractFactory("WrappedToken");
    const wrapToken = await Wrap.deploy("Wrapped ETHN", "wETHN");
    const wrapAddr = await wrapToken.getAddress();

    // 3. Deploy Source Bridge (Locks Original)
    const Bridge = await ethers.getContractFactory("Bridge");
    const sourceBridge = await Bridge.deploy(origAddr, false); // isDestination = false
    const sourceAddr = await sourceBridge.getAddress();

    // 4. Deploy Dest Bridge (Mints Wrapped)
    const destBridge = await Bridge.deploy(wrapAddr, true); // isDestination = true
    const destAddr = await destBridge.getAddress();

    // 5. Connect Permissions
    await wrapToken.setBridge(destAddr);
    console.log("Permissions set.");

    // Save Config
    const config = { 
        source: sourceAddr, 
        dest: destAddr, 
        origToken: origAddr,
        wrapToken: wrapAddr
    };
    fs.writeFileSync("bridge_config.json", JSON.stringify(config));
    console.log("Bridge System Deployed!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
