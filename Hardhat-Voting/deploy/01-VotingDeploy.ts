import verify from "../utils/verify"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import {
    developmentChains,
    networkConfig,
    VERIFICATION_BLOCK_CONFIRMATIONS,
} from "../helper-hardhat-config"

const deployVoting: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment,
) {
    const { deployments, network, getNamedAccounts } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS

    log("----------------------------------------------------------------\n")
    log("Dploying Voting Contract")
    const voting = await deploy("Voting", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: waitBlockConfirmations,
    })
    console.log(`Voting Deployed at ${voting.address}\n`)

    // Verify the deployment
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log("Verifying...")
        await verify(voting.address, [])
    }
    log("----------------------------------------------------")
}

export default deployVoting
deployVoting.tags = ["all", "voting"]