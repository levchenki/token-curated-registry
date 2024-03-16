import "@nomicfoundation/hardhat-viem/internal/type-extensions";
import hre from "hardhat";
import {expect} from "chai";


const initialName = 'ContinuousTokenName';
const initialSymbol = 'CT';
const initialTokenSupply = 1_000n * BigInt(1e18)
const initialReserveRatio = 900_000; // from 1 to 1_000_000
const initialReserveTokenSupply = 10n * BigInt(1e18)

describe('ETHContinuousToken', () => {

    async function deployTokenFixture() {
        const [owner, otherAccount] = await hre.viem.getWalletClients();
        const token = await hre.viem.deployContract('ETHContinuousToken', [
            initialName,
            initialSymbol,
            initialTokenSupply,
            initialReserveRatio,
            owner.account.address
        ], {value: initialReserveTokenSupply, walletClient: owner});

        return {
            owner,
            otherAccount,
            token,
        }
    }

    it('should be the correct number of tokens after creation', async () => {
        const {token} = await deployTokenFixture();
        const totalSupply = await token.read.totalSupply()
        expect(totalSupply).to.equal(initialTokenSupply)
    });

    it('should be the correct number of reserve tokens after creation', async () => {
        const {token} = await deployTokenFixture();
        const reserveBalance = await token.read.getReserveBalance()
        expect(reserveBalance).to.equal(initialReserveTokenSupply)
    });

    it('should be the correct reserve ration after creation', async () => {
        const {token} = await deployTokenFixture();
        const reserveRatio = await token.read.reserveRatio()
        expect(reserveRatio).to.equal(initialReserveRatio)
    });

    it('should mint correctly', async () => {
        const {token, owner} = await deployTokenFixture();
        const totalSupplyBeforeMint = await token.read.totalSupply();
        const reserveBalanceBeforeMint = await token.read.getReserveBalance();

        const priceInETH = 10n * BigInt(1e18);
        const purchasedTokens = await token.read.getContinuousMintReward([priceInETH]);

        await token.write.mint({value: priceInETH, account: owner.account.address});

        const totalSupplyAfterMint = await token.read.totalSupply();
        const reserveBalanceAfterMint = await token.read.getReserveBalance();

        expect(totalSupplyAfterMint).to.equal(totalSupplyBeforeMint + purchasedTokens);
        expect(reserveBalanceAfterMint).to.equal(reserveBalanceBeforeMint + priceInETH);
    });

    it('should burn correctly', async () => {
        const {token, owner} = await deployTokenFixture();
        const totalSupplyBeforeBurn = await token.read.totalSupply();
        const reserveBalanceBeforeBurn = await token.read.getReserveBalance();

        const priceInContinuousTokens = 100n * BigInt(1e18);
        const saledTokens = await token.read.getContinuousBurnRefund([priceInContinuousTokens]);

        await token.write.burn([priceInContinuousTokens], {account: owner.account.address});

        const totalSupplyAfterBurn = await token.read.totalSupply();
        const reserveBalanceAfterBurn = await token.read.getReserveBalance();

        expect(totalSupplyAfterBurn).to.equal(totalSupplyBeforeBurn - priceInContinuousTokens);
        expect(reserveBalanceAfterBurn).to.equal(reserveBalanceBeforeBurn - saledTokens);
    });

    it('should throw an error when trying to mint with 0 value', async () => {
        const {token, owner} = await deployTokenFixture();
        const priceInETH = 0n;
        await expect(token.write.mint({
            value: priceInETH,
            account: owner.account.address
        })).to.be.rejectedWith('Deposit must be non-zero.');

    });

    it('should throw an error when trying to burn with 0 value', async () => {
        const {token, owner} = await deployTokenFixture();
        const priceInContinuousTokens = 0n;
        await expect(token.write.burn(
            [priceInContinuousTokens],
            {account: owner.account.address}
        )).to.be.rejectedWith('Amount must be non-zero.');
    });

    it('should throw an error when trying to burn more than user has', async () => {
        const {token, owner} = await deployTokenFixture();

        const ownerBalance = await token.read.balanceOf([owner.account.address]);
        const priceInContinuousTokens = ownerBalance + 1n;

        await expect(token.write.burn(
            [priceInContinuousTokens],
            {account: owner.account.address}
        )).to.be.rejectedWith('Insufficient tokens to burn.');
    });

    it('should throw an error when trying to burn more than contract has', async () => {
        const {token, owner} = await deployTokenFixture();

        const totalSupply = await token.read.totalSupply();
        const priceInContinuousTokens = totalSupply + 1n;

        await expect(token.write.burn(
            [priceInContinuousTokens],
            {account: owner.account.address}
        )).to.be.rejectedWith('Insufficient tokens to burn.');

    });

    it('should increase cost of token after every minting', async () => {
        const {token, owner} = await deployTokenFixture();

        const iterations = 10;
        const priceInETH = 1n * BigInt(1e18);
        let previousPrice;
        for (let i = 1; i <= iterations; i++) {
            const reserveBalanceBeforeMint = await token.read.getReserveBalance();
            const reserveBalanceDiff = reserveBalanceBeforeMint - priceInETH;

            const totalSupplyBeforeMint = await token.read.totalSupply();
            await token.write.mint({value: priceInETH, account: owner.account.address});
            const totalSupplyAfterMint = await token.read.totalSupply();
            const totalSupplyDiff = totalSupplyAfterMint - totalSupplyBeforeMint;

            const price = Number(reserveBalanceDiff) / Number(totalSupplyDiff);
            if (previousPrice) {
                expect(price).to.be.greaterThan(previousPrice);
            }
            previousPrice = price;
        }
    })

    it('should reduce cost of token after every burning', async () => {
        const {token, owner} = await deployTokenFixture();

        const iterations = 10;
        const priceInContinuousTokens = 10n * BigInt(1e18);
        const ownerBalance = await token.read.balanceOf([owner.account.address]);
        let previousPrice;
        for (let i = 1; i <= iterations && ownerBalance >= priceInContinuousTokens; i++) {
            const reserveBalanceBeforeBurn = await token.read.getReserveBalance();
            const totalSupplyBeforeBurn = await token.read.totalSupply();

            await token.write.burn([priceInContinuousTokens], {account: owner.account.address});
            const reserveBalanceAfterBurn = await token.read.getReserveBalance();
            const totalSupplyAfterBurn = await token.read.totalSupply();

            const reserveBalanceDiff = reserveBalanceBeforeBurn - reserveBalanceAfterBurn;
            const totalSupplyDiff = totalSupplyBeforeBurn - totalSupplyAfterBurn;

            const price = Number(reserveBalanceDiff) / Number(totalSupplyDiff);
            if (previousPrice) {
                expect(price).to.be.lessThan(previousPrice);
            }
            previousPrice = price;
        }
    })
});