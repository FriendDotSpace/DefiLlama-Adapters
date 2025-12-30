const { ethers } = require("ethers");
const { getLogs } = require('../helper/cache/getLogs');
const ADDRESSES = require('../helper/coreAssets.json');

const TRADE_EVENT_ABI = [
  "event Trade(uint256 indexed tokenId, address indexed trader, address indexed subject, bool isBuy, uint256 shareAmount, uint256 tokenAmount, uint256 supply)"
];

// FriendKey contract address
const CONTRACT_ADDRESS = "0xdfD77610dd30A21385b1B4C3AA6D20069624F792";

const USDC = ADDRESSES.base.USDC;

async function tvl(api) {
  // Get all Trade event logs from the contract
  // Note: This function automatically supports historical TVL queries!
  // When DefiLlama queries for a specific day/timestamp, api.block will be set to that block,
  // and getLogs will automatically query events up to that block (via api.block as toBlock)
  // fromBlock: deployment block number for efficiency
  const tradeLogs = await getLogs({
    api,
    target: CONTRACT_ADDRESS,
    eventAbi: TRADE_EVENT_ABI[0],
    fromBlock: 39282576, // Deployment block - getLogs uses api.block as toBlock for historical queries
    onlyArgs: true,
  });

  // Sum all tokenAmount values from Trade events
  // Trade event args: {tokenId, trader, subject, isBuy, shareAmount, tokenAmount, supply}
  // When onlyArgs: true, ethers returns an object with named properties
  let totalTokenAmount = BigInt(0);
  for (const log of tradeLogs) {
    // Access tokenAmount from the parsed event arguments
    const tokenAmount = BigInt(log.tokenAmount?.toString() || '0');
    totalTokenAmount += tokenAmount;
  }

  // Add the total to the API
  api.add(USDC, totalTokenAmount.toString());

  return api.getBalances();
}

module.exports = {
  methodology: 'TVL is calculated by summing all tokenAmount values emitted in Trade events from the FriendSpace contract. This represents the cumulative total value of all trades executed on the protocol.',

  base: {
    tvl: tvl,
    start: 1765272702, // timestamp of deployment sc
  },
};