# Defi Token Farm

## Description

This is Token farm in which you can stake tokens and get rewards.

In Farming you stake tokens in a “Farm”.In exchange for this staking, you get rewards in the form of another token (in this application we call it as Farm Token). For staking we use a token called mDai.

 ## How to Run the Application

    1. Clone repository using `git clone https://github.com/printfjoby/DeFi-Token-Farm.git`

    2. To install depndencies, run `npm install` from the root(/) directory.

    3. Set up Ganache, by following the instuctions from : `https://www.trufflesuite.com/docs/ganache/quickstart`
    
    4. Insatll metamask browser extention, if not installed.

    5. From root directory, 
    
        run `truffle migrate --reset`

    6. To run the frontend part, just use npm start and it will start a server in localhost.
        
        The Application will start running on `localhost:3000`

## How to Test the Contract

    1. Please follow the step 1 - 6 of *How to Run the Application*.

    2. Now start the test using:
        
        run `truffle test`

## How to interact with the Application
    Once you successfully run the application port:3000, follow the instructions given below:

    1. Enter '100' in the Stake Token Input feild and click on the Stake button. As the Metamask prompts, confirm the transation. You can see that the Staking balance changes from 0 to 100 mDai and the balance will change from 100 to 0.



    2. In order to reward the stake holder we can run the issue-token script

        run `truffle exec scripts/issue-token.js`

        Once you runt he script, you can see that the stake holder's Reward balance increases from 0 to 100 FARM Token.

    3. To unstake, Click on the `Unstake` button. Then you could see that the staking balance changes from 100 to 0 and the balance changes from 0 to 100.