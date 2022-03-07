const Web3 = require('web3')
const web3 = new Web3('http://localhost:9545');

const ERC725Y = require("./artifacts/ERC725YV2.json");

const PRIVATE_KEY = "0x889b4dc584027ff48d25cff6092c0f25231a5d26f6e6026013ecd6a6b0d0c716"
const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY)
// console.log("account: ", account)

async function showAccountBalance() {
    console.log(await web3.eth.getBalance(account.address))
}
showAccountBalance()

const erc725Y = new web3.eth.Contract(ERC725Y.abi)

async function deployERC725YContract() {
    const instance = await erc725Y.deploy({
        data: ERC725Y.bytecode,
        arguments: [account.address]
    }).send({
        from: account.address,
        gas: 1500000,
        // gasPrice: '30000000000000'
    })
    return instance._address;

}

async function main() {
    const contractAddress = await deployERC725YContract()
    const erc725Y = new web3.eth.Contract(ERC725Y.abi, contractAddress)
    
    // const owner = await erc725Y.methods.owner().call()
    // console.log("owner: ", owner)
    // console.log("account: ", account)

    const keys = [
        "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
        "0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
    ];

    const values = [
        "0x11111111",
        "0x22222222",
        "0x33333333",
    ]
    
    // await erc725Y.methods.setData(keys, values).send({
    //     from: account.address
    // })

    await erc725Y.methods['setData(bytes32[],bytes[])'](keys,values).send({
        from: account.address,
        gas: 3_500_000
    })

    const result = await erc725Y.methods['getData(bytes32[])'](keys).call()
    console.log(result)

}
main()