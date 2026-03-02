# DefiLlama-Adapters

DeFi TVL (Total Value Locked) adapter framework for DefiLlama — 6,000+ protocol adapters across 150+ blockchain networks.

## Stack
- JavaScript/Node.js (CommonJS modules)
- `@defillama/sdk` (always latest) for chain interactions
- pnpm (CI/CD), npm (local)

## Setup
```bash
npm install
# or
pnpm install

# Configure RPC endpoints
cp env.sample .env
# Edit .env with your RPC URLs
```

## Commands
```bash
# Test a specific adapter
node test.js projects/pangolin/index.js
node test.js projects/aave/v3.js 1729080692    # with timestamp
node test.js projects/aave/v3.js 2024-10-16   # with date

# Interactive REPL testing
npm run tvl           # Test TVL adapters interactively
npm run treasury      # Test treasury adapters
npm run entities      # Test entities adapters

# Linting
npm run lint
npm run eslint:github-action

# Build
npm run build         # Build module imports for deployment
```

## Adapter Structure
```javascript
// projects/your-protocol/index.js
module.exports = {
  ethereum: {
    tvl: async (api) => {
      // Use api.call(), api.multiCall(), api.sumTokens()
    }
  },
  arbitrum: { tvl: asyncFunction },
  staking: asyncFunction,
  methodology: "Description of how TVL is calculated",
  start: '2023-01-01',
  timetravel: true,
}
```

## Key Rules
- **No new npm packages** — only use existing dependencies
- **TVL from on-chain data** — no centralized API fetches
- **Support historical lookups** via block timestamps
- **Do not edit** `package.json` or `package-lock.json`

## Common Helpers (`projects/helper/`)
```javascript
const { sumTokens2 } = require('./helper/unwrapLPs')
const { uniV3Export } = require('./helper/uniswapV3')

// Balance aggregation
await api.sumTokens({ owners: [...], tokens: [...] })

// Contract calls
await api.call({ target: address, abi: 'function name()' })
await api.multiCall({ abi: '...', calls: [...] })
```

## Whitelisted Exports
`tvl`, `staking`, `pool2`, `borrowed`, `methodology`, `misrepresentedTokens`, `timetravel`, `start`, `doublecounted`, `hallmarks`, `deadFrom`, `ownTokens`, `vesting`

## CI/CD
GitHub Actions: detects modified files in PR → runs `test.js` on changed adapters → posts results as PR comment
