import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
require("dotenv").config()
import "dotenv/config"
import "solidity-coverage"
import "hardhat-deploy"

const SEPOLIA_RPC_URL =
    process.env.SEPOLIA_RPC_URL ||
    "https://eth-sepolia.g.alchemy.com/v2/5D-5yIP-czfO_JbmeF2Bxiwk1ue2SzVV"
const PRIVATE_KEY =
    process.env.PRIVATE_KEY ||
    "041a336cc40386bea2b3d53982a6d82fe7b00b903b92e60b0ab2dbef2e11731b"
const REPORT_GAS = true

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            // gasPrice: 130000000000,
        },
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 11155111,
        },
    },
    solidity: {
        compilers: [
            {
                version: "0.8.24",
            },
            {
                version: "0.7.5",
            },
            {
                version: "0.8.7",
            },
        ],
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
    },
    gasReporter: {
        enabled: REPORT_GAS,
        currency: "INR",
        outputFile: "gas-report.txt",
        noColors: true,
        coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    },
}

export default config
