import {defineConfig} from '@wagmi/cli';
import {tokenABI} from "./src/types/abi";
import {react} from '@wagmi/cli/plugins';

export default defineConfig({
    out: 'src/types/clients.ts',
    contracts: [
        {
            abi: tokenABI,
            address: process.env.VITE_TOKEN_CONTRACT_ADDRESS as `0x${string}`,
            name: 'ABCToken',
        }
    ],
    plugins: [
        react()
    ],
});
