const FarmToken = artifacts.require('FarmToken')
const DaiToken = artifacts.require('DaiToken')
const TokenFarm = artifacts.require('TokenFarm')

module.exports = async function (deployer, network, accounts) {
  // Deploy DAI Token
  await deployer.deploy(DaiToken)
  const daiToken = await DaiToken.deployed()

  // Deploy FARM Token
  await deployer.deploy(FarmToken)
  const farmToken = await FarmToken.deployed()

  // Deploy TokenFarm
  await deployer.deploy(TokenFarm, farmToken.address, daiToken.address)
  const tokenFarm = await TokenFarm.deployed()

  //Transfer all FARM Token to TokenFarm
  await farmToken.transfer(tokenFarm.address, '1000000000000000000000000')

  //Transfer 100 DAI tokens to investor
  await daiToken.transfer(accounts[1], '100000000000000000000')
}
