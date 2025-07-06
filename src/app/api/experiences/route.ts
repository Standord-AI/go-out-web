import { NextRequest, NextResponse } from 'next/server';
import { SETTINGS } from '@/core/config/common.settings';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pageIndex, pageSize, sortField, sortOrder, filters } = body;

    // Forward the request to your existing backend API
    const response = await fetch(`${SETTINGS.CMS_API}/experiences/get-paged`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pageIndex,
        pageSize,
        sortField,
        sortOrder,
        filters,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in experiences API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experiences' },
      { status: 500 }
    );
  }
} 