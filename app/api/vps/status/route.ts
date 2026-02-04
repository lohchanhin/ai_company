import { NextResponse } from 'next/server';
import { getMonitorInstance } from '@/lib/vps-monitor';
import { DEFAULT_VPS_CONFIG } from '@/lib/vps-monitor/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const monitor = getMonitorInstance();
    const statuses = await monitor.getMultipleStatus(DEFAULT_VPS_CONFIG);

    return NextResponse.json({
      success: true,
      data: statuses,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
