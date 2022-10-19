import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import './Components/SelectCharacter';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  //State variable to store user public wallet
  const [currentAccount, setCurrentAccount] = useState(null);

  //State Variable to store characterNFT
  const [characterNFT, setCharacterNFT] = useState(null);

  // Actions
  const CheckIfWalletIsConnected = async () => {
    // Do we have access to window.ethereum?
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
        //Can we access the users wallet?
        const accounts = await ethereum.request({ method: "eth_accounts" });
        //May have multiple accounts, grab first
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account:", account);
          setCurrentAccount(account);
        } else {
          console.log("No authourized account found");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderContent = () => {
    // Scenario 1
    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <img
              src="https://media.giphy.com/media/3P0oEX5oTmrkY/giphy.gif"
              alt="LoTR GIF"
          />
          <button
          className="cta-button connect-wallet-button"
          onClick={connectWalletAction}
          >
            Connect Wallet To Get Started
          </button>
        </div>
      );
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
    }
  };

  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      //Request access to account
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  //Run the function when page loads
  useEffect(() => {
    CheckIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Metaverse Slayer ⚔️</p>
          <p className="sub-text">Team up to protect the Metaverse!</p>
          {renderContent()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
