// Define the structure for chain data
type ChainData = {
  name: string;
  icon: string;
};

// Define the structure for platform data
type PlatformData = {
  name: string;
  icon: string;
};

// Define the structure for DEX data
type DexData = {
  name: string;
  icon: string;
};

// Define the structure for launch type relationships
type LaunchTypeData = {
  name: string;
  platforms: string[]; // Platform names allowed for this launch type
};

// Define the structure for chain relationships
type ChainRelationship = {
  chain: string; // Chain name
  dexes: string[]; // List of DEX names
  platforms: string[]; // List of platform names
};

// Chains data
export const CHAINS: ChainData[] = [
  { name: 'Ethereum', icon: '/assets/icons/ethereum.svg' },
  { name: 'BSC Smart Chain', icon: '/assets/icons/bsc.svg' },
  { name: 'Solana', icon: '/assets/icons/solana.svg' },
  { name: 'Base', icon: '/assets/icons/base.svg' },
  { name: 'Sui', icon: '/assets/icons/sui.svg' },
  { name: 'XRP Ledger', icon: '/assets/icons/xrpl.svg' },
  { name: 'AVAX', icon: '/assets/icons/avax.svg' },
];

// Platform data
export const PLATFORMS: PlatformData[] = [
  { name: 'GemPad', icon: '/assets/icons/gempad.png' },
  { name: 'PinkSale', icon: '/assets/icons/pinksale.svg' },
  { name: 'Manual Listing', icon: ' ' },
  { name: 'Pump.fun', icon: '/assets/icons/pumpfun.png' },
  { name: 'Other', icon: ' ' },
];

// DEX data
export const DEXES: DexData[] = [
  { name: 'Uniswap v2', icon: '/assets/icons/uniswap.png' },
  { name: 'Uniswap v3', icon: '/assets/icons/uniswap.png' },
  { name: 'SushiSwap', icon: '/assets/icons/sushiswap.svg' },
  { name: 'PancakeSwap', icon: '/assets/icons/pancakeswap.png' },
  { name: 'PancakeSwap v3', icon: '/assets/icons/pancakeswap.png' },
  { name: 'Raydium', icon: '/assets/icons/raydium.svg' },
  { name: 'Cetus', icon: '/assets/icons/cetus.svg' },
  { name: 'Other', icon: ' ' },
];

// Chain relationships
export const CHAIN_RELATIONSHIPS: ChainRelationship[] = [
  {
    chain: 'Ethereum',
    dexes: ['Uniswap v2', 'Uniswap v3', 'SushiSwap', 'PancakeSwap', 'Other'],
    platforms: ['GemPad', 'PinkSale', 'Manual Listing', 'Other'],
  },
  {
    chain: 'BSC Smart Chain',
    dexes: ['PancakeSwap', 'PancakeSwap v3', 'Other'],
    platforms: ['GemPad', 'PinkSale', 'Manual Listing', 'Other'],
  },
  {
    chain: 'Solana',
    dexes: ['Raydium', 'Other'],
    platforms: ['GemPad', 'Pump.fun', 'Manual Listing', 'PinkSale', 'Other'],
  },
  {
    chain: 'Base',
    dexes: ['Uniswap v2', 'Uniswap v3', 'Other'],
    platforms: ['PinkSale', 'Manual Listing', 'Other'],
  },
  {
    chain: 'Sui',
    dexes: ['Cetus', 'Other'],
    platforms: ['PinkSale', 'Manual Listing', 'Other'],
  },
  {
    chain: 'XRP Ledger',
    dexes: ['Other'],
    platforms: ['PinkSale', 'Manual Listing', 'Other'],
  },
  {
    chain: 'AVAX',
    dexes: ['Other'],
    platforms: ['PinkSale', 'Manual Listing', 'Other'],
  },
];

// Launch types data
export const LAUNCH_TYPES: LaunchTypeData[] = [
  {
    name: 'Presale',
    platforms: ['PinkSale', 'GemPad', 'Other'],
  },
  {
    name: 'Fair Launch',
    platforms: ['GemPad', 'PinkSale', 'Pump.fun', 'Manual Listing', 'Other'],
  },
];

// Categories
export const CATEGORIES = ['Utility', 'Meme', 'Other'];

// Helper Functions

// Get chain icon by name
export const getChainIcon = (chainName: string): string => {
  const chain = CHAINS.find((c) => c.name === chainName);
  return chain ? chain.icon : '/assets/icons/default_chain.svg';
};

// Get platform icon by name
export const getPlatformIcon = (platformName: string): string => {
  const platform = PLATFORMS.find((p) => p.name === platformName);
  return platform ? platform.icon : '/assets/icons/default_platform.svg';
};

// Get DEX icon by name
export const getDexIcon = (dexName: string): string => {
  const dex = DEXES.find((d) => d.name === dexName);
  return dex ? dex.icon : '/assets/icons/default_dex.svg';
};

// Get DEXes for a chain
export const getDexesForChain = (chainName: string): string[] => {
  const relationship = CHAIN_RELATIONSHIPS.find((r) => r.chain === chainName);
  return relationship ? relationship.dexes : [];
};

// Get platforms for a chain
export const getPlatformsForChain = (chainName: string): string[] => {
  const relationship = CHAIN_RELATIONSHIPS.find((r) => r.chain === chainName);
  return relationship ? relationship.platforms : [];
};

// Get platforms for a chain and launch type
export const getPlatformsForChainAndLaunchType = (
  chainName: string,
  launchTypeName: string
): string[] => {
  const platformsForChain = getPlatformsForChain(chainName);
  const launchType = LAUNCH_TYPES.find((type) => type.name === launchTypeName);

  if (!platformsForChain || !launchType) return [];
  return platformsForChain.filter((platform) =>
    launchType.platforms.includes(platform)
  );
};
