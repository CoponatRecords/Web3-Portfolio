// handler.js

// Native fetch is available in Node.js 18+, no need to import it
exports.handler = async (event) => {
  // Optional: log incoming request
  console.log("Incoming event:", JSON.stringify(event));

  // Get query params from URL
  const params = event.queryStringParameters || {};
  const { sellToken, buyToken, sellAmount, takerAddress } = params;

  // Basic input validation
  if (!sellToken || !buyToken || !sellAmount || !takerAddress) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error:
          "Missing required query parameters: sellToken, buyToken, sellAmount, takerAddress",
      }),
    };
  }

  // Get your 0x API key from Lambda environment variables
  const apiKey = process.env.ZERO_X_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing ZERO_X_API_KEY in environment" }),
    };
  }

  // Build the 0x Swap API URL
  const url = `https://api.0x.org/swap/permit2/quote?chainId=42161&sellToken=${sellToken}&buyToken=${buyToken}&sellAmount=${sellAmount}&taker=${takerAddress}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "0x-api-key": apiKey,
        "0x-version": "v2",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: errorText }),
      };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // For local frontend testing
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
