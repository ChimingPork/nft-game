// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//NFT contract to inherit form Openzep
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Helper functions from Openzep
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

// Helper we wrote to encode in Base64
import "./libraries/Base64.sol";

import "hardhat/console.sol";

// Contract inherits ERC721 standards
contract MyEpicGame is ERC721 {

uint randNonce = 0; // Ensure algorith has different inputs every time

//Function for low security randomness
function randMod(uint _modulus) internal returns(uint) {
    randNonce++;
    return uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))) % _modulus; 
}

    //Hold Character Attributes in a struct
    struct CharacterAttributes {
        uint characterIndex;
        string name;
        string imageURI;
        uint hp;
        uint maxHp;
        uint attackDamage;
        uint defense;
    }

// The tokenId is the NFTs unique identifier, it's just a number that counts up 0,1,2,3 etc...
using Counters for Counters.Counter;
Counters.Counter private _tokenIds;

// Array to hold default data for the characters
CharacterAttributes[] defaultCharacters;

// Create a mapping from the nft's tokenId => that NFTs attributes
mapping(uint256 => CharacterAttributes) public nftHolderAttributes;

// A mapping from an address => the tokenID gives an easy way to store the owner of the NFT and reference it later
mapping(address => uint256) public nftHolders;

event CharacterNFTMinted(address sender, uint256 tokenId, uint256 characterIndex);
event AttackComplete(address sender, uint newBossHp, uint newPlayerHp);

struct BigBoss {
    string name;
    string imageURI;
    uint hp;
    uint maxHp;
    uint attackDamage;
    uint defense;
}

BigBoss public bigBoss;

// Data passed into contract when first initializing characters
// Pass these values from run.js
constructor(
    string[] memory characterNames,
    string[] memory characterImageURIs,
    uint[] memory characterHp,
    uint[] memory characterAttackDmg,
    uint[] memory characterDefense,
    string memory bossName,
    string memory bossImageURI,
    uint bossHp,
    uint bossAttackDamage,
    uint bossDefense
)

    // Below, you can also see I added some special identifier symbols for our NFT.
    // This is the name and symbol for our token, ex Ethereum and ETH. I just call mine
    // Heroes and HERO. Remember, an NFT is just a token!
    ERC721("Heroes", "HERO") {
    
    bigBoss = BigBoss({
        name: bossName,
        imageURI: bossImageURI,
        hp: bossHp,
        maxHp: bossHp,
        attackDamage: bossAttackDamage,
        defense: bossDefense
    });

    console.log("Done initializing boss %s w/ HP %s, img %s", bigBoss.name, bigBoss.hp, bigBoss.imageURI);

    // Loop through all the characters and save their values in the contract
    for(uint i = 0; i < characterNames.length; i += 1) {
        defaultCharacters.push(CharacterAttributes({
            characterIndex: i,
            name: characterNames[i],
            imageURI: characterImageURIs[i],
            hp: characterHp[i],
            maxHp: characterHp[i],
            attackDamage: characterAttackDmg[i],
            defense: characterDefense[i]
        }));

            CharacterAttributes memory c = defaultCharacters[i];
            console.log("Done initializing %s w/ HP %s, img %s", c.name, c.hp, c.imageURI);
        }

        // I increment _tokenIds here so that my first NFT has an ID of 1.
        _tokenIds.increment();
    }

    function checkIfUserHasNFT() public view returns (CharacterAttributes memory) {
        //Get tokenID of the user's character NFT
        uint256 userNftTokenId = nftHolders[msg.sender];
        //If tokenID exists in the map, return the character
        if (userNftTokenId > 0) {
            return nftHolderAttributes[userNftTokenId];
        }
        //Else, return empty character
        else {
            CharacterAttributes memory emptyStruct;
            return emptyStruct;
        }
    }

    function getAllDefaultCharacters() public view returns (CharacterAttributes[] memory) {
        return defaultCharacters;
    }

    function getBigBoss() public view returns (BigBoss memory) {
        return bigBoss;
    }

    function attackBoss() public {
        // Get the state of the player NFT
        uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
        CharacterAttributes storage player = nftHolderAttributes[nftTokenIdOfPlayer];
        uint256 attackModifier = randMod(10);
        
        console.log("\nPlayer w/ character %s about to attack. Has %s HP and %s AD", player.name, player.hp, player.attackDamage);
        console.log("Boss %s has %s HP and %s AD", bigBoss.name, bigBoss.hp, bigBoss.attackDamage);
       
        // Make sure the player has > 0 HP
        require (
            player.hp > 0,
            "Error: character must have HP to attack boss."
        );

        // Make sure the boss has > 0 Hp
        require (
            bigBoss.hp > 0,
            "Error: Boss must have HP to attack character."
        );
        // Allow the player to attack the boss
        // Make sure the player has > 0 HP
        require (
            player.hp > 0,
            "Error: character must have HP to attack boss."
        );

        // Make sure the boss has > 0 Hp
        require (
            bigBoss.hp > 0,
            "Error: Boss must have HP to attack character."
        );
        // Allow the player to attack the boss
        if (bigBoss.hp < player.attackDamage) {
        bigBoss.hp = 0;
        } else if (bigBoss.defense < attackModifier) { 
            bigBoss.hp = bigBoss.hp - player.attackDamage;
        } else {
            console.log("The Dragon blocked the attack!");
        } 

        // Allow boss to attack player
        if (player.hp < bigBoss.attackDamage) {
            player.hp = 0;
            console.log("You have died!");
        } else if (player.defense < attackModifier) { 
            player.hp = player.hp - bigBoss.attackDamage;
        } else {
            console.log("You blocked the Dragon's attack!");
            }
        
        emit AttackComplete(msg.sender, bigBoss.hp, player.hp);

        }

    //Users use this function to get NFT based on the characterId they send in
    function mintCharacterNFT(uint _characterIndex) external {
        // Get current tokenId (starts at 1 since we incremented in the constructor).
        uint256 newItemId = _tokenIds.current();

    //Assigns the tokenId to the caller's wallet address.
    _safeMint(msg.sender, newItemId);

    // We map the tokenId => their character attributes
    nftHolderAttributes[newItemId] = CharacterAttributes({
        characterIndex: _characterIndex,
        name: defaultCharacters[_characterIndex].name,
        imageURI: defaultCharacters[_characterIndex].imageURI,
        hp: defaultCharacters[_characterIndex].hp,
        maxHp: defaultCharacters[_characterIndex].maxHp,
        attackDamage: defaultCharacters[_characterIndex].attackDamage,
        defense: defaultCharacters[_characterIndex].defense
    });

    console.log("Minted NFT w/ tokenId %s and characterIndex %s", newItemId, _characterIndex);

    
    nftHolders[msg.sender] = newItemId;

    emit CharacterNFTMinted(msg.sender, newItemId, _characterIndex);

    _tokenIds.increment();
    }
        function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        CharacterAttributes memory charAttributes = nftHolderAttributes[_tokenId];

        string memory strHp = Strings.toString(charAttributes.hp);
        string memory strMaxHp = Strings.toString(charAttributes.maxHp);
        string memory strAttackDamage = Strings.toString(charAttributes.attackDamage);
        string memory strDefense = Strings.toString(charAttributes.defense);

        string memory json = Base64.encode(
            abi.encodePacked(
                '{"name": "',
                charAttributes.name,
                ' -- NFT #: ',
                Strings.toString(_tokenId),
                '", "description": "This is an NFT that lets people play in the game Metaverse Slayer!", "image": "',
                charAttributes.imageURI,
                '", "attributes": [ { "trait_type": "Health Points", "value": ',strHp,', "max_value":',strMaxHp,'}, { "trait_type": "Attack Damage", "value": ',strAttackDamage,'}, { "trait_type": "Defense", "value": ',strDefense,'}]}'
            )
        );

        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return output;
    }
}