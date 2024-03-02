import hre from "hardhat";

async function main() {
    const [deployer] = await hre.viem.getWalletClients();

    console.log(
        `Deploying contracts with the account: ${deployer.account.address}`,
    );

    const initialName = 'TestContinuousToken';
    const initialSymbol = 'TCT';
    const initialSupply = 10000n * BigInt(1e18);
    const reserveRatio = 900_000;
    const accumulationDuration = 1n;

    const token = await hre.viem.deployContract("AugmentedContinuousToken", [
        initialName,
        initialSymbol,
        initialSupply,
        reserveRatio,
        deployer.account.address,
        accumulationDuration
    ], {walletClient: deployer});

    console.log("AugmentedContinuousToken deployed to:", token.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});