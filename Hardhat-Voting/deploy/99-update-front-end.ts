const {
    frontEndContractsFile,
    frontEndAbiLocation,
} = require("../helper-hardhat-config")
require("dotenv").config()
const fs = require("fs")
const { network, ethers } = require("hardhat")

module.exports = async () => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Writing to front end...")
        await updateContractAddresses()
        await updateAbi()
        console.log("Front end written!")
    }
}

async function updateAbi() {
    const Voting = await ethers.getContract("Voting")
    fs.writeFileSync(
        `${frontEndAbiLocation}Voting.json`,
        Voting.interface.format(ethers.utils.FormatTypes.json),
    )

    const Migrations = await ethers.getContract("Migrations")
    fs.writeFileSync(
        `${frontEndAbiLocation}Migrations.json`,
        Migrations.interface.format(ethers.utils.FormatTypes.json),
    )
}

async function updateContractAddresses() {
    const chainId = network.config.chainId.toString()
    const Voting = await ethers.getContract("Voting")
    const contractAddresses = JSON.parse(
        fs.readFileSync(frontEndContractsFile, "utf8"),
    )
    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId]["Voting"].includes(Voting.address)) {
            contractAddresses[chainId]["Voting"].push(Voting.address)
        }
    } else {
        contractAddresses[chainId] = {
            Voting: [Voting.address],
        }
    }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(Voting))
}
module.exports.tags = ["frontend"]
