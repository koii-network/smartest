const handlers = [
  tally
];

export async function handle(state, action) {
  const handler = handlers.find((fn) => fn.name === action.input.function);
  if (handler) return await handler(state, action);
  throw new ContractError(`Invalid function: "${action.input.function}"`);
}

// Tally the last digit of the random number from the "random" contract
async function tally(state, action) {
  const randomContractId = action.input.randomContractId;
  const randomState = await SmartWeave.contracts.readContractState(
    randomContractId
  )
  const randomNum = randomState.number;
  ++state.tally[randomNum % 10]
  return { state }
}