import {
  useContractRead,
  UseContractReadConfig,
  useContractWrite,
  Address,
  UseContractWriteConfig,
  usePrepareContractWrite,
  UsePrepareContractWriteConfig,
  useContractEvent,
  UseContractEventConfig,
} from 'wagmi'
import {
  ReadContractResult,
  WriteContractMode,
  PrepareWriteContractResult,
} from 'wagmi/actions'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Token
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export const tokenABI = [
  {
    stateMutability: 'nonpayable',
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
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'accumulationDateEnd',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'accumulationDuration',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'burn',
    outputs: [],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'deposit',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'deposits',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'distribute',
    outputs: [],
  },
  {
    stateMutability: 'view',
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
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: '_reserveTokenAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getContinuousMintReward',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getContinuousSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getReserveBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'initialSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'isActive',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'mint',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'reserve',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'reserveRatio',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'reserveTokenAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
  },
] as const

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export const tokenAddress = {
  11155111: '0x7951050A6c67686ECE0f55B88B820f695552e7E9',
} as const

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export const tokenConfig = { address: tokenAddress, abi: tokenABI } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenABI}__.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function useTokenRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof tokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>,
    'abi' | 'address'
  > & { chainId?: keyof typeof tokenAddress } = {} as any,
) {
  return useContractRead({
    abi: tokenABI,
    address: tokenAddress[11155111],
    ...config,
  } as UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenABI}__ and `functionName` set to `"accumulationDateEnd"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function useTokenAccumulationDateEnd<
  TFunctionName extends 'accumulationDateEnd',
  TSelectData = ReadContractResult<typeof tokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tokenAddress } = {} as any,
) {
  return useContractRead({
    abi: tokenABI,
    address: tokenAddress[11155111],
    functionName: 'accumulationDateEnd',
    ...config,
  } as UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenABI}__ and `functionName` set to `"accumulationDuration"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function useTokenAccumulationDuration<
  TFunctionName extends 'accumulationDuration',
  TSelectData = ReadContractResult<typeof tokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tokenAddress } = {} as any,
) {
  return useContractRead({
    abi: tokenABI,
    address: tokenAddress[11155111],
    functionName: 'accumulationDuration',
    ...config,
  } as UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenABI}__ and `functionName` set to `"allowance"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function useTokenAllowance<
  TFunctionName extends 'allowance',
  TSelectData = ReadContractResult<typeof tokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tokenAddress } = {} as any,
) {
  return useContractRead({
    abi: tokenABI,
    address: tokenAddress[11155111],
    functionName: 'allowance',
    ...config,
  } as UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenABI}__ and `functionName` set to `"balanceOf"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function useTokenBalanceOf<
  TFunctionName extends 'balanceOf',
  TSelectData = ReadContractResult<typeof tokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tokenAddress } = {} as any,
) {
  return useContractRead({
    abi: tokenABI,
    address: tokenAddress[11155111],
    functionName: 'balanceOf',
    ...config,
  } as UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenABI}__ and `functionName` set to `"decimals"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function useTokenDecimals<
  TFunctionName extends 'decimals',
  TSelectData = ReadContractResult<typeof tokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tokenAddress } = {} as any,
) {
  return useContractRead({
    abi: tokenABI,
    address: tokenAddress[11155111],
    functionName: 'decimals',
    ...config,
  } as UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenABI}__ and `functionName` set to `"deposits"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function useTokenDeposits<
  TFunctionName extends 'deposits',
  TSelectData = ReadContractResult<typeof tokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tokenAddress } = {} as any,
) {
  return useContractRead({
    abi: tokenABI,
    address: tokenAddress[11155111],
    functionName: 'deposits',
    ...config,
  } as UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenABI}__ and `functionName` set to `"getContinuousBurnRefund"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function useTokenGetContinuousBurnRefund<
  TFunctionName extends 'getContinuousBurnRefund',
  TSelectData = ReadContractResult<typeof tokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tokenAddress } = {} as any,
) {
  return useContractRead({
    abi: tokenABI,
    address: tokenAddress[11155111],
    functionName: 'getContinuousBurnRefund',
    ...config,
  } as UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenABI}__ and `functionName` set to `"getContinuousMintReward"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function useTokenGetContinuousMintReward<
  TFunctionName extends 'getContinuousMintReward',
  TSelectData = ReadContractResult<typeof tokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tokenAddress } = {} as any,
) {
  return useContractRead({
    abi: tokenABI,
    address: tokenAddress[11155111],
    functionName: 'getContinuousMintReward',
    ...config,
  } as UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenABI}__ and `functionName` set to `"getContinuousSupply"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function useTokenGetContinuousSupply<
  TFunctionName extends 'getContinuousSupply',
  TSelectData = ReadContractResult<typeof tokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tokenAddress } = {} as any,
) {
  return useContractRead({
    abi: tokenABI,
    address: tokenAddress[11155111],
    functionName: 'getContinuousSupply',
    ...config,
  } as UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenABI}__ and `functionName` set to `"getReserveBalance"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function useTokenGetReserveBalance<
  TFunctionName extends 'getReserveBalance',
  TSelectData = ReadContractResult<typeof tokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tokenAddress } = {} as any,
) {
  return useContractRead({
    abi: tokenABI,
    address: tokenAddress[11155111],
    functionName: 'getReserveBalance',
    ...config,
  } as UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenABI}__ and `functionName` set to `"initialSupply"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function useTokenInitialSupply<
  TFunctionName extends 'initialSupply',
  TSelectData = ReadContractResult<typeof tokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tokenAddress } = {} as any,
) {
  return useContractRead({
    abi: tokenABI,
    address: tokenAddress[11155111],
    functionName: 'initialSupply',
    ...config,
  } as UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenABI}__ and `functionName` set to `"isActive"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function useTokenIsActive<
  TFunctionName extends 'isActive',
  TSelectData = ReadContractResult<typeof tokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tokenAddress } = {} as any,
) {
  return useContractRead({
    abi: tokenABI,
    address: tokenAddress[11155111],
    functionName: 'isActive',
    ...config,
  } as UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenABI}__ and `functionName` set to `"name"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function useTokenName<
  TFunctionName extends 'name',
  TSelectData = ReadContractResult<typeof tokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tokenAddress } = {} as any,
) {
  return useContractRead({
    abi: tokenABI,
    address: tokenAddress[11155111],
    functionName: 'name',
    ...config,
  } as UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenABI}__ and `functionName` set to `"owner"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function useTokenOwner<
  TFunctionName extends 'owner',
  TSelectData = ReadContractResult<typeof tokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tokenAddress } = {} as any,
) {
  return useContractRead({
    abi: tokenABI,
    address: tokenAddress[11155111],
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenABI}__ and `functionName` set to `"reserve"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function useTokenReserve<
  TFunctionName extends 'reserve',
  TSelectData = ReadContractResult<typeof tokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tokenAddress } = {} as any,
) {
  return useContractRead({
    abi: tokenABI,
    address: tokenAddress[11155111],
    functionName: 'reserve',
    ...config,
  } as UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenABI}__ and `functionName` set to `"reserveRatio"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function useTokenReserveRatio<
  TFunctionName extends 'reserveRatio',
  TSelectData = ReadContractResult<typeof tokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tokenAddress } = {} as any,
) {
  return useContractRead({
    abi: tokenABI,
    address: tokenAddress[11155111],
    functionName: 'reserveRatio',
    ...config,
  } as UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenABI}__ and `functionName` set to `"reserveTokenAddress"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function useTokenReserveTokenAddress<
  TFunctionName extends 'reserveTokenAddress',
  TSelectData = ReadContractResult<typeof tokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tokenAddress } = {} as any,
) {
  return useContractRead({
    abi: tokenABI,
    address: tokenAddress[11155111],
    functionName: 'reserveTokenAddress',
    ...config,
  } as UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenABI}__ and `functionName` set to `"symbol"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function useTokenSymbol<
  TFunctionName extends 'symbol',
  TSelectData = ReadContractResult<typeof tokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tokenAddress } = {} as any,
) {
  return useContractRead({
    abi: tokenABI,
    address: tokenAddress[11155111],
    functionName: 'symbol',
    ...config,
  } as UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link tokenABI}__ and `functionName` set to `"totalSupply"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function useTokenTotalSupply<
  TFunctionName extends 'totalSupply',
  TSelectData = ReadContractResult<typeof tokenABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tokenAddress } = {} as any,
) {
  return useContractRead({
    abi: tokenABI,
    address: tokenAddress[11155111],
    functionName: 'totalSupply',
    ...config,
  } as UseContractReadConfig<typeof tokenABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenABI}__.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function useTokenWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof tokenAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof tokenABI, string>['request']['abi'],
        TFunctionName,
        TMode
      > & { address?: Address; chainId?: TChainId }
    : UseContractWriteConfig<typeof tokenABI, TFunctionName, TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
      } = {} as any,
) {
  return useContractWrite<typeof tokenABI, TFunctionName, TMode>({
    abi: tokenABI,
    address: tokenAddress[11155111],
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenABI}__ and `functionName` set to `"approve"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function useTokenApprove<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof tokenAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenABI,
          'approve'
        >['request']['abi'],
        'approve',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'approve' }
    : UseContractWriteConfig<typeof tokenABI, 'approve', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'approve'
      } = {} as any,
) {
  return useContractWrite<typeof tokenABI, 'approve', TMode>({
    abi: tokenABI,
    address: tokenAddress[11155111],
    functionName: 'approve',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenABI}__ and `functionName` set to `"burn"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function useTokenBurn<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof tokenAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof tokenABI, 'burn'>['request']['abi'],
        'burn',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'burn' }
    : UseContractWriteConfig<typeof tokenABI, 'burn', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'burn'
      } = {} as any,
) {
  return useContractWrite<typeof tokenABI, 'burn', TMode>({
    abi: tokenABI,
    address: tokenAddress[11155111],
    functionName: 'burn',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenABI}__ and `functionName` set to `"deposit"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function useTokenDeposit<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof tokenAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenABI,
          'deposit'
        >['request']['abi'],
        'deposit',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'deposit' }
    : UseContractWriteConfig<typeof tokenABI, 'deposit', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'deposit'
      } = {} as any,
) {
  return useContractWrite<typeof tokenABI, 'deposit', TMode>({
    abi: tokenABI,
    address: tokenAddress[11155111],
    functionName: 'deposit',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenABI}__ and `functionName` set to `"distribute"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function useTokenDistribute<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof tokenAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenABI,
          'distribute'
        >['request']['abi'],
        'distribute',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'distribute' }
    : UseContractWriteConfig<typeof tokenABI, 'distribute', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'distribute'
      } = {} as any,
) {
  return useContractWrite<typeof tokenABI, 'distribute', TMode>({
    abi: tokenABI,
    address: tokenAddress[11155111],
    functionName: 'distribute',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenABI}__ and `functionName` set to `"mint"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function useTokenMint<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof tokenAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof tokenABI, 'mint'>['request']['abi'],
        'mint',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'mint' }
    : UseContractWriteConfig<typeof tokenABI, 'mint', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'mint'
      } = {} as any,
) {
  return useContractWrite<typeof tokenABI, 'mint', TMode>({
    abi: tokenABI,
    address: tokenAddress[11155111],
    functionName: 'mint',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenABI}__ and `functionName` set to `"renounceOwnership"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function useTokenRenounceOwnership<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof tokenAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenABI,
          'renounceOwnership'
        >['request']['abi'],
        'renounceOwnership',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'renounceOwnership'
      }
    : UseContractWriteConfig<typeof tokenABI, 'renounceOwnership', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'renounceOwnership'
      } = {} as any,
) {
  return useContractWrite<typeof tokenABI, 'renounceOwnership', TMode>({
    abi: tokenABI,
    address: tokenAddress[11155111],
    functionName: 'renounceOwnership',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenABI}__ and `functionName` set to `"transfer"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function useTokenTransfer<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof tokenAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenABI,
          'transfer'
        >['request']['abi'],
        'transfer',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'transfer' }
    : UseContractWriteConfig<typeof tokenABI, 'transfer', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'transfer'
      } = {} as any,
) {
  return useContractWrite<typeof tokenABI, 'transfer', TMode>({
    abi: tokenABI,
    address: tokenAddress[11155111],
    functionName: 'transfer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenABI}__ and `functionName` set to `"transferFrom"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function useTokenTransferFrom<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof tokenAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenABI,
          'transferFrom'
        >['request']['abi'],
        'transferFrom',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'transferFrom'
      }
    : UseContractWriteConfig<typeof tokenABI, 'transferFrom', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'transferFrom'
      } = {} as any,
) {
  return useContractWrite<typeof tokenABI, 'transferFrom', TMode>({
    abi: tokenABI,
    address: tokenAddress[11155111],
    functionName: 'transferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link tokenABI}__ and `functionName` set to `"transferOwnership"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function useTokenTransferOwnership<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof tokenAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof tokenABI,
          'transferOwnership'
        >['request']['abi'],
        'transferOwnership',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'transferOwnership'
      }
    : UseContractWriteConfig<typeof tokenABI, 'transferOwnership', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'transferOwnership'
      } = {} as any,
) {
  return useContractWrite<typeof tokenABI, 'transferOwnership', TMode>({
    abi: tokenABI,
    address: tokenAddress[11155111],
    functionName: 'transferOwnership',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenABI}__.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function usePrepareTokenWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tokenABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof tokenAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: tokenABI,
    address: tokenAddress[11155111],
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenABI}__ and `functionName` set to `"approve"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function usePrepareTokenApprove(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tokenABI, 'approve'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tokenAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: tokenABI,
    address: tokenAddress[11155111],
    functionName: 'approve',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenABI, 'approve'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenABI}__ and `functionName` set to `"burn"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function usePrepareTokenBurn(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tokenABI, 'burn'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tokenAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: tokenABI,
    address: tokenAddress[11155111],
    functionName: 'burn',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenABI, 'burn'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenABI}__ and `functionName` set to `"deposit"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function usePrepareTokenDeposit(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tokenABI, 'deposit'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tokenAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: tokenABI,
    address: tokenAddress[11155111],
    functionName: 'deposit',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenABI, 'deposit'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenABI}__ and `functionName` set to `"distribute"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function usePrepareTokenDistribute(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tokenABI, 'distribute'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tokenAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: tokenABI,
    address: tokenAddress[11155111],
    functionName: 'distribute',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenABI, 'distribute'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenABI}__ and `functionName` set to `"mint"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function usePrepareTokenMint(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tokenABI, 'mint'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tokenAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: tokenABI,
    address: tokenAddress[11155111],
    functionName: 'mint',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenABI, 'mint'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenABI}__ and `functionName` set to `"renounceOwnership"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function usePrepareTokenRenounceOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tokenABI, 'renounceOwnership'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tokenAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: tokenABI,
    address: tokenAddress[11155111],
    functionName: 'renounceOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenABI, 'renounceOwnership'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenABI}__ and `functionName` set to `"transfer"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function usePrepareTokenTransfer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tokenABI, 'transfer'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tokenAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: tokenABI,
    address: tokenAddress[11155111],
    functionName: 'transfer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenABI, 'transfer'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenABI}__ and `functionName` set to `"transferFrom"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function usePrepareTokenTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tokenABI, 'transferFrom'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tokenAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: tokenABI,
    address: tokenAddress[11155111],
    functionName: 'transferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenABI, 'transferFrom'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link tokenABI}__ and `functionName` set to `"transferOwnership"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function usePrepareTokenTransferOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof tokenABI, 'transferOwnership'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof tokenAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: tokenABI,
    address: tokenAddress[11155111],
    functionName: 'transferOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<typeof tokenABI, 'transferOwnership'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenABI}__.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function useTokenEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof tokenABI, TEventName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof tokenAddress } = {} as any,
) {
  return useContractEvent({
    abi: tokenABI,
    address: tokenAddress[11155111],
    ...config,
  } as UseContractEventConfig<typeof tokenABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenABI}__ and `eventName` set to `"Approval"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function useTokenApprovalEvent(
  config: Omit<
    UseContractEventConfig<typeof tokenABI, 'Approval'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof tokenAddress } = {} as any,
) {
  return useContractEvent({
    abi: tokenABI,
    address: tokenAddress[11155111],
    eventName: 'Approval',
    ...config,
  } as UseContractEventConfig<typeof tokenABI, 'Approval'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenABI}__ and `eventName` set to `"Burned"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function useTokenBurnedEvent(
  config: Omit<
    UseContractEventConfig<typeof tokenABI, 'Burned'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof tokenAddress } = {} as any,
) {
  return useContractEvent({
    abi: tokenABI,
    address: tokenAddress[11155111],
    eventName: 'Burned',
    ...config,
  } as UseContractEventConfig<typeof tokenABI, 'Burned'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenABI}__ and `eventName` set to `"Deposited"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function useTokenDepositedEvent(
  config: Omit<
    UseContractEventConfig<typeof tokenABI, 'Deposited'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof tokenAddress } = {} as any,
) {
  return useContractEvent({
    abi: tokenABI,
    address: tokenAddress[11155111],
    eventName: 'Deposited',
    ...config,
  } as UseContractEventConfig<typeof tokenABI, 'Deposited'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenABI}__ and `eventName` set to `"Distributed"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function useTokenDistributedEvent(
  config: Omit<
    UseContractEventConfig<typeof tokenABI, 'Distributed'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof tokenAddress } = {} as any,
) {
  return useContractEvent({
    abi: tokenABI,
    address: tokenAddress[11155111],
    eventName: 'Distributed',
    ...config,
  } as UseContractEventConfig<typeof tokenABI, 'Distributed'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenABI}__ and `eventName` set to `"Minted"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function useTokenMintedEvent(
  config: Omit<
    UseContractEventConfig<typeof tokenABI, 'Minted'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof tokenAddress } = {} as any,
) {
  return useContractEvent({
    abi: tokenABI,
    address: tokenAddress[11155111],
    eventName: 'Minted',
    ...config,
  } as UseContractEventConfig<typeof tokenABI, 'Minted'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenABI}__ and `eventName` set to `"OwnershipTransferred"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function useTokenOwnershipTransferredEvent(
  config: Omit<
    UseContractEventConfig<typeof tokenABI, 'OwnershipTransferred'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof tokenAddress } = {} as any,
) {
  return useContractEvent({
    abi: tokenABI,
    address: tokenAddress[11155111],
    eventName: 'OwnershipTransferred',
    ...config,
  } as UseContractEventConfig<typeof tokenABI, 'OwnershipTransferred'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link tokenABI}__ and `eventName` set to `"Transfer"`.
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x7951050A6c67686ECE0f55B88B820f695552e7E9)
 */
export function useTokenTransferEvent(
  config: Omit<
    UseContractEventConfig<typeof tokenABI, 'Transfer'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof tokenAddress } = {} as any,
) {
  return useContractEvent({
    abi: tokenABI,
    address: tokenAddress[11155111],
    eventName: 'Transfer',
    ...config,
  } as UseContractEventConfig<typeof tokenABI, 'Transfer'>)
}
