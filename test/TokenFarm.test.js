const { assert } = require('chai')
import Breadcrumb from 'react-bootstrap/Breadcrumb'

const DaiToken = artifacts.require('DaiToken')
const FarmToken = artifacts.require('FarmToken')
const TokenFarm = artifacts.require('TokenFarm')

require('chai').use(require('chai-as-promised')).should()

function tokens(n) {
  return web3.utils.toWei(n, 'ether')
}

contract('TokenFarm', ([owner, investor]) => {
  let daiToken, farmToken, tokenFarm

  before(async () => {
    //Load Contracts
    daiToken = await DaiToken.new()
    farmToken = await FarmToken.new()
    tokenFarm = await TokenFarm.new(farmToken.address, daiToken.address)

    //Transfer all Farm tokens to tokenFarm
    await farmToken.transfer(tokenFarm.address, tokens('1000000'))

    //Send tokens to investor
    await daiToken.transfer(investor, tokens('100'), { from: owner })
  })

  describe('Mock Dai deployment', async () => {
    it('has a name', async () => {
      const name = await daiToken.name()
      assert.equal(name, 'Mock DAI Token')
    })
  })

  describe('Farm Token deployment', async () => {
    it('has a name', async () => {
      const name = await farmToken.name()
      assert.equal(name, 'FARM Token')
    })
  })

  describe('Token Farm deployment', async () => {
    it('has a name', async () => {
      const name = await tokenFarm.name()
      assert.equal(name, 'Token Farm')
    })

    it('contract has 1 million Farm tokens', async () => {
      let balance = await farmToken.balanceOf(tokenFarm.address)
      assert.equal(balance.toString(), tokens('1000000'))
    })
  })

  describe('Farming tokens', async () => {
    it('rewards investors for staking Dai tokens', async () => {
      let result
      result = await daiToken.balanceOf(investor)
      assert.equal(
        result.toString(),
        tokens('100'),
        'investor does not owns correct Dai token before staking ',
      )

      await daiToken.approve(tokenFarm.address, tokens('100'), {
        from: investor,
      })
      await tokenFarm.stakeTokens(tokens('100'), { from: investor })

      //Check wheather the Dai token balance of investor become zero after staking
      result = await daiToken.balanceOf(investor)
      assert.equal(
        result.toString(),
        tokens('0'),
        'investor Dai token balance is correct after staking',
      )

      result = await daiToken.balanceOf(tokenFarm.address)
      assert.equal(
        result.toString(),
        tokens('100'),
        'Token Farm Dai token balance is correct after staking',
      )

      result = await tokenFarm.stakingBalance(investor)
      assert.equal(
        result.toString(),
        tokens('100'),
        'investor staking balance is correct after staking',
      )

      result = await tokenFarm.isStaking(investor)
      assert.equal(
        result.toString(),
        'true',
        'investor staking status is correct after staking',
      )

      //Issue Token
      await tokenFarm.issueTokens(0, 0, { from: owner })

      //Check investor farm token balance after issuance
      result = await farmToken.balanceOf(investor)
      assert.equal(
        result.toString(),
        tokens('100'),
        'investor farm token balance is correct after issuing',
      )

      //Ensure only owner can call issueToken function
      await tokenFarm.issueTokens(0, 0, { from: investor }).should.be.rejected

      // Unstake tokens
      await tokenFarm.unstakeTokens({ from: investor })

      //Check investor dai token balance after unstaking
      result = await daiToken.balanceOf(investor)
      assert.equal(
        result.toString(),
        tokens('100'),
        'investor dai token balance is correct after unstaking',
      )

      //Check TokenFarm contract's dai token balance after unstaking
      result = await daiToken.balanceOf(tokenFarm.address)
      assert.equal(
        result.toString(),
        tokens('0'),
        'Token Farm Dai token balance is correct after unstaking',
      )

      result = await tokenFarm.stakingBalance(investor)
      assert.equal(
        result.toString(),
        tokens('0'),
        'investor staking balance is correct after unstaking',
      )

      result = await tokenFarm.isStaking(investor)
      assert.equal(
        result.toString(),
        'false',
        'investor staking status is correct after unstaking',
      )
    })
  })
})
