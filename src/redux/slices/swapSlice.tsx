import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the expected structure of the API response from the 0x Swap endpoint
export interface QuoteResponse {
  permit2: {
    eip712: {
      types: {
        PermitTransferFrom: [
          { name: "permitted"; type: "TokenPermissions" },
          { name: "spender"; type: "address" },
          { name: "nonce"; type: "uint256" },
          { name: "deadline"; type: "uint256" }
        ];
        EIP712Domain: [
          { name: "name"; type: "string" },
          { name: "chainId"; type: "uint256" },
          { name: "verifyingContract"; type: "address" }
        ];
        TokenPermissions: [
          { name: "token"; type: "address" },
          { name: "amount"; type: "uint256" }
        ];
      };
      primaryType: "PermitTransferFrom";
      domain: {
        name: string;
        chainId: bigint;
        verifyingContract: `0x${string}`;
      };
      message: {
        permitted: {
          token: `0x${string}`;
          amount: bigint;
        };
        spender: `0x${string}`;
        nonce: bigint;
        deadline: bigint;
      };
    };
  };
  issues: {
    allowance?: {
      spender: `0x${string}` | null;
    };
  };
  transaction: {
    value: bigint;
    to: `0x${string}`;
    gas: bigint;
    gasPrice: bigint;
    data: `0x${string}`;
  };
  price: string; // Estimated price for the swap
  guaranteedPrice: string; // Guaranteed price provided by 0x (within slippage tolerance)
  to: string; // Address of the contract to call
  data: string; // Encoded calldata to be sent with the transaction
  value: string; // ETH value to send with the transaction (if required)
  gas: string; // Estimated gas for the transaction
  sellToken: `0x${string}`; // Address of the token being sold
  buyToken: `0x${string}`; // Address of the token being bought
  allowanceTarget: `0x${string}`; // Address that should be approved to spend tokens
}

// Define the structure of the query parameters to request a swap quote
export interface QuoteParams {
  sellToken: string; // Symbol or address of the token to sell
  buyToken: string; // Symbol or address of the token to buy
  sellAmount: string; // Amount to sell (in base units, e.g., wei)
  takerAddress: string; // Wallet address that will execute the swap
}

// Create the Redux Toolkit API slice for interacting with the 0x Swap API
export const swapApi = createApi({
  reducerPath: "swapApi", // Unique name for this API slice in the Redux store
  baseQuery: fetchBaseQuery({
    baseUrl:
      "https://nanudtow3a.execute-api.us-east-1.amazonaws.com/default/ZeroXSwap", // Base URL for all endpoints in this slice
    prepareHeaders: (headers) => {
      // Since there's no authorization, we don't need to inject an API key or version
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Define a query endpoint to fetch a swap quote from 0x
    getSwapQuote: builder.query<QuoteResponse, QuoteParams>({
      query: ({ sellToken, buyToken, sellAmount, takerAddress }) => ({
        // Construct the query string with the required parameters
        url: `?chainId=42161&sellToken=${sellToken}&buyToken=${buyToken}&sellAmount=${sellAmount}&takerAddress=${takerAddress}`,
        method: "GET", // HTTP method
      }),
    }),
  }),
});

// Export the auto-generated React hook to use the query in components
export const { useGetSwapQuoteQuery, useLazyGetSwapQuoteQuery } = swapApi;
