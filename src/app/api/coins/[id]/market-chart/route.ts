import { NextRequest, NextResponse } from 'next/server';

const COINGECKO_API_URL = process.env.NEXT_PUBLIC_COINGECKO_API_URL || 'https://api.coingecko.com/api/v3';
const API_KEY = process.env.COINGECKO_API_KEY;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const { id } = params;
    
    // Build the CoinGecko API URL with query parameters
    const coingeckoUrl = new URL(`${COINGECKO_API_URL}/coins/${id}/market_chart`);
    
    // Copy all query parameters from the request to the CoinGecko API
    searchParams.forEach((value, key) => {
      coingeckoUrl.searchParams.append(key, value);
    });
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (API_KEY) {
      headers['x-cg-demo-api-key'] = API_KEY;
    }
    
    const response = await fetch(coingeckoUrl.toString(), {
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching market chart data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market chart data' },
      { status: 500 }
    );
  }
}
