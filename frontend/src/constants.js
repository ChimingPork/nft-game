const CONTRACT_ADDRESS = '0x99287A544b113344d70Ca1Cb49cCd4E8f60210fB';

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