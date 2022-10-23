const CONTRACT_ADDRESS = '0x8b9C5960ED47Ef2965Cb765884Ae8f3C0a9FdE87';

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