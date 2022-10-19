const main = async () => {
    const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
    const gameContract = await gameContractFactory.deploy(
        ["Rogue", "Barbarian", "Paladin"], //Names
        ["https://i.postimg.cc/52qG14Lq/Portrait-Works11.jpg", "https://i.postimg.cc/XJXDw9hQ/Portrait-Works01a.jpg", "https://i.postimg.cc/wBwGywW1/Portrait-Works02a.jpg"], // images
        [300, 600, 450], // Hp Values
        [45, 100, 65], // Attack Damage Values
        [3, 5, 6], //Defense Values
        "Dragon", // Boss Name
        "https://i.postimg.cc/MHDZjgqR/Dragon-Boss.png", // Boss image
        10000, // Boss HP
        50, // Boss Attack
        3 // Boss Defense
    );
    
    await gameContract.deployed();
    console.log("Contract deployed to:", gameContract.address);

    let txn;
    //We only have 3 characters.
    //Character with index 2 our the array
    txn = await gameContract.mintCharacterNFT(0);
    await txn.wait();

    // Dynamic Gas Limit to fix transaction failed, Callback_Error with extra attack logic? 
        // const startEstimate = await gameContract.estimateGas.attackBoss();
        // txn = await gameContract.attackBoss({
        //     gasLimit: startEstimate,
        // });
        // await txn.wait();
        // console.log("attack 1");
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();