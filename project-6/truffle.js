const HDWalletProvider = require('truffle-hdwallet-provider');
const infuraKey = "183854d161da46e089f32fd5f11335b6"; // find in infura website
const mnemonic = "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat"; // truffle develop --network rinkeby

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: { // truffle migrate --network rinkeby
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`),
        network_id: 4,       // rinkeby's id
        gas: 4500000,        // rinkeby has a lower block limit than mainnet
        gasPrice: 10000000000
    }

  }
};