import {computed} from "@preact/signals-react";
import {getContract} from "viem";
import {tokenABI} from "@/types/abi.ts";
import {abcTokenAddress} from "@/types/contracts.ts";
import {$walletClient, publicClient} from "@/utils/clients.ts";

export const $tokenContract = computed(() => {
    const contract = getContract({
        abi: tokenABI,
        address: abcTokenAddress,
        client: {public: publicClient, wallet: $walletClient.value!, chain: publicClient.chain},
    });
    return contract;
})