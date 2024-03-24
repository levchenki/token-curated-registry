import {defineConfig} from '@wagmi/cli';
import {sepolia} from '@wagmi/core/chains';
import {etherscan, react} from '@wagmi/cli/plugins';


export default defineConfig({
    out: 'src/types/contracts.ts',
    contracts: [],
    plugins: [
        etherscan({
            apiKey: process.env.ETHERSCAN_API_KEY,
            contracts: [
                {
                    name: 'Token',
                    address: process.env.TOKEN_CONTRACT_ADDRESS as `0x${string}`,
                },
            ],
            chainId: sepolia.id,
        }),
        react()
    ],
});
