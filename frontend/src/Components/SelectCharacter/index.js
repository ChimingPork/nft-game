import React, {useEffect, useState } from 'react';
import './SelectCharacter.css';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import myEpicGame from '../../utils/MyEpicGame.json';

const SelectCharacter = ({ setCharacterNFT }) => {
    const [characters, setCharacters] = useState([]);
    const [gameContract, setGameContract] = useState(null);

    useEffect(() => {
        const { ethereum } = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const gameContract = new ethers.Contract(
                CONTRACT_ADDRESS,
                myEpicGame.abi,
                signer
            );
            //Set Game Contract in State
            setGameContract(gameContract);
        } else {
            console.log("Ethereum object not found");
        }
    }, []);

    useEffect(() => {
      const getCharacters = async () => {
        try {
            console.log("Getting contract characters to mint");
            //Call the contract to get all the mintable characters.
            const charactersTxn = await gameContract.getAllDefaultCharacters();
            console.log("charactersTxn", charactersTxn);

            //Go through characaters and transform the data
            const characters = charactersTxn.map((characterData) =>
            transformCharacterData(characterData)
            );
            //Set all mintable characters in the state
            setCharacters(characters);
        } catch (error) {
            console.log("Something went wrong fetching characters", error)
        }
    };
    //Callback that will fire when mint event is received
    const onCharacterMint = async (sender, tokenId, characterIndex) => {
        console.log(
            `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
        );
        
        alert(`Your NFT is all done -- see it here: https://goerli.pixxiti.com/nfts/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)

        //If gameContract is ready get characters!
        if (gameContract) {
            const characterNFT = await gameContract.checkIfUserHasNFT();
            console.log("CharacterNFT: ", characterNFT);
            setCharacterNFT(transformCharacterData(characterNFT));
        }
    };

        if (gameContract) {
            getCharacters();
            gameContract.on('CharacterNFTMinted', onCharacterMint);
        }

        return () => {
            if (gameContract) {
                gameContract.off("CharacterNFTMinted", onCharacterMint);
            }
        };
    }, [gameContract, setCharacterNFT]);

    const renderCharacters = () => (
        characters.map((character, index) => 
        <div className="character-item" key={character.name}>
            <div className="name-container">
                <p>{character.name}</p>
            </div>
            <img src={character.imageURI} alt={character.name} />
            <button 
            type="button"
            className="character-mint-button"
            onClick={()=> mintCharacterNFTAction(index)}
            >{`Mint ${character.name}`}</button>
        </div>
    ));

    const mintCharacterNFTAction = async (characterId) => {
        try {
            if (gameContract) {
                console.log("Minting character in progress...");
                const mintTxn = await gameContract.mintCharacterNFT(characterId);
                await mintTxn.wait();
                console.log("mintTxn:", mintTxn);
            }
        } catch (error) {
            console.warn("MintCharacterAction error:", error)
        }
    };

    return (
        <div className="select-character-container">
            <h2>Mint Your Hero. Choose Wisely.</h2>
            {/* only show when there are characters in the state*/}
            {characters.length > 0 && (
                <div className="character-grid">{renderCharacters()}</div>
            )}
        </div>
    );
};

export default SelectCharacter;