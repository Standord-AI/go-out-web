import { NextRequest, NextResponse } from 'next/server';
import { SETTINGS } from '@/core/config/common.settings';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Forward the request to your existing backend API
    const response = await fetch(`${SETTINGS.CMS_API}/experiences/${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in experience details API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experience details' },
      { status: 500 }
    );
  }
} 