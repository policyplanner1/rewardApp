import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock data - replace with actual database queries
    const stats = {
      totalVendors: 45,
      pendingApprovals: 8,
      activeProducts: 234,
      totalRevenue: 125000
    };

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}