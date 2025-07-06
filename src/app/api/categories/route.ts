import { NextRequest, NextResponse } from 'next/server';
import { SETTINGS } from '@/core/config/common.settings';

export async function GET(request: NextRequest) {
  try {
    // Forward the request to your existing backend API
    const response = await fetch(`${SETTINGS.CMS_API}/categories/with-experiences`, {
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
    console.error('Error in categories API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
} 