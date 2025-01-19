// Define the structure of the rates object
export interface Rates {
  [key: string]: number; // Dynamic keys with numeric values
}

// Define the structure of the API response
export interface CoinLayerResponse {
  success: boolean;
  terms: string;
  privacy: string;
  timestamp: number;
  target: string;
  rates: Rates; // Use the Rates interface for the rates property
}
