import TestWeave from 'testweave-sdk';
import Arweave from "arweave";
import { createContract, readContract, interactWrite } from 'smartweave';
import fs from 'fs';

// init arweave as usual
const arweave = Arweave.init({
  host: 'localhost',
  port: 1984,
  protocol: 'http',
  timeout: 20000,
  logging: false,
});

const contractInitState = `
{
    "ticker": "TESTWEAVE_PST_TOKEN",
    "balances": {
        "MlV6DeOtRmakDOf6vgOBlif795tcWimgyPsYYNQ8q1Y": 100001234
    }
  }
`

async function main() {
    // init TestWeave on the top of arweave
    const testWeave = await TestWeave.default.init(arweave);

    const contractSource = fs.readFileSync('token-pst-contract.js').toString();

    // create the contract and mine the transaction for creating it
    const c = await createContract(arweave, testWeave.rootJWK, contractSource, contractInitState);
    await testWeave.mine();

    // read the contract before performing any interaction
    const beforeTransaction = await readContract(arweave, c);
    console.log(`Before interact write: ${JSON.stringify(beforeTransaction)}`)

    // generate a wallet
    const jkw = await arweave.wallets.generate();
    const generatedAddr = await arweave.wallets.getAddress(jkw)

    // interact with the contract
    const iwt = await interactWrite(arweave, testWeave.rootJWK, c, {
    function: 'transfer',
    target: generatedAddr,
    qty:5000
    }, [] , generatedAddr, '23999392')
    console.log(`Interact write transaction: ${JSON.stringify(iwt)}`);

    // mine the contract interaction transaction
    await testWeave.mine();

    // get the new balance of the generated address (it should be 23999392)
    const generatedAddressBalance = await arweave.wallets.getBalance(generatedAddr)
    console.log(generatedAddressBalance)

    // read the contract after the interact write transaction (the generated wallet should own 5000 tokens)
    const afterTransaction = await readContract(arweave, c);
    console.log(`After interact write: ${JSON.stringify(afterTransaction)}`);
}

main().then(() => {console.log("done")});
