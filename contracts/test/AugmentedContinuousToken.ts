import "@nomicfoundation/hardhat-viem/internal/type-extensions";
import hre from "hardhat";
import {expect} from "chai";

const initialName = 'AugmentedContinuousTokenName';
const initialSymbol = 'CT';
const initialTokenSupply = 1_000n * BigInt(1e18)
const initialReserveRatio = 900_000; // from 1 to 1_000_000

const initialAccumulationDuration = 5n;

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}


describe('AugmentedContinuousToken', () => {
    async function deployTokenFixture() {
        const [owner, first, second, third] = await hre.viem.getWalletClients();
        const token = await hre.viem.deployContract('AugmentedContinuousToken', [
            initialName,
            initialSymbol,
            initialTokenSupply,
            initialReserveRatio,
            owner.account.address,
            initialAccumulationDuration
        ], {walletClient: owner});


        return {
            owner,
            first,
            second,
            third,
            token
        }
    }

    describe('Creation', () => {
        it('should be the correct number of tokens after creation', async () => {
            const {token} = await deployTokenFixture();
            const totalSupply = await token.read.totalSupply()
            expect(totalSupply).to.equal(initialTokenSupply)
        });

        it('should be the correct number of reserve tokens after creation', async () => {
            const {token} = await deployTokenFixture();
            const reserveBalance = await token.read.getReserveBalance()
            expect(reserveBalance).to.equal(0n)
        });
    });

    describe('Deposits', () => {
        it('should be the correct number of reserve tokens after first deposit', async () => {
            const {token, first} = await deployTokenFixture();
            const depositAmount = 1n * BigInt(1e18);

            await token.write.deposit({value: depositAmount, account: first.account.address});
            const tokenSupply = await token.read.totalSupply()
            const reserveBalance = await token.read.getReserveBalance()

            expect(tokenSupply).to.equal(initialTokenSupply)
            expect(reserveBalance).to.equal(depositAmount)
        });

        it('should be the zero tokens on depositor\'s balance after first deposit', async () => {
            const {token, first} = await deployTokenFixture();
            const depositAmount = 1n * BigInt(1e18);

            await token.write.deposit({value: depositAmount, account: first.account.address});
            const clientBalance = await token.read.balanceOf([first.account.address])
            expect(clientBalance).to.equal(0n)
        });

        it('should be the correct number of reserve tokens on depositor\'s balance after first deposit', async () => {
            const {token, first} = await deployTokenFixture();
            const depositAmount = 1n * BigInt(1e18);

            const depositBefore = await token.read.deposits([first.account.address]);
            expect(depositBefore).to.equal(0n)

            await token.write.deposit({value: depositAmount, account: first.account.address});

            const depositAfter = await token.read.deposits([first.account.address]);
            expect(depositAfter).to.equal(depositAmount)
        });

        it('should be the correct number of reserve tokens on depositor\'s balances after their first deposit', async () => {
            const {token, first, second, third} = await deployTokenFixture();

            const firstDepositAmount = 1n * BigInt(1e18);
            const firstDepositBefore = await token.read.deposits([first.account.address]);
            expect(firstDepositBefore).to.equal(0n)
            await token.write.deposit({value: firstDepositAmount, account: first.account.address});
            const firstDepositAfter = await token.read.deposits([first.account.address]);
            expect(firstDepositAfter).to.equal(firstDepositAmount)


            const secondDepositAmount = 20n * BigInt(1e18);
            const secondDepositBefore = await token.read.deposits([second.account.address]);
            expect(secondDepositBefore).to.equal(0n)
            await token.write.deposit({value: secondDepositAmount, account: second.account.address});
            const secondDepositAfter = await token.read.deposits([second.account.address]);
            expect(secondDepositAfter).to.equal(secondDepositAmount)

            const thirdDepositAmount = 30n * BigInt(1e18);
            const thirdDepositBefore = await token.read.deposits([third.account.address]);
            expect(thirdDepositBefore).to.equal(0n)
            await token.write.deposit({value: thirdDepositAmount, account: third.account.address});
            const thirdDepositAfter = await token.read.deposits([third.account.address]);
            expect(thirdDepositAfter).to.equal(thirdDepositAmount)
        });

        it('should be the correct number of reserve tokens on depositor\'s balance after two deposits', async () => {
            const {token, first} = await deployTokenFixture();
            const firstDepositAmount = 325n * BigInt(1e18);
            const secondDepositAmount = 100n * BigInt(1e18);

            const depositBeforeFirst = await token.read.deposits([first.account.address]);
            expect(depositBeforeFirst).to.equal(0n)

            await token.write.deposit({value: firstDepositAmount, account: first.account.address});

            const depositBeforeSecond = await token.read.deposits([first.account.address]);
            expect(depositBeforeSecond).to.equal(firstDepositAmount)

            await token.write.deposit({value: secondDepositAmount, account: first.account.address});

            const depositAfter = await token.read.deposits([first.account.address]);
            expect(depositAfter).to.equal(firstDepositAmount + secondDepositAmount)
        });

    });

    describe('Errors', () => {
        it('should not allow to deposit zero amount', async () => {
            const {token, first} = await deployTokenFixture();
            const depositAmount = 0n;

            await expect(token.write.deposit({
                value: depositAmount,
                account: first.account.address
            })).to.be.rejectedWith('Deposit must be greater than 0')
        });

        it('should be forbidden to mint tokens before active period', async () => {
            const {token, first} = await deployTokenFixture();
            const priceInETH = 1n * BigInt(1e18);

            await expect(token.write.mint({
                value: priceInETH,
                account: first.account.address
            })).to.be.rejectedWith('The active period has not started yet')
        });

        it('should be forbidden to burn tokens before active period', async () => {
            const {token, first} = await deployTokenFixture();
            const price = 1n * BigInt(1e18);

            await expect(token.write.burn([price], {
                account: first.account.address
            })).to.be.rejectedWith('The active period has not started yet')
        });

        it('should be forbidden to distribute deposits before the end of the accumulation period', async () => {
            const {token, owner, first} = await deployTokenFixture();
            const depositAmount = 1n * BigInt(1e18);
            await token.write.deposit({value: depositAmount, account: first.account.address});

            await expect(token.write.distribute({
                account: owner.account.address
            })).to.be.rejectedWith('Accumulation duration has not ended yet')
        });

        it('should be forbidden to distribute deposits to a non-owner', async () => {
            const {token, first} = await deployTokenFixture();
            const depositAmount = 1n * BigInt(1e18);
            await token.write.deposit({value: depositAmount, account: first.account.address});

            await expect(token.write.distribute({
                account: first.account.address
            })).to.be.rejectedWith()
        });

        it('should be forbidden to burn tokens before active period', async () => {
            const {token, first} = await deployTokenFixture();
            const price = 1n * BigInt(1e18);

            await expect(
                first.sendTransaction({
                    to: token.address,
                    value: price,
                })).to.be.rejectedWith('The active period has not started yet')
        });


        it('should be forbidden to distribute deposits while accumulation time is not over yet ', async () => {
            const {token, owner, first} = await deployTokenFixture();
            const depositAmount = 1n * BigInt(1e18);
            await token.write.deposit({value: depositAmount, account: first.account.address});
            await expect(token.write.distribute({
                account: owner.account.address
            })).to.be.rejectedWith('Accumulation duration has not ended yet')
        })

        it('should be forbidden to distribute deposits with 0 reserve balance', async () => {
            const {token, owner} = await deployTokenFixture();

            await sleep(Number(initialAccumulationDuration) * 1000)
            await expect(token.write.distribute({
                account: owner.account.address
            })).to.be.rejectedWith('Reserve must be greater than 0')
        })

        it('should be forbidden to deposit during the active period', async () => {
            const {token, owner, first} = await deployTokenFixture();
            const depositAmount = 1n * BigInt(1e18);

            await token.write.deposit({value: depositAmount, account: first.account.address});
            await sleep(Number(initialAccumulationDuration) * 1000)
            await token.write.distribute({account: owner.account.address})

            await expect(token.write.deposit({
                value: depositAmount,
                account: first.account.address
            })).to.be.rejectedWith('Accumulation period has ended')
        });

        it('should be forbidden to distribute deposits during the active period', async () => {
            const {token, owner, first} = await deployTokenFixture();
            const depositAmount = 1n * BigInt(1e18);

            await token.write.deposit({value: depositAmount, account: first.account.address});
            await sleep(Number(initialAccumulationDuration) * 1000)
            await token.write.distribute({account: owner.account.address})

            await expect(token.write.distribute({
                account: owner.account.address
            })).to.be.rejectedWith('Accumulation period has ended')
        });
    })
});
