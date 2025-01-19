export type ApiResponse = {
  page: number;
  cursor: string;
  pairAddress: string;
  tokenAddress: string;
  timeframe: string;
  currency: string;
  result: TradeData[];
};

export type TradeData = {
  timestamp: string; // ISO 8601 format
  open: number; // Opening price
  high: number; // Highest price
  low: number; // Lowest price
  close: number; // Closing price
  volume: number; // Trading volume
  trades: number; // Number of trades
};
