import {HardhatUserConfig} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

import dotenv from "dotenv";

dotenv.config({path: '../.env'})

const mumbaiUrl = `https://polygon-mumbai.infura.io/v3/${process.env.VITE_INFURA_API_KEY}`;

const config: HardhatUserConfig = {
    solidity: "0.8.24",
    networks: {
        mumbai: {
            url: mumbaiUrl,
            accounts: [process.env.PRIVATE_KEY ?? ""]
        }
    },
    etherscan: {
        apiKey: process.env.POLYGONSCAN_API_KEY
    }
};

export default config;
