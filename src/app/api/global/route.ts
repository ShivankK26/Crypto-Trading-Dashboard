import { NextRequest, NextResponse } from 'next/server';

const COINGECKO_API_URL = process.env.NEXT_PUBLIC_COINGECKO_API_URL || 'https://api.coingecko.com/api/v3';
const API_KEY = process.env.COINGECKO_API_KEY;

export async function GET(request: NextRequest) {
  try {
    const coingeckoUrl = `${COINGECKO_API_URL}/global`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (API_KEY) {
      headers['x-cg-demo-api-key'] = API_KEY;
    }
    
    const response = await fetch(coingeckoUrl, {
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching global data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch global market data' },
      { status: 500 }
    );
  }
}
