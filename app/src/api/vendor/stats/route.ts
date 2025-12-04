import { NextResponse } from 'next/server';
// import { query } from '../../../../lib/db';

export async function GET() {
  try {
    // Mock data - replace with actual database queries
    const stats = {
      totalProducts: 12,
      approvedProducts: 8,
      pendingProducts: 4,
      totalSales: 12500
    };

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}