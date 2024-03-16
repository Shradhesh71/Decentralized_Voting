import { assert, expect } from "chai"
import { Signer } from "ethers"
import { network, deployments, ethers } from "hardhat"
import { developmentChains, networkConfig } from "../../helper-hardhat-config"
import { Voting } from "../../typechain-types"

let fake = "0xE8c0d9e8Db4437EcfEa96dD899A12B7B8f539915"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Voting Units Test", () => {
          let votingContarct: any
          let deployer: Signer
          let user: Signer
          let voting: Voting
          let contract

          beforeEach(async () => {
              await deployments.fixture(["alls"]) // deploy all thre fiels
              ;[deployer, user] = await ethers.getSigners()
              votingContarct = await ethers.getContractFactory("Voting")
              contract = await votingContarct.deploy()
              voting = contract.connect(user)
          })

          describe("Add NEW candidate", () => {
              it("Only Owner can Access", async () => {
                  votingContarct = await ethers.getContractFactory(
                      "Voting",
                      deployer,
                  )
                  contract = await votingContarct.deploy()
                  voting = contract.connect(user)
                  expect(
                    await voting.addCandidate("Candidate", "Slogan","Bjp","416845")
                  ).to.be.revertedWith("NotOwner")
              })
              it("Candidate Count Increase by 1", async () => {
                  const v = await voting.addCandidate("Candidate", "Slogan","Bjp","416845")
                  assert((await voting.getTotalCandidate()).toString() == "1")

                  //   await expect(
                  //       voting.addCandidate("BJP", "Abki baar modi sarkar"),
                  //   ).to.be.revertedWith("NotOwner")
                  //   try {
                  //       await expect(
                  //           voting.addCandidate("Candidate", "Slogan"),
                  //       ).to.be.revertedWith("NotOwner")
                  //       console.log("try error")
                  //       // If the above line doesn't revert, we want the test to fail
                  //       expect.fail("Transaction should have reverted")
                  //   } catch (error: any) {
                  //       console.log("before error\n")
                  //       // Check if the error contains the expected revert reason
                  //       expect(error.message)
                  //       console.log(error.message)
                  //       console.log("\nafter error") //.to.include("revert NotOwner")
                  //   }
              })
              it("Vote count of new person is zero", async () => {
                await voting.addCandidate("Candidate", "Slogan","Bjp","416845")
                  assert((await voting.getTotalVoter()).toString() == "0")
              })
              it("Name and Slogan of Candidate are equal", async () => {
                await voting.addCandidate("Candidate", "Slogan","Bjp","416845")
                  const v = await voting.candidateDetails(0)
                  assert(v.name.toString() == "Candidate")
                  assert(v.slogan.toString() == "Slogan")
              })
          })

          describe("RegisterAsVoter, Test Voters Array and Mapping voterDetail", () => {
              it("Increse the voter count", async () => {
                  await voting.registerAsVoter(
                      "Tanish",
                      "8690238281",
                      "618143",
                      "tanish@gmail.com",
                  )
                  assert((await voting.getTotalVoter()).toString() == "1")
              })
              it("Voter is not verified initially, has not voted yet, and is not registered.", async () => {
                  await voting.registerAsVoter(
                      "Tanish",
                      "8690238281",
                      "618143",
                      "tanish@gmail.com",
                  )
                  const v = await voting.voterDetails(user)
                  assert(v[5] == false)
                  assert(v[6] == false)
                  assert(v[7] == true)
              })
              it("voter has name, number and voterAddress", async () => {
                  await voting.registerAsVoter(
                      "Tanish",
                      "8690238281",
                      "618143",
                      "tanish@gmail.com",
                  )

                  const v = await voting.voterDetails(user)
                  assert(v[1] == "Tanish")
                  assert(v[2] == "8690238281")
                  assert(v[0] == (await user.getAddress()))
              })
              it("Check voter array", async () => {
                  await voting.registerAsVoter(
                      "Tanish",
                      "8690238281",
                      "618143",
                      "tanish@gmail.com",
                  )

                  assert((await voting.voters(0)) == (await user.getAddress()))
              })
          })
          describe("verifyVoter Function", () => {
              beforeEach(async () => {
                  await voting.registerAsVoter(
                      "Tanish",
                      "8690238281",
                      "618143",
                      "tanish@gmail.com",
                  )
              })
              it("Only Owner can Access", async () => {
                  votingContarct = await ethers.getContractFactory(
                      "Voting",
                      deployer,
                  )
                  contract = await votingContarct.deploy()
                  voting = contract.connect(user)
                  expect(
                      await voting.verifyVoter(true, user.getAddress()),
                  ).to.be.revertedWith("NotOwner")
              })
              it("Check verifedStatus", async () => {
                  await voting.verifyVoter(true, user.getAddress())
                  const v = await voting.voterDetails(user.getAddress())
                  assert(v[5] == true)
              })
          })
          describe("vote function", async () => {
              beforeEach(async () => {
                  await voting.addCandidate("Candidate", "Slogan","Bjp","416845")
                  await voting.registerAsVoter(
                      "Tanish",
                      "8690238281",
                      "618143",
                      "tanish@gmail.com",
                  )
              })
              it("Already voted", async () => {})
              it("Not Verified", async () => {})
              it("Voting not Start", async () => {})
              it("Voting Ended", async () => {})
              it("Candidate vote count increase", async () => {})
              it("After voting in voterdetail has voted is true", async () => {})
          })
          describe("Set Elections details Function", () => {
              it("Only Owner can access", async () => {
                  votingContarct = await ethers.getContractFactory(
                      "Voting",
                      deployer,
                  )
                  contract = await votingContarct.deploy()
                  voting = contract.connect(user)
                  expect(
                      await voting.setElectionDetails(
                          "ECI",
                          "ecindia@gmail.com",
                          "Shradesh",
                          "Lok Shabha",
                          "Election Commision",
                      ),
                  ).to.be.revertedWith("NotOwner")
              })
              it("check Start and End term", async () => {
                  await voting.setElectionDetails(
                      "ECI",
                      "ecindia@gmail.com",
                      "Shradesh",
                      "Lok Shabha",
                      "Election Commision",
                  )
                  assert((await voting.getStart()) == true)
                  assert((await voting.getEnd()) == false)
              })
              it("Verified election Detail all five", async () => {
                  await voting.setElectionDetails(
                      "ECI",
                      "ecindia@gmail.com",
                      "Shradesh",
                      "Lok Shabha",
                      "Election Commision",
                  )
                  // console.log(voting.electionDetails)
              })
          })
      })

//   // Contracts are deployed using the first signer/account by default
// const [owner, otherAccount] = await ethers.getSigners();

// import {
//     time,
//     loadFixture,
//   } from "@nomicfoundation/hardhat-toolbox/network-helpers";
//   import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
//   import { expect } from "chai";
//   import { ethers } from "hardhat";

//   describe("Lock", function () {
//     // We define a fixture to reuse the same setup in every test.
//     // We use loadFixture to run this setup once, snapshot that state,
//     // and reset Hardhat Network to that snapshot in every test.
//     async function deployOneYearLockFixture() {
//       const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
//       const ONE_GWEI = 1_000_000_000;

//       const lockedAmount = ONE_GWEI;
//       const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

//       // Contracts are deployed using the first signer/account by default
//       const [owner, otherAccount] = await ethers.getSigners();

//       const Lock = await ethers.getContractFactory("Lock");
//       const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

//       return { lock, unlockTime, lockedAmount, owner, otherAccount };
//     }

//     describe("Deployment", function () {
//       it("Should set the right unlockTime", async function () {
//         const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);

//         expect(await lock.unlockTime()).to.equal(unlockTime);
//       });

//       it("Should set the right owner", async function () {
//         const { lock, owner } = await loadFixture(deployOneYearLockFixture);

//         expect(await lock.owner()).to.equal(owner.address);
//       });

//       it("Should receive and store the funds to lock", async function () {
//         const { lock, lockedAmount } = await loadFixture(
//           deployOneYearLockFixture
//         );

//         expect(await ethers.provider.getBalance(lock.target)).to.equal(
//           lockedAmount
//         );
//       });

//       it("Should fail if the unlockTime is not in the future", async function () {
//         // We don't use the fixture here because we want a different deployment
//         const latestTime = await time.latest();
//         const Lock = await ethers.getContractFactory("Lock");
//         await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
//           "Unlock time should be in the future"
//         );
//       });
//     });

//     describe("Withdrawals", function () {
//       describe("Validations", function () {
//         it("Should revert with the right error if called too soon", async function () {
//           const { lock } = await loadFixture(deployOneYearLockFixture);

//           await expect(lock.withdraw()).to.be.revertedWith(
//             "You can't withdraw yet"
//           );
//         });

//         it("Should revert with the right error if called from another account", async function () {
//           const { lock, unlockTime, otherAccount } = await loadFixture(
//             deployOneYearLockFixture
//           );

//           // We can increase the time in Hardhat Network
//           await time.increaseTo(unlockTime);

//           // We use lock.connect() to send a transaction from another account
//           await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
//             "You aren't the owner"
//           );
//         });

//         it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
//           const { lock, unlockTime } = await loadFixture(
//             deployOneYearLockFixture
//           );

//           // Transactions are sent using the first signer by default
//           await time.increaseTo(unlockTime);

//           await expect(lock.withdraw()).not.to.be.reverted;
//         });
//       });

//       describe("Events", function () {
//         it("Should emit an event on withdrawals", async function () {
//           const { lock, unlockTime, lockedAmount } = await loadFixture(
//             deployOneYearLockFixture
//           );

//           await time.increaseTo(unlockTime);

//           await expect(lock.withdraw())
//             .to.emit(lock, "Withdrawal")
//             .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
//         });
//       });

//       describe("Transfers", function () {
//         it("Should transfer the funds to the owner", async function () {
//           const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
//             deployOneYearLockFixture
//           );

//           await time.increaseTo(unlockTime);

//           await expect(lock.withdraw()).to.changeEtherBalances(
//             [owner, lock],
//             [lockedAmount, -lockedAmount]
//           );
//         });
//       });
//     });
//   });
