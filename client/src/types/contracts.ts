import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ABCToken
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const abcTokenAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_symbol', internalType: 'string', type: 'string' },
      { name: '_initialSupply', internalType: 'uint256', type: 'uint256' },
      { name: '_reserveRatio', internalType: 'uint32', type: 'uint32' },
      { name: '_initialOwner', internalType: 'address', type: 'address' },
      {
        name: '_accumulationDuration',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: '_reserveTokenAddress',
        internalType: 'address',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'refund',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Burned',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Deposited',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'to', internalType: 'address', type: 'address', indexed: false },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Distributed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'deposit',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Minted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [],
    name: 'accumulationDateEnd',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'accumulationDuration',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'deposits',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'distribute',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_continuousTokenAmount',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'getContinuousBurnRefund',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_reserveTokenAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getContinuousMintReward',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getContinuousSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getReserveBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'initialSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'isActive',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'reserve',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'reserveRatio',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'reserveTokenAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

export const abcTokenAddress =
  '0x7951050A6c67686ECE0f55B88B820f695552e7E9' as const

export const abcTokenConfig = {
  address: abcTokenAddress,
  abi: abcTokenAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link abcTokenAbi}__
 */
export const useReadAbcToken = /*#__PURE__*/ createUseReadContract({
  abi: abcTokenAbi,
  address: abcTokenAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link abcTokenAbi}__ and `functionName` set to `"accumulationDateEnd"`
 */
export const useReadAbcTokenAccumulationDateEnd =
  /*#__PURE__*/ createUseReadContract({
    abi: abcTokenAbi,
    address: abcTokenAddress,
    functionName: 'accumulationDateEnd',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link abcTokenAbi}__ and `functionName` set to `"accumulationDuration"`
 */
export const useReadAbcTokenAccumulationDuration =
  /*#__PURE__*/ createUseReadContract({
    abi: abcTokenAbi,
    address: abcTokenAddress,
    functionName: 'accumulationDuration',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link abcTokenAbi}__ and `functionName` set to `"allowance"`
 */
export const useReadAbcTokenAllowance = /*#__PURE__*/ createUseReadContract({
  abi: abcTokenAbi,
  address: abcTokenAddress,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link abcTokenAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadAbcTokenBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: abcTokenAbi,
  address: abcTokenAddress,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link abcTokenAbi}__ and `functionName` set to `"decimals"`
 */
export const useReadAbcTokenDecimals = /*#__PURE__*/ createUseReadContract({
  abi: abcTokenAbi,
  address: abcTokenAddress,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link abcTokenAbi}__ and `functionName` set to `"deposits"`
 */
export const useReadAbcTokenDeposits = /*#__PURE__*/ createUseReadContract({
  abi: abcTokenAbi,
  address: abcTokenAddress,
  functionName: 'deposits',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link abcTokenAbi}__ and `functionName` set to `"getContinuousBurnRefund"`
 */
export const useReadAbcTokenGetContinuousBurnRefund =
  /*#__PURE__*/ createUseReadContract({
    abi: abcTokenAbi,
    address: abcTokenAddress,
    functionName: 'getContinuousBurnRefund',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link abcTokenAbi}__ and `functionName` set to `"getContinuousMintReward"`
 */
export const useReadAbcTokenGetContinuousMintReward =
  /*#__PURE__*/ createUseReadContract({
    abi: abcTokenAbi,
    address: abcTokenAddress,
    functionName: 'getContinuousMintReward',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link abcTokenAbi}__ and `functionName` set to `"getContinuousSupply"`
 */
export const useReadAbcTokenGetContinuousSupply =
  /*#__PURE__*/ createUseReadContract({
    abi: abcTokenAbi,
    address: abcTokenAddress,
    functionName: 'getContinuousSupply',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link abcTokenAbi}__ and `functionName` set to `"getReserveBalance"`
 */
export const useReadAbcTokenGetReserveBalance =
  /*#__PURE__*/ createUseReadContract({
    abi: abcTokenAbi,
    address: abcTokenAddress,
    functionName: 'getReserveBalance',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link abcTokenAbi}__ and `functionName` set to `"initialSupply"`
 */
export const useReadAbcTokenInitialSupply = /*#__PURE__*/ createUseReadContract(
  { abi: abcTokenAbi, address: abcTokenAddress, functionName: 'initialSupply' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link abcTokenAbi}__ and `functionName` set to `"isActive"`
 */
export const useReadAbcTokenIsActive = /*#__PURE__*/ createUseReadContract({
  abi: abcTokenAbi,
  address: abcTokenAddress,
  functionName: 'isActive',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link abcTokenAbi}__ and `functionName` set to `"name"`
 */
export const useReadAbcTokenName = /*#__PURE__*/ createUseReadContract({
  abi: abcTokenAbi,
  address: abcTokenAddress,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link abcTokenAbi}__ and `functionName` set to `"owner"`
 */
export const useReadAbcTokenOwner = /*#__PURE__*/ createUseReadContract({
  abi: abcTokenAbi,
  address: abcTokenAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link abcTokenAbi}__ and `functionName` set to `"reserve"`
 */
export const useReadAbcTokenReserve = /*#__PURE__*/ createUseReadContract({
  abi: abcTokenAbi,
  address: abcTokenAddress,
  functionName: 'reserve',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link abcTokenAbi}__ and `functionName` set to `"reserveRatio"`
 */
export const useReadAbcTokenReserveRatio = /*#__PURE__*/ createUseReadContract({
  abi: abcTokenAbi,
  address: abcTokenAddress,
  functionName: 'reserveRatio',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link abcTokenAbi}__ and `functionName` set to `"reserveTokenAddress"`
 */
export const useReadAbcTokenReserveTokenAddress =
  /*#__PURE__*/ createUseReadContract({
    abi: abcTokenAbi,
    address: abcTokenAddress,
    functionName: 'reserveTokenAddress',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link abcTokenAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadAbcTokenSymbol = /*#__PURE__*/ createUseReadContract({
  abi: abcTokenAbi,
  address: abcTokenAddress,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link abcTokenAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadAbcTokenTotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: abcTokenAbi,
  address: abcTokenAddress,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link abcTokenAbi}__
 */
export const useWriteAbcToken = /*#__PURE__*/ createUseWriteContract({
  abi: abcTokenAbi,
  address: abcTokenAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link abcTokenAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteAbcTokenApprove = /*#__PURE__*/ createUseWriteContract({
  abi: abcTokenAbi,
  address: abcTokenAddress,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link abcTokenAbi}__ and `functionName` set to `"burn"`
 */
export const useWriteAbcTokenBurn = /*#__PURE__*/ createUseWriteContract({
  abi: abcTokenAbi,
  address: abcTokenAddress,
  functionName: 'burn',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link abcTokenAbi}__ and `functionName` set to `"deposit"`
 */
export const useWriteAbcTokenDeposit = /*#__PURE__*/ createUseWriteContract({
  abi: abcTokenAbi,
  address: abcTokenAddress,
  functionName: 'deposit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link abcTokenAbi}__ and `functionName` set to `"distribute"`
 */
export const useWriteAbcTokenDistribute = /*#__PURE__*/ createUseWriteContract({
  abi: abcTokenAbi,
  address: abcTokenAddress,
  functionName: 'distribute',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link abcTokenAbi}__ and `functionName` set to `"mint"`
 */
export const useWriteAbcTokenMint = /*#__PURE__*/ createUseWriteContract({
  abi: abcTokenAbi,
  address: abcTokenAddress,
  functionName: 'mint',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link abcTokenAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteAbcTokenRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: abcTokenAbi,
    address: abcTokenAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link abcTokenAbi}__ and `functionName` set to `"transfer"`
 */
export const useWriteAbcTokenTransfer = /*#__PURE__*/ createUseWriteContract({
  abi: abcTokenAbi,
  address: abcTokenAddress,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link abcTokenAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteAbcTokenTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: abcTokenAbi,
    address: abcTokenAddress,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link abcTokenAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteAbcTokenTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: abcTokenAbi,
    address: abcTokenAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link abcTokenAbi}__
 */
export const useSimulateAbcToken = /*#__PURE__*/ createUseSimulateContract({
  abi: abcTokenAbi,
  address: abcTokenAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link abcTokenAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateAbcTokenApprove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: abcTokenAbi,
    address: abcTokenAddress,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link abcTokenAbi}__ and `functionName` set to `"burn"`
 */
export const useSimulateAbcTokenBurn = /*#__PURE__*/ createUseSimulateContract({
  abi: abcTokenAbi,
  address: abcTokenAddress,
  functionName: 'burn',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link abcTokenAbi}__ and `functionName` set to `"deposit"`
 */
export const useSimulateAbcTokenDeposit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: abcTokenAbi,
    address: abcTokenAddress,
    functionName: 'deposit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link abcTokenAbi}__ and `functionName` set to `"distribute"`
 */
export const useSimulateAbcTokenDistribute =
  /*#__PURE__*/ createUseSimulateContract({
    abi: abcTokenAbi,
    address: abcTokenAddress,
    functionName: 'distribute',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link abcTokenAbi}__ and `functionName` set to `"mint"`
 */
export const useSimulateAbcTokenMint = /*#__PURE__*/ createUseSimulateContract({
  abi: abcTokenAbi,
  address: abcTokenAddress,
  functionName: 'mint',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link abcTokenAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateAbcTokenRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: abcTokenAbi,
    address: abcTokenAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link abcTokenAbi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateAbcTokenTransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: abcTokenAbi,
    address: abcTokenAddress,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link abcTokenAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateAbcTokenTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: abcTokenAbi,
    address: abcTokenAddress,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link abcTokenAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateAbcTokenTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: abcTokenAbi,
    address: abcTokenAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link abcTokenAbi}__
 */
export const useWatchAbcTokenEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: abcTokenAbi,
  address: abcTokenAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link abcTokenAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchAbcTokenApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: abcTokenAbi,
    address: abcTokenAddress,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link abcTokenAbi}__ and `eventName` set to `"Burned"`
 */
export const useWatchAbcTokenBurnedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: abcTokenAbi,
    address: abcTokenAddress,
    eventName: 'Burned',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link abcTokenAbi}__ and `eventName` set to `"Deposited"`
 */
export const useWatchAbcTokenDepositedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: abcTokenAbi,
    address: abcTokenAddress,
    eventName: 'Deposited',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link abcTokenAbi}__ and `eventName` set to `"Distributed"`
 */
export const useWatchAbcTokenDistributedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: abcTokenAbi,
    address: abcTokenAddress,
    eventName: 'Distributed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link abcTokenAbi}__ and `eventName` set to `"Minted"`
 */
export const useWatchAbcTokenMintedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: abcTokenAbi,
    address: abcTokenAddress,
    eventName: 'Minted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link abcTokenAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchAbcTokenOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: abcTokenAbi,
    address: abcTokenAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link abcTokenAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchAbcTokenTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: abcTokenAbi,
    address: abcTokenAddress,
    eventName: 'Transfer',
  })
