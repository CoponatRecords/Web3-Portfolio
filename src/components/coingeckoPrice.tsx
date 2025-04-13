import React, { useEffect, useState } from 'react';


type CryptopriceProps = {
    coin : string;
}

export const CryptoPrice = ({coin} : CryptopriceProps) => {
  
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`, {
          method: 'GET',
          headers: {
            'accept': 'application/json', 
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setPrice(data); // Assuming the API returns a price object
        setLoading(false);
      } catch (err) {
        console.log(err)
        const Err_display = JSON.stringify(err);
        setError(Err_display);
        setLoading(false);
      }
    };

    fetchPrice();
  }, []); // Empty dependency array means this runs once when the component mounts

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Crypto Price:</h1>
      <pre>{JSON.stringify(price, null, 2)}</pre>
    </div>
  );
}; 