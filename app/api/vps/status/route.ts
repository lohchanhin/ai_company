import { NextResponse } from 'next/server';
import { LocalMetricsCollector } from '@/lib/vps-monitor/local-metrics';
import { DEFAULT_VPS_CONFIG, determineStatus, VPSStatus } from '@/lib/vps-monitor/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const collector = new LocalMetricsCollector();
    const metrics = await collector.getAllMetrics();

    const statuses: VPSStatus[] = DEFAULT_VPS_CONFIG.map(vps => {
      const status = determineStatus(metrics, vps.thresholds);
      return {
        id: vps.id,
        status,
        metrics,
        lastUpdate: Date.now()
      };
    });

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
