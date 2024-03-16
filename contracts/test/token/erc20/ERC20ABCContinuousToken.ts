import "@nomicfoundation/hardhat-viem/internal/type-extensions";
import hre from "hardhat";
import {expect} from "chai";

const initialName = 'ERC20ABCContinuousToken';
const initialSymbol = 'CT';
const initialTokenSupply = 100_000_000n * BigInt(1e18)
const initialReserveRatio = 900_000; // from 1 to 1_000_000

const initialAccumulationDuration = 3n;

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

describe('ERC20ABCContinuousToken', () => {
    async function deployTokenFixture() {
        const walletClients = await hre.viem.getWalletClients()
        const owner = walletClients[0];
        const first = walletClients[1];
        const second = walletClients[2];
        const third = walletClients[3];


        const erc20Token = await hre.viem.deployContract('ReserveERC20Token', [
            'ERC20TestToken',
            'ETT'
        ], {walletClient: owner})


        const token = await hre.viem.deployContract('ERC20ABCContinuousToken', [
            initialName,
            initialSymbol,
            initialTokenSupply,
            initialReserveRatio,
            owner.account.address,
            initialAccumulationDuration,
            erc20Token.address
        ], {walletClient: owner});

        const reserveERC20TokensForClient = 1_000_000_000_000n * BigInt(1e18);
        for (let i = 0; i < walletClients.length; i++) {
            await erc20Token.write.mint([reserveERC20TokensForClient], {account: walletClients[i].account.address});
            await erc20Token.write.approve([token.address, reserveERC20TokensForClient], {account: walletClients[i].account.address})
        }

        async function activateToken() {
            const ms = 1000;
            await sleep(Number(initialAccumulationDuration) * ms);
        }

        return {
            owner,
            first,
            second,
            third,
            token,
            erc20Token,
            activateToken
        }
    }

    describe('Creation', () => {
        it('should be the correct number of tokens after creation', async () => {
            const {token} = await deployTokenFixture();
            const totalSupply = await token.read.totalSupply()
            expect(totalSupply).to.equal(0n)
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

            await token.write.deposit([depositAmount], {account: first.account.address});
            const tokenSupply = await token.read.totalSupply()
            const reserveBalance = await token.read.getReserveBalance()

            expect(tokenSupply).to.equal(0n)
            expect(reserveBalance).to.equal(depositAmount)
        });

        it('should be the zero tokens on depositor\'s balance after first deposit', async () => {
            const {token, first} = await deployTokenFixture();
            const depositAmount = 1n * BigInt(1e18);

            await token.write.deposit([depositAmount], {account: first.account.address});
            const clientBalance = await token.read.balanceOf([first.account.address])
            expect(clientBalance).to.equal(0n)
        });

        it('should be the zero tokens on owner\'s balance after first deposit', async () => {
            const {token, owner, first} = await deployTokenFixture();
            const depositAmount = 1n * BigInt(1e18);

            await token.write.deposit([depositAmount], {account: first.account.address});
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

            await token.write.deposit([depositAmount], {account: first.account.address});

            const depositAfter = await token.read.deposits([first.account.address]);
            expect(depositAfter).to.equal(depositAmount)
        });

        it('should be the correct number of reserve tokens on depositor\'s balances after their first deposit', async () => {
            const {token, first, second, third} = await deployTokenFixture();

            const firstDepositAmount = 1n * BigInt(1e18);
            const firstDepositBefore = await token.read.deposits([first.account.address]);
            expect(firstDepositBefore).to.equal(0n)
            await token.write.deposit([firstDepositAmount], {account: first.account.address});
            const firstDepositAfter = await token.read.deposits([first.account.address]);
            expect(firstDepositAfter).to.equal(firstDepositAmount)


            const secondDepositAmount = 20n * BigInt(1e18);
            const secondDepositBefore = await token.read.deposits([second.account.address]);
            expect(secondDepositBefore).to.equal(0n)
            await token.write.deposit([secondDepositAmount], {account: second.account.address});
            const secondDepositAfter = await token.read.deposits([second.account.address]);
            expect(secondDepositAfter).to.equal(secondDepositAmount)

            const thirdDepositAmount = 30n * BigInt(1e18);
            const thirdDepositBefore = await token.read.deposits([third.account.address]);
            expect(thirdDepositBefore).to.equal(0n)
            await token.write.deposit([thirdDepositAmount], {account: third.account.address});
            const thirdDepositAfter = await token.read.deposits([third.account.address]);
            expect(thirdDepositAfter).to.equal(thirdDepositAmount)
        });

        it('should be the correct number of reserve tokens on depositor\'s balance after two deposits', async () => {
            const {token, first} = await deployTokenFixture();
            const firstDepositAmount = 325n * BigInt(1e18);
            const secondDepositAmount = 100n * BigInt(1e18);

            const depositBeforeFirst = await token.read.deposits([first.account.address]);
            expect(depositBeforeFirst).to.equal(0n)

            await token.write.deposit([firstDepositAmount], {account: first.account.address});

            const depositBeforeSecond = await token.read.deposits([first.account.address]);
            expect(depositBeforeSecond).to.equal(firstDepositAmount)

            await token.write.deposit([secondDepositAmount], {account: first.account.address});

            const depositAfter = await token.read.deposits([first.account.address]);
            expect(depositAfter).to.equal(firstDepositAmount + secondDepositAmount)
        });

        it('should return the correct number of deposit events after one deposit', async () => {
            const {token, first} = await deployTokenFixture();
            const depositAmount = 1n * BigInt(1e18);

            const depositEventsBefore = await token.getEvents.Deposited();
            expect(depositEventsBefore.length).to.equal(0)

            await token.write.deposit([depositAmount], {account: first.account.address});

            const depositEventsAfter = await token.getEvents.Deposited({fromBlock: 'earliest'});
            expect(depositEventsAfter.length).to.equal(1)
        });

        it('should return the correct number of deposit events after five deposits', async () => {
            const {token, first} = await deployTokenFixture();
            const depositAmount = 1n * BigInt(1e18);

            const depositEventsBefore = await token.getEvents.Deposited();
            expect(depositEventsBefore.length).to.equal(0)

            const depositCount = 5;
            for (let i = 0; i < depositCount; i++) {
                await token.write.deposit([depositAmount], {account: first.account.address});
            }

            const depositEventsAfter = await token.getEvents.Deposited({fromBlock: 'earliest'});
            expect(depositEventsAfter.length).to.equal(depositCount)
        });
    });

    describe('Deposits distribution', () => {
        it('should be the correct number of reserve tokens after distribution', async () => {
            const {token, owner, first, activateToken} = await deployTokenFixture();
            const depositAmount = 100n * BigInt(1e18);
            await token.write.deposit([depositAmount], {account: first.account.address});

            await activateToken();
            await token.write.distribute({account: owner.account.address})

            const reserveBalance = await token.read.getReserveBalance()
            expect(reserveBalance).to.equal(depositAmount)

            const distributionEvents = await token.getEvents.Distributed({fromBlock: 'earliest'});
            expect(distributionEvents.length).to.equal(1)
        });


        it('should be the correct balance of tokens after distribution for one depositor', async () => {
            const {token, owner, first, activateToken} = await deployTokenFixture();
            const depositAmount = 100n * BigInt(1e18);
            await token.write.deposit([depositAmount], {account: first.account.address});

            await activateToken();
            await token.write.distribute({account: owner.account.address})

            const clientBalance = await token.read.balanceOf([first.account.address])
            expect(clientBalance).to.equal(initialTokenSupply)

            const distributionEvents = await token.getEvents.Distributed({fromBlock: 'earliest'});
            expect(distributionEvents.length).to.equal(1)
        });

        it('should be the correct balance of tokens after distribution for two depositors', async () => {
            const {token, owner, first, second, activateToken} = await deployTokenFixture();
            const firstDepositAmount = 100n * BigInt(1e18);
            await token.write.deposit([firstDepositAmount], {account: first.account.address});

            const secondDepositAmount = 200n * BigInt(1e18);
            await token.write.deposit([secondDepositAmount], {account: second.account.address});

            await activateToken();
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

            const distributionEvents = await token.getEvents.Distributed({fromBlock: 'earliest'});
            if (ownerBalance > 0) {
                expect(distributionEvents.length).to.equal(3)
            } else {
                expect(distributionEvents.length).to.equal(2)
            }
        });
        it('should be the correct balance of tokens after distribution for three depositors', async () => {
            const {
                token,
                owner,
                first,
                second,
                third,
                activateToken
            } = await deployTokenFixture();
            const firstDepositAmount = 213n * BigInt(1e18);
            await token.write.deposit([firstDepositAmount], {account: first.account.address});

            const secondDepositAmount = 742n * BigInt(1e18);
            await token.write.deposit([secondDepositAmount], {account: second.account.address});

            const thirdDepositAmount = 1213n * BigInt(1e18);
            await token.write.deposit([thirdDepositAmount], {account: third.account.address});

            await activateToken();
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

            const distributionEvents = await token.getEvents.Distributed({fromBlock: 'earliest'});
            if (ownerBalance > 0) {
                expect(distributionEvents.length).to.equal(4)
            } else {
                expect(distributionEvents.length).to.equal(3)
            }
        });

        it('should be the correct balance of tokens after distribution for many depositors ', async () => {
            const {token, owner, activateToken} = await deployTokenFixture();
            const clients = await hre.viem.getWalletClients();

            const depositorsCount = 15;
            const deposits: bigint[] = new Array(depositorsCount).fill(0n)

            for (let i = 1; i <= depositorsCount; i++) {
                const depositAmount = generateRandomBigInt(18, 21);
                deposits[i] = depositAmount;
                await token.write.deposit([depositAmount], {account: clients[i].account.address});
            }

            await activateToken();
            await token.write.distribute({account: owner.account.address})

            const reserveBalance = await token.read.getReserveBalance()
            const totalSupply = await token.read.initialSupply()
            const ownerBalance = await token.read.balanceOf([owner.account.address])

            let clientSum = 0n;
            for (let i = 1; i <= depositorsCount; i++) {
                const clientBalance = await token.read.balanceOf([clients[i].account.address])
                clientSum += clientBalance
                console.log(`Client ${i} balance: ${stringify(clientBalance)}, initial deposit: ${stringify(deposits[i])}`)
                expect(clientBalance).to.equal((deposits[i] * totalSupply) / reserveBalance)
            }

            const distributionEvents = await token.getEvents.Distributed({fromBlock: 'earliest'});
            console.log(`Total supply: ${stringify(totalSupply)}`)
            console.log(`Reserve balance: ${stringify(reserveBalance)}`)
            console.log(`Owner balance: ${stringify(ownerBalance)}`)
            console.log(`Client sum: ${stringify(clientSum)}`)
            expect(clientSum + ownerBalance).to.equal(totalSupply)
            if (ownerBalance > 0) {
                expect(distributionEvents.length).to.equal(depositorsCount + 1)
            } else {
                expect(distributionEvents.length).to.equal(depositorsCount)
            }
        });
    });

    describe('Mint', () => {
        it('should be the correct number of client\'s erc20 tokens balance after minting', async () => {
            const {token, owner, first, erc20Token, activateToken} = await deployTokenFixture();
            const depositAmount = 100n * BigInt(1e18);

            await token.write.deposit([depositAmount], {account: owner.account.address});
            await activateToken();
            await token.write.distribute({account: owner.account.address})

            const balanceBefore = await erc20Token.read.balanceOf([first.account.address])

            const priceInERC20 = 2n * BigInt(1e18);
            await token.write.mint([priceInERC20], {
                account: first.account.address
            });

            const balanceAfter = await erc20Token.read.balanceOf([first.account.address])
            expect(balanceAfter).to.equal(balanceBefore - priceInERC20)
        });

        it('should be the correct number of contract\'s erc20 tokens balance after minting', async () => {
            const {token, owner, first, erc20Token, activateToken} = await deployTokenFixture();
            const depositAmount = 100n * BigInt(1e18);

            await token.write.deposit([depositAmount], {account: owner.account.address});
            await activateToken();
            await token.write.distribute({account: owner.account.address})

            const balanceBefore = await erc20Token.read.balanceOf([token.address])

            const priceInERC20 = 2n * BigInt(1e18);
            await token.write.mint([priceInERC20], {
                account: first.account.address
            });

            const balanceAfter = await erc20Token.read.balanceOf([token.address])
            expect(balanceAfter).to.equal(balanceBefore + priceInERC20)
        });


        it('should be the correct number of tokens after mint', async () => {
            const {token, owner, first, activateToken} = await deployTokenFixture();
            const depositAmount = 100n * BigInt(1e18);

            await token.write.deposit([depositAmount], {account: owner.account.address});
            await activateToken();
            await token.write.distribute({account: owner.account.address})

            const priceInERC20 = 2n * BigInt(1e18);
            const mintedTokens = await token.read.getContinuousMintReward([priceInERC20])
            await token.write.mint([priceInERC20], {
                account: first.account.address
            });

            const tokenSupply = await token.read.totalSupply()
            expect(tokenSupply).to.equal(mintedTokens + initialTokenSupply);
        });

        it('should be the correct number of reserve balance after mint', async () => {
            const {token, owner, first, activateToken} = await deployTokenFixture();
            const depositAmount = 100n * BigInt(1e18);

            await token.write.deposit([depositAmount], {account: owner.account.address});
            await activateToken();
            await token.write.distribute({account: owner.account.address})

            const priceInERC20 = 2n * BigInt(1e18);
            await token.write.mint([priceInERC20], {
                account: first.account.address
            });

            const reserveBalance = await token.read.getReserveBalance()
            expect(reserveBalance).to.equal(priceInERC20 + depositAmount);
        });

        it('should be the correct number of token balance after mint', async () => {
            const {token, owner, first, activateToken} = await deployTokenFixture();
            const depositAmount = 100n * BigInt(1e18);

            await token.write.deposit([depositAmount], {account: owner.account.address});
            await activateToken();
            await token.write.distribute({account: owner.account.address})

            const priceInERC20 = 2n * BigInt(1e18);
            const mintedTokens = await token.read.getContinuousMintReward([priceInERC20])
            await token.write.mint([priceInERC20], {
                account: first.account.address
            });

            const clientBalance = await token.read.balanceOf([first.account.address])
            expect(clientBalance).to.equal(mintedTokens);
        });

        it('should be the correct number of token balance after mint for many clients', async () => {
            const {token, owner, activateToken} = await deployTokenFixture();
            const clients = await hre.viem.getWalletClients();

            const depositAmount = 100n * BigInt(1e18);
            await token.write.deposit([depositAmount], {account: owner.account.address});
            await activateToken();
            await token.write.distribute({account: owner.account.address})

            const clientsCount = 15;
            const priceInERC20 = 2n * BigInt(1e18);
            for (let i = 1; i <= clientsCount; i++) {
                const mintedTokens = await token.read.getContinuousMintReward([priceInERC20])
                await token.write.mint([priceInERC20], {
                    account: clients[i].account.address
                });
                const clientBalance = await token.read.balanceOf([clients[i].account.address])
                expect(clientBalance).to.equal(mintedTokens);
            }

            const mintEvents = await token.getEvents.Minted({fromBlock: 'earliest'});
            expect(mintEvents.length).to.equal(clientsCount);
        });

        it('should increase cost of token after every minting', async () => {
            const {token, owner, activateToken} = await deployTokenFixture();

            const depositAmount = 100n * BigInt(1e18);
            await token.write.deposit([depositAmount], {account: owner.account.address});
            await activateToken();
            await token.write.distribute({account: owner.account.address})

            const iterations = 15;
            const priceInERC20 = 1n * BigInt(1e18);
            let previousPrice;
            for (let i = 1; i <= iterations; i++) {
                const reserveBalanceBeforeMint = await token.read.getReserveBalance();
                const reserveBalanceDiff = reserveBalanceBeforeMint - priceInERC20;

                const totalSupplyBeforeMint = await token.read.totalSupply();
                await token.write.mint([priceInERC20], {
                    account: owner.account.address
                });
                const totalSupplyAfterMint = await token.read.totalSupply();
                const totalSupplyDiff = totalSupplyAfterMint - totalSupplyBeforeMint;

                const price = Number(reserveBalanceDiff) / Number(totalSupplyDiff);
                if (previousPrice) {
                    expect(price).to.be.greaterThan(previousPrice);
                }
                previousPrice = price;
            }
        })
    });

    describe('Burn', () => {
        it('should be the correct number of client\'s erc20 tokens balance after burning', async () => {
            const {token, owner, erc20Token, activateToken} = await deployTokenFixture();
            const depositAmount = 100n * BigInt(1e18);

            await token.write.deposit([depositAmount], {account: owner.account.address});
            await activateToken();
            await token.write.distribute({account: owner.account.address})

            const ERC20BalanceBefore = await erc20Token.read.balanceOf([owner.account.address]);

            const priceInTokens = 10n * BigInt(1e18);
            const expectedERC20Refund = await token.read.getContinuousBurnRefund([priceInTokens]);
            await token.write.burn([priceInTokens], {account: owner.account.address});

            const ERC20BalanceAfter = await erc20Token.read.balanceOf([owner.account.address]);

            expect(ERC20BalanceAfter - ERC20BalanceBefore).to.equal(expectedERC20Refund)
        })

        it('should be the correct number of contracts\'s erc20 tokens balance after burning', async () => {
            const {token, owner, erc20Token, activateToken} = await deployTokenFixture();
            const depositAmount = 100n * BigInt(1e18);

            const ERC20BalanceInit = await erc20Token.read.balanceOf([token.address]);
            const reserveInit = await token.read.getReserveBalance()
            expect(ERC20BalanceInit).to.equal(0n);
            expect(reserveInit).to.equal(ERC20BalanceInit);

            await token.write.deposit([depositAmount], {account: owner.account.address});
            await activateToken();
            await token.write.distribute({account: owner.account.address})

            const reserveBefore = await token.read.getReserveBalance()
            const ERC20BalanceBefore = await erc20Token.read.balanceOf([token.address]);
            expect(reserveBefore).to.equal(depositAmount);
            expect(reserveBefore).to.equal(ERC20BalanceBefore);

            const priceInTokens = 10n * BigInt(1e18);
            const expectedERC20Refund = await token.read.getContinuousBurnRefund([priceInTokens]);
            await token.write.burn([priceInTokens], {account: owner.account.address});

            const reserveAfter = await token.read.getReserveBalance()
            const ERC20BalanceAfter = await erc20Token.read.balanceOf([token.address]);

            expect(reserveAfter).to.equal(ERC20BalanceAfter);
            expect(ERC20BalanceBefore - ERC20BalanceAfter).to.equal(expectedERC20Refund)
        })


        it('should be the correct number of tokens after burning', async () => {
            const {token, owner, activateToken} = await deployTokenFixture();
            const depositAmount = 100n * BigInt(1e18);

            await token.write.deposit([depositAmount], {account: owner.account.address});
            await activateToken();
            await token.write.distribute({account: owner.account.address})

            const priceInTokens = 10n * BigInt(1e18);
            await token.write.burn([priceInTokens], {account: owner.account.address});

            const tokenSupply = await token.read.totalSupply()
            expect(tokenSupply).to.equal(initialTokenSupply - priceInTokens);
        })

        it('should be the correct number of reserve balance after burning', async () => {
            const {token, owner, activateToken} = await deployTokenFixture();
            const depositAmount = 100n * BigInt(1e18);

            await token.write.deposit([depositAmount], {account: owner.account.address});
            await activateToken();
            await token.write.distribute({account: owner.account.address})

            const priceInTokens = 10n * BigInt(1e18);
            const burnReward = await token.read.getContinuousBurnRefund([priceInTokens]);
            await token.write.burn([priceInTokens], {account: owner.account.address});

            const reserveBalance = await token.read.getReserveBalance()
            expect(reserveBalance).to.equal(depositAmount - burnReward);
        })

        it('should be the correct number of token balance after burning', async () => {
            const {token, owner, activateToken} = await deployTokenFixture();
            const depositAmount = 100n * BigInt(1e18);

            await token.write.deposit([depositAmount], {account: owner.account.address});
            await activateToken();
            await token.write.distribute({account: owner.account.address})

            const priceInTokens = 10n * BigInt(1e18);
            await token.write.burn([priceInTokens], {account: owner.account.address});

            const clientBalance = await token.read.balanceOf([owner.account.address])
            expect(clientBalance).to.equal(initialTokenSupply - priceInTokens);
        });

        it('should be the correct number of token balance after burning for many clients', async () => {
            const {token, owner, activateToken} = await deployTokenFixture();
            const clients = await hre.viem.getWalletClients();
            const clientsCount = 10;
            const depositAmount = 100n * BigInt(1e18);

            for (let i = 0; i < clientsCount; i++) {
                await token.write.deposit([depositAmount], {account: clients[i].account.address});
            }

            await activateToken();
            await token.write.distribute({account: owner.account.address})

            const priceInTokens = 10n * BigInt(1e18);
            for (let i = 0; i < clientsCount; i++) {
                const clientBalanceBefore = await token.read.balanceOf([clients[i].account.address])
                await token.write.burn([priceInTokens], {account: clients[i].account.address});
                const clientBalanceAfter = await token.read.balanceOf([clients[i].account.address])
                expect(clientBalanceBefore - clientBalanceAfter).to.equal(priceInTokens);
            }
            const burnEvents = await token.getEvents.Burned({fromBlock: 'earliest'});
            expect(burnEvents.length).to.equal(clientsCount);
        });

        it('should be the correct number of reserve balance after burning for many clients', async () => {
            const {token, owner, activateToken} = await deployTokenFixture();
            const clients = await hre.viem.getWalletClients();
            const clientsCount = 10;
            const depositAmount = 100n * BigInt(1e18);

            for (let i = 0; i < clientsCount; i++) {
                await token.write.deposit([depositAmount], {account: clients[i].account.address});
            }

            await activateToken();
            await token.write.distribute({account: owner.account.address})

            const priceInTokens = 10n * BigInt(1e18);
            for (let i = 0; i < clientsCount; i++) {
                const reserveBalanceBefore = await token.read.getReserveBalance();
                const burnReward = await token.read.getContinuousBurnRefund([priceInTokens]);
                await token.write.burn([priceInTokens], {account: clients[i].account.address});
                const reserveBalanceAfter = await token.read.getReserveBalance();
                expect(reserveBalanceBefore - reserveBalanceAfter).to.equal(burnReward);
            }
            const burnEvents = await token.getEvents.Burned({fromBlock: 'earliest'});
            expect(burnEvents.length).to.equal(clientsCount);
        });

        it('should reduce cost of token after every burning', async () => {
            const {token, owner, activateToken} = await deployTokenFixture();

            const depositAmount = 100n * BigInt(1e18);
            await token.write.deposit([depositAmount], {account: owner.account.address});
            await activateToken();
            await token.write.distribute({account: owner.account.address})

            const iterations = 15;
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
            const burnEvents = await token.getEvents.Burned({fromBlock: 'earliest'});
            expect(burnEvents.length).to.equal(iterations);
        });
    });


    describe('Errors', () => {
        it('should not allow to deposit zero amount', async () => {
            const {token, first} = await deployTokenFixture();
            const depositAmount = 0n;

            expect(token.write.deposit([depositAmount], {
                account: first.account.address
            })).to.be.rejectedWith('Deposit must be greater than 0')
        });

        it('should be forbidden to mint tokens before active period', async () => {
            const {token, first} = await deployTokenFixture();
            const priceInERC20 = 1n * BigInt(1e18);

            expect(token.write.mint([priceInERC20], {
                account: first.account.address
            })).to.be.rejectedWith('The active period has not started yet')
        });

        it('should be forbidden to burn tokens before active period', async () => {
            const {token, first} = await deployTokenFixture();
            const price = 1n * BigInt(1e18);

            expect(token.write.burn([price], {
                account: first.account.address
            })).to.be.rejectedWith('The active period has not started yet')
        });

        it('should be forbidden to distribute deposits before the end of the accumulation period', async () => {
            const {token, first, owner} = await deployTokenFixture();
            const depositAmount = 1n * BigInt(1e18);
            await token.write.deposit([depositAmount], {account: first.account.address});

            expect(token.write.distribute({
                account: owner.account.address
            })).to.be.rejectedWith('Accumulation duration has not ended yet')
        });

        it('should be forbidden to distribute deposits to a non-owner', async () => {
            const {token, first} = await deployTokenFixture();
            const depositAmount = 1n * BigInt(1e18);
            await token.write.deposit([depositAmount], {account: first.account.address});

            expect(token.write.distribute({
                account: first.account.address
            })).to.be.rejectedWith()
        });


        it('should be forbidden to distribute deposits while accumulation time is not over yet ', async () => {
            const {token, owner, first} = await deployTokenFixture();
            const depositAmount = 1n * BigInt(1e18);
            await token.write.deposit([depositAmount], {account: first.account.address});
            expect(token.write.distribute({
                account: owner.account.address
            })).to.be.rejectedWith('Accumulation duration has not ended yet')
        })

        it('should be forbidden to distribute deposits with 0 reserve balance', async () => {
            const {token, owner, activateToken} = await deployTokenFixture();

            await activateToken();
            expect(token.write.distribute({
                account: owner.account.address
            })).to.be.rejectedWith('Reserve must be greater than 0')
        })

        it('should be forbidden to deposit during the active period', async () => {
            const {token, owner, first, activateToken} = await deployTokenFixture();
            const depositAmount = 1n * BigInt(1e18);

            await token.write.deposit([depositAmount], {account: first.account.address});
            await activateToken();
            await token.write.distribute({account: owner.account.address})

            expect(token.write.deposit([depositAmount], {
                account: first.account.address
            })).to.be.rejectedWith('Accumulation period has ended')
        });

        it('should be forbidden to distribute deposits during the active period', async () => {
            const {token, owner, first, activateToken} = await deployTokenFixture();
            const depositAmount = 1n * BigInt(1e18);

            await token.write.deposit([depositAmount], {account: first.account.address});
            await activateToken();
            await token.write.distribute({account: owner.account.address})

            expect(token.write.distribute({
                account: owner.account.address
            })).to.be.rejectedWith('Accumulation period has ended')
        });
    })
});
