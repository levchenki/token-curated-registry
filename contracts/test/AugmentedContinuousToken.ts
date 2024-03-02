import "@nomicfoundation/hardhat-viem/internal/type-extensions";
import hre from "hardhat";
import {expect} from "chai";

const initialName = 'AugmentedContinuousTokenName';
const initialSymbol = 'CT';
const initialTokenSupply = 100_000_000n * BigInt(1e18)
const initialReserveRatio = 900_000; // from 1 to 1_000_000

const initialAccumulationDuration = 5n;

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function stringify(bigIntValue: bigint): string {
    const decimalPlaces = 18;
    let str = bigIntValue.toString();
    if (str.length > decimalPlaces) {
        const index = str.length - decimalPlaces;
        str = str.slice(0, index) + '.' + str.slice(index);
    } else {
        str = '0.' + str.padStart(decimalPlaces, '0');
    }
    return parseFloat(str).toLocaleString('fullwide', {useGrouping: false});
}

function generateRandomBigInt(minDecimals: number, maxDecimals: number): bigint {
    const decimalPlaces = Math.floor(Math.random() * (maxDecimals - minDecimals + 1)) + minDecimals;
    const max = BigInt('1' + '0'.repeat(decimalPlaces));
    return BigInt(Math.floor(Math.random() * Number(max)));
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

        it('should be the correct number of reserve ratio after creation', async () => {
            const {token} = await deployTokenFixture();
            const reserveRatio = await token.read.reserveRatio()
            expect(reserveRatio).to.equal(initialReserveRatio)
        });

        it('should be the correct accumulation duration after creation', async () => {
            const {token} = await deployTokenFixture();
            const accumulationDuration = await token.read.accumulationDuration()
            expect(accumulationDuration).to.equal(initialAccumulationDuration)
        });

        it('should be the correct owner after creation', async () => {
            const {token, owner} = await deployTokenFixture();
            const contractOwner = (await token.read.owner()).toLowerCase()
            expect(contractOwner).to.equal(owner.account.address)
        });

        it('should be the correct owner balance after creation', async () => {
            const {token, owner} = await deployTokenFixture();
            const ownerBalance = await token.read.balanceOf([owner.account.address])
            expect(ownerBalance).to.equal(0n)
        });

        it('should be the correct owner deposit after creation', async () => {
            const {token, owner} = await deployTokenFixture();
            const ownerDeposit = await token.read.deposits([owner.account.address])
            expect(ownerDeposit).to.equal(0n)
        });

        it('should be the correct first client balance after creation', async () => {
            const {token, first} = await deployTokenFixture();
            const ownerDeposit = await token.read.deposits([first.account.address])
            expect(ownerDeposit).to.equal(0n)
        });
        it('should be the correct first client deposit after creation', async () => {
            const {token, first} = await deployTokenFixture();
            const ownerDeposit = await token.read.deposits([first.account.address])
            expect(ownerDeposit).to.equal(0n)
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

        it('should be the zero tokens on owner\'s balance after first deposit', async () => {
            const {token, owner, first} = await deployTokenFixture();
            const depositAmount = 1n * BigInt(1e18);

            await token.write.deposit({value: depositAmount, account: first.account.address});
            const clientBalance = await token.read.balanceOf([first.account.address])
            const ownerBalance = await token.read.balanceOf([owner.account.address])
            expect(clientBalance).to.equal(0n)
            expect(ownerBalance).to.equal(0n)
            expect(ownerBalance + clientBalance).to.equal(0n)
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

    describe('Deposits distribution', () => {
        it('should be the correct number of reserve tokens after distribution', async () => {
            const {token, owner, first} = await deployTokenFixture();
            const depositAmount = 100n * BigInt(1e18);
            await token.write.deposit({value: depositAmount, account: first.account.address});

            await sleep(Number(initialAccumulationDuration) * 1000)
            await token.write.distribute({account: owner.account.address})

            const reserveBalance = await token.read.getReserveBalance()
            expect(reserveBalance).to.equal(depositAmount)
        });


        it('should be the correct balance of tokens after distribution for one depositor', async () => {
            const {token, owner, first} = await deployTokenFixture();
            const depositAmount = 100n * BigInt(1e18);
            await token.write.deposit({value: depositAmount, account: first.account.address});

            await sleep(Number(initialAccumulationDuration) * 1000)
            await token.write.distribute({account: owner.account.address})

            const clientBalance = await token.read.balanceOf([first.account.address])
            expect(clientBalance).to.equal(initialTokenSupply)
        });

        it('should be the correct balance of tokens after distribution for two depositors', async () => {
            const {token, owner, first, second} = await deployTokenFixture();
            const firstDepositAmount = 100n * BigInt(1e18);
            await token.write.deposit({value: firstDepositAmount, account: first.account.address});

            const secondDepositAmount = 200n * BigInt(1e18);
            await token.write.deposit({value: secondDepositAmount, account: second.account.address});

            await sleep(Number(initialAccumulationDuration) * 1000)
            await token.write.distribute({account: owner.account.address})

            const reserveBalance = await token.read.getReserveBalance()
            const firstClientBalance = await token.read.balanceOf([first.account.address])
            const secondClientBalance = await token.read.balanceOf([second.account.address])

            expect(reserveBalance).to.equal(firstDepositAmount + secondDepositAmount)
            const firstExpected = (firstDepositAmount * initialTokenSupply) / reserveBalance
            const secondExpected = (secondDepositAmount * initialTokenSupply) / reserveBalance
            expect(firstClientBalance).to.equal(firstExpected)
            expect(secondClientBalance).to.equal(secondExpected)

            const ownerBalance = await token.read.balanceOf([owner.account.address])

            expect(firstClientBalance + secondClientBalance + ownerBalance).to.equal(initialTokenSupply)
        });
        it('should be the correct balance of tokens after distribution for three depositors', async () => {
            const {
                token,
                owner,
                first,
                second,
                third
            } = await deployTokenFixture();
            const firstDepositAmount = 213n * BigInt(1e18);
            await token.write.deposit({value: firstDepositAmount, account: first.account.address});

            const secondDepositAmount = 742n * BigInt(1e18);
            await token.write.deposit({value: secondDepositAmount, account: second.account.address});

            const thirdDepositAmount = 1213n * BigInt(1e18);
            await token.write.deposit({value: thirdDepositAmount, account: third.account.address});

            await sleep(Number(initialAccumulationDuration) * 1000)
            await token.write.distribute({account: owner.account.address})

            const reserveBalance = await token.read.getReserveBalance()
            const firstClientBalance = await token.read.balanceOf([first.account.address])
            const secondClientBalance = await token.read.balanceOf([second.account.address])
            const thirdClientBalance = await token.read.balanceOf([third.account.address])

            expect(reserveBalance).to.equal(firstDepositAmount + secondDepositAmount + thirdDepositAmount)
            const firstExpected = (firstDepositAmount * initialTokenSupply) / reserveBalance
            const secondExpected = (secondDepositAmount * initialTokenSupply) / reserveBalance
            const thirdExpected = (thirdDepositAmount * initialTokenSupply) / reserveBalance
            expect(firstClientBalance).to.equal(firstExpected)
            expect(secondClientBalance).to.equal(secondExpected)
            expect(thirdClientBalance).to.equal(thirdExpected)

            const ownerBalance = await token.read.balanceOf([owner.account.address])
            expect(firstClientBalance + secondClientBalance + thirdClientBalance + ownerBalance).to.equal(initialTokenSupply)
        });

        it('should be the correct balance of tokens after distribution for many depositors ', async () => {
            const {token, owner} = await deployTokenFixture();
            const clients = await hre.viem.getWalletClients();

            const depositorsCount = 15;
            const deposits: bigint[] = new Array(depositorsCount).fill(0n)

            for (let i = 1; i <= depositorsCount; i++) {
                const depositAmount = generateRandomBigInt(18, 21);
                deposits[i] = depositAmount;
                await token.write.deposit({value: depositAmount, account: clients[i].account.address});
            }

            await sleep(Number(initialAccumulationDuration) * 1000)
            await token.write.distribute({account: owner.account.address})

            const reserveBalance = await token.read.getReserveBalance()
            const totalSupply = await token.read.totalSupply()
            const ownerBalance = await token.read.balanceOf([owner.account.address])

            let clientSum = 0n;
            for (let i = 1; i <= depositorsCount; i++) {
                const clientBalance = await token.read.balanceOf([clients[i].account.address])
                clientSum += clientBalance
                console.log(`Client ${i} balance: ${stringify(clientBalance)}, initial deposit: ${stringify(deposits[i])}`)
                expect(clientBalance).to.equal((deposits[i] * totalSupply) / reserveBalance)
            }

            console.log(`Total supply: ${stringify(totalSupply)}`)
            console.log(`Reserve balance: ${stringify(reserveBalance)}`)
            console.log(`Owner balance: ${stringify(ownerBalance)}`)
            console.log(`Client sum: ${stringify(clientSum)}`)
            expect(clientSum + ownerBalance).to.equal(totalSupply)

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
