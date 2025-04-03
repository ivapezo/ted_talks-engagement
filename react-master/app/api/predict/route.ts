import { NextResponse } from 'next/server';

// Get the API URL from environment variables, with fallbacks for different environments
const API_URL = process.env.NEXT_PUBLIC_API_URL || 
                (process.env.NODE_ENV === 'production' 
                  ? 'https://ted-talks-engagement-backend.vercel.app'
                  : 'http://localhost:5000');

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { videoUrl } = body;

    if (!videoUrl) {
      return NextResponse.json(
        { error: 'Missing videoUrl in request' },
        { status: 400 }
      );
    }

    // Validate YouTube URL format
    const youtubeRegex = /(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?]+)/;
    if (!youtubeRegex.test(videoUrl)) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    console.log(`Forwarding request to ${API_URL}/predict with videoUrl: ${videoUrl}`);

    // Forward the request to the Flask backend
    const response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ videoUrl }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend error: ${response.status} - ${errorText}`);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process request' },
      { status: 500 }
    );
  }
} 