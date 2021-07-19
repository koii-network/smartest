# smartest
Minimal, portable, and local SmartWeave implementation

## Usage

- `smartest.readContractState(contractId)`
    - Read state from env
- `smartest.writeContractState(contractId, state)`
    - Write state to env
- `await smartest.interactWrite(arweave, contractSrc, wallet, contractInput, contractState, walletAddress, contractId)`
    - Execute contract and write state to env

## Example

```js
// import smartest
const smartest = require("../index");

// set the initial state
const tallyInitState = JSON.parse(
    fs.readFileSync(`test/tally_init_state.json`)
);
smartest.writeContractState(tallyContractId, tallyInitState);

// Load tally contract and prepare input
const tallySrc = fs.readFileSync(`test/tally.js`, "utf8");
const tallyContractId = "q5w6e7r8";
const tallyInput = {
    function: "tally",
    rngContractId: rngContractId
};

// Interact write contract
await smartest.interactWrite(
    arweave,
    tallySrc,
    wallet,
    tallyInput,
    smartest.readContractState(tallyContractId),
    walletAddress,
    tallyContractId
);

// Inspect output
console.log(smartest.readContractState(tallyContractId));
```

## Testing

`node test path/to/wallet.json`
