const smartest = require("../index");
const Arweave = require("arweave");
const fs = require("fs");

if (process.argv[2] === undefined) throw "Wallet path not defined";

async function main() {
  const arweave = Arweave.init({
    host: "arweave.net",
    port: 443,
    protocol: "https",
    timeout: 20000,
    logging: false
  });

  const wallet = JSON.parse(fs.readFileSync(process.argv[2]));
  const walletAddress = await arweave.wallets.jwkToAddress(wallet);

  // Load random contract
  const randomSrc = fs.readFileSync(`test/random.js`, "utf8");
  const randomContractId = "a1s2d3f4";
  const randomInitState = JSON.parse(
    fs.readFileSync(`test/random_init_state.json`)
  );
  smartest.writeContractState(randomContractId, randomInitState);

  // Load tally contract
  const tallySrc = fs.readFileSync(`test/tally.js`, "utf8");
  const tallyContractId = "q5w6e7r8";
  const tallyInitState = JSON.parse(
    fs.readFileSync(`test/tally_init_state.json`)
  );
  smartest.writeContractState(tallyContractId, tallyInitState);

  const randomInput = {
    function: "generate"
  };

  const tallyInput = {
    function: "tally",
    randomContractId: randomContractId
  };

  for (let i = 0; i < 10; ++i) {
    console.log("Pass", i);
    await smartest.interactWrite(
      arweave,
      randomSrc,
      wallet,
      randomInput,
      smartest.readContractState(randomContractId),
      walletAddress,
      randomContractId
    );

    await smartest.interactWrite(
      arweave,
      tallySrc,
      wallet,
      tallyInput,
      smartest.readContractState(tallyContractId),
      walletAddress,
      tallyContractId
    );
  }

  console.log(smartest.readContractState(tallyContractId));
}

main().then(() => {
  console.log("Test complete");
});
