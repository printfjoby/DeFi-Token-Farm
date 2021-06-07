import React, { Component } from 'react'
import Navbar from './Navbar'
import Main from './Main'
import './App.css'
import Web3 from 'web3'
import DaiToken from '../abis/DaiToken.json'
import FarmToken from '../abis/FarmToken.json'
import TokenFarm from '../abis/TokenFarm.json'

class App extends Component {
  async componentDidMount() {
    await this.loadWeb3()
    await this.loadBloackchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert(
        'Non-Ethereum browser detected. You should consider trying MetaMask!',
      )
    }
  }

  async loadBloackchainData() {
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()

    //
    const daiTokenData = DaiToken.networks[networkId]
    if (daiTokenData) {
      const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address)
      this.setState({ daiToken })
      let daiTokenBalance = await daiToken.methods
        .balanceOf(this.state.account)
        .call()
      this.setState({ daiTokenBalance: daiTokenBalance.toString() })
    } else {
      window.alert('DaiToken contract not deployed to detected network')
    }

    //
    const farmTokenData = FarmToken.networks[networkId]
    if (farmTokenData) {
      const farmToken = new web3.eth.Contract(
        FarmToken.abi,
        farmTokenData.address,
      )
      this.setState({ farmToken })
      let farmTokenBalance = await farmToken.methods
        .balanceOf(this.state.account)
        .call()
      this.setState({ farmTokenBalance: farmTokenBalance.toString() })
    } else {
      window.alert('FarmToken contract not deployed to detected network')
    }

    //
    const tokenFarmData = TokenFarm.networks[networkId]
    if (tokenFarmData) {
      const tokenFarm = new web3.eth.Contract(
        TokenFarm.abi,
        tokenFarmData.address,
      )
      this.setState({ tokenFarm })
      let stakingBalance = await tokenFarm.methods
        .stakingBalance(this.state.account)
        .call()
      this.setState({ stakingBalance: stakingBalance.toString() })
    } else {
      window.alert('TokenFarm contract not deployed to detected network')
    }

    this.setState({ loading: false })
  }

  stakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.daiToken.methods
      .approve(this.state.tokenFarm._address, amount)
      .send({ from: this.state.account })
      .on('transactionHash', (hash) => {
        this.state.tokenFarm.methods
          .stakeTokens(amount)
          .send({ from: this.state.account })
          .on('transactionHash', (hash) => {
            this.setState({ loading: false })
          })
      })
  }

  unstakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.tokenFarm.methods
      .unstakeTokens()
      .send({ from: this.state.account })
      .on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      daiToken: {},
      farmToken: {},
      tokenFarm: {},
      daiTokenBalance: '0',
      farmTokenBalance: '0',
      stakingBalance: '0',
      loading: true,
    }
  }

  render() {
    let content
    if (this.state.loading) {
      content = (
        <p id="loader" className="text-center">
          {' '}
          Loading..{' '}
        </p>
      )
    } else {
      content = (
        <Main
          daiTokenBalance={this.state.daiTokenBalance}
          farmTokenBalance={this.state.farmTokenBalance}
          stakingBalance={this.state.stakingBalance}
          stakeTokens={this.stakeTokens}
          unstakeTokens={this.unstakeTokens}
        />
      )
    }
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main
              role="main"
              className="col-lg-12 ml-auto mr-auto"
              style={{ maxWidth: '600px' }}
            >
              <div className="content mr-auto ml-auto">
                <a href="" target="_blank" rel="noopener noreferrer"></a>

                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    )
  }
}

export default App
