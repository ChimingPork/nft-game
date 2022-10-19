const CONTRACT_ADDRESS = '0x5C0b4E41a7dae8dC22759a879421397593194514';

const transformCharacterData = (characterData) => {
    return {
        name: characterData.name,
        imageURI: characterData.imageURI,
        hp: characterData.hp.toNumber(),
        maxHp: characterData.maxHp.toNumber(),
        attackDamage: characterData.attackDamage.toNumber(),
        defense: characterData.defense.toNumber()
    };
};

export { CONTRACT_ADDRESS, transformCharacterData };