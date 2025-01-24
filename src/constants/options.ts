// Define the structure for chain data
type ChainData = {
    name: string;
    icon: string;
    dexes: string[]; // List of related DEXes
    platforms: string[]; // List of related platforms
  };
  
  // Define the structure for launch type relationships
  type LaunchTypeData = {
    name: string;
    platforms: string[]; // Platforms allowed for this launch type
  };
  
  // Chains data
  export const CHAINS: ChainData[] = [
    {
      name: 'Ethereum',
      icon: '/assets/icons/ethereum.svg',
      dexes: ['Uniswap V2', 'Uniswap V3', 'SushiSwap', 'PancakeSwap', 'Other'],
      platforms: ['GemPad', 'PinkSale', 'Manual Listing', 'Other'],
    },
    {
      name: 'BSC Smart Chain',
      icon: '/assets/icons/bsc.svg',
      dexes: ['PancakeSwap', 'PancakeSwap V3', 'Other'],
      platforms: ['GemPad', 'PinkSale', 'Manual Listing', 'Other'],
    },
    {
      name: 'Solana',
      icon: '/assets/icons/solana.svg',
      dexes: ['Raydium', 'Other'],
      platforms: ['GemPad', 'Pump.fun', 'Manual Listing','PinkSale', 'Other'],
    },
    {
      name: 'Base',
      icon: '/assets/icons/base.svg',
      dexes: ['Uniswap V2', 'Uniswap V3', 'Other'],
      platforms: ['PinkSale', 'Manual Listing', 'Other'],
    },
    {
      name: 'Sui',
      icon: '/assets/icons/sui.svg',
      dexes: ['Cetus', 'Other'],
      platforms: ['PinkSale', 'Manual Listing', 'Other'],
    },
    {
      name: 'XRP Ledger',
      icon: '/assets/icons/xrpl.svg',
      dexes: ['Other'],
      platforms: ['PinkSale', 'Manual Listing', 'Other'],
    },
    {
      name: 'AVAX',
      icon: '/assets/icons/avax.svg',
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
  
  // Helper functions
  export const getChainByName = (name: string): ChainData | undefined =>
    CHAINS.find((chain) => chain.name === name);
  
  export const getDexesForChain = (chainName: string): string[] => {
    const chain = getChainByName(chainName);
    return chain ? chain.dexes : [];
  };
  
  export const getPlatformsForChainAndLaunchType = (
    chainName: string,
    launchTypeName: string
  ): string[] => {
    const chain = getChainByName(chainName);
    const launchType = LAUNCH_TYPES.find((type) => type.name === launchTypeName);
  
    if (!chain || !launchType) return [];
    return chain.platforms.filter((platform) => launchType.platforms.includes(platform));
  };
  