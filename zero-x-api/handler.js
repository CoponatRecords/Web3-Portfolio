exports.handler = async (event) => {
  const params = event.queryStringParameters || {};
  const { sellToken, buyToken, sellAmount, takerAddress } = params;

  if (!sellToken || !buyToken || !sellAmount || !takerAddress) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing required query parameters." }),
    };
  }

  const url = `https://api.0x.org/swap/permit2/quote?chainId=42161&sellToken=${sellToken}&buyToken=${buyToken}&sellAmount=${sellAmount}&taker=${takerAddress}`;

  try {
    const axios = require("axios");

    const response = await axios.get(url, {
      headers: {
        "0x-api-key": process.env.ZERO_X_API_KEY,
        "0x-version": "v2",
      },
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
