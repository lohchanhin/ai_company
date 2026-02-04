'use client';

import { useState, useEffect, useCallback } from 'react';
import { VPSStatus } from '@/lib/vps-monitor/types';

interface UseVPSMonitorOptions {
  pollInterval?: number; // 毫秒
  enabled?: boolean;
}

export function useVPSMonitor(options: UseVPSMonitorOptions = {}) {
  const { pollInterval = 5000, enabled = true } = options;
  
  const [statuses, setStatuses] = useState<VPSStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number>(0);

  const fetchStatuses = useCallback(async () => {
    try {
      const response = await fetch('/api/vps/status');
      const data = await response.json();

      if (data.success) {
        setStatuses(data.data);
        setLastUpdate(data.timestamp);
        setError(null);
      } else {
        setError(data.error || 'Unknown error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // 初始載入
    fetchStatuses();

    // 定期輪詢
    const interval = setInterval(fetchStatuses, pollInterval);

    return () => clearInterval(interval);
  }, [enabled, pollInterval, fetchStatuses]);

  return {
    statuses,
    loading,
    error,
    lastUpdate,
    refresh: fetchStatuses
  };
}
