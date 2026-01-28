export const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)"
];

export const ERC1155_ABI = [
  "function balanceOf(address account, uint256 id) view returns (uint256)"
];

export const MULTICALL_ADDRESS = "0xcA11bde05977b3631167028862bE2a173976CA11";

export const MULTICALL_ABI = [
  "function aggregate(tuple(address target, bytes callData)[] calls) view returns (uint256 blockNumber, bytes[] returnData)",
  "function aggregate3(tuple(address target, bool allowFailure, bytes callData)[] calls) view returns (tuple(bool success, bytes returnData)[] returnData)"
];
