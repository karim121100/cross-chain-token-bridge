const { ethers } = require("hardhat");
const config = require("./bridge_config.json");

async function main() {
    const [user] = await ethers.getSigners();
    
    const origToken = await ethers.getContractAt("OriginalToken", config.origToken, user);
    const wrapToken = await ethers.getContractAt("WrappedToken", config.wrapToken, user);

    const bal1 = await origToken.balanceOf(user.address);
    const bal2 = await wrapToken.balanceOf(user.address);

    console.log(`Source Chain Balance: ${ethers.formatEther(bal1)} ETHN`);
    console.log(`Dest Chain Balance:   ${ethers.formatEther(bal2)} wETHN`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
