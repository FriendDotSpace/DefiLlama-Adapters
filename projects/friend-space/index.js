const { get } = require('../helper/http');
const ADDRESSES = require('../helper/coreAssets.json');

const USDC = ADDRESSES.base.USDC;

const API_BASE_URL = 'https://api.friend.space/api';
async function tvl(api) {
  try {
    const url = `${API_BASE_URL}/tvl/total?timestamp=${api.timestamp}`;
    // Option 3: Pass timestamp and other params as query parameters
    // const url = `${API_BASE_URL}/tvl?timestamp=${api.timestamp}&chain=base`;
    
    // Option 4: Use axios params option for cleaner query params
    // const data = await get(`${API_BASE_URL}/tvl`, {
    //   params: {
    //     timestamp: api.timestamp,
    //     chain: api.chain,
    //     // day: Math.floor(api.timestamp / 86400), // Convert to day if needed
    //   }
    // });
    
    // Call the API to get TVL data
    const data = await get(url);
    
    const tvlAmount = data.totalTvl;
    // Add USDC amount to the API
    // TVL amount should be in the smallest unit (6 decimals for USDC)
    api.add(USDC, tvlAmount.toString());
    
    return api.getBalances();
  } catch (error) {
    console.error('Error fetching TVL from API:', error.message);
    throw error;
  }
}

module.exports = {
  methodology: 'TVL is calculated by fetching the total value locked from the FriendSpace API endpoint at the queried timestamp. This represents the total value of all assets locked in the protocol at that specific point in time.',

  base: {
    tvl: tvl,
    start: 1767689090, // timestamp of project
  },
};

