import {computed} from "@preact/signals-react";
import {getContract} from "viem";
import {tokenABI} from "@/types/abi.ts";
import {$walletClient, publicClient} from "@/utils/clients.ts";
import {TOKEN_CONTRACT_ADDRESS} from "@/utils/constants.ts";

export const $tokenContract = computed(() => {
    return getContract({
        abi: tokenABI,
        address: TOKEN_CONTRACT_ADDRESS,
        client: {public: publicClient, wallet: $walletClient.value!, chain: publicClient.chain},
    });
})