"use client";

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

type Props = {
  dailyLabels: string[];
  dailyCounts: number[];
  weeklyLabels: string[];
  weeklyCounts: number[];
  monthlyLabels: string[];
  monthlyCounts: number[];
};

export default function DashboardCharts({ dailyLabels, dailyCounts, weeklyLabels, weeklyCounts, monthlyLabels, monthlyCounts }: Props) {
  const dailyRef = useRef<HTMLCanvasElement | null>(null);
  const weeklyRef = useRef<HTMLCanvasElement | null>(null);
  const monthlyRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let dailyChart: Chart | null = null;
    let weeklyChart: Chart | null = null;
    let monthlyChart: Chart | null = null;

    if (dailyRef.current) {
      dailyChart = new Chart(dailyRef.current, {
        type: 'bar',
        data: {
          labels: dailyLabels,
          datasets: [
            {
              label: 'Appointments',
              data: dailyCounts,
              backgroundColor: 'rgba(107,93,211,0.75)'
            }
          ]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
      });
    }

    if (weeklyRef.current) {
      weeklyChart = new Chart(weeklyRef.current, {
        type: 'line',
        data: {
          labels: weeklyLabels,
          datasets: [
            {
              label: 'Weekly',
              data: weeklyCounts,
              borderColor: 'rgba(107,93,211,0.9)',
              backgroundColor: 'rgba(107,93,211,0.1)',
              tension: 0.3,
              fill: true
            }
          ]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
      });
    }

    if (monthlyRef.current) {
      monthlyChart = new Chart(monthlyRef.current, {
        type: 'line',
        data: {
          labels: monthlyLabels,
          datasets: [
            {
              label: 'Monthly',
              data: monthlyCounts,
              borderColor: 'rgba(34,197,94,0.9)',
              backgroundColor: 'rgba(34,197,94,0.08)',
              tension: 0.25,
              fill: true
            }
          ]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
      });
    }

    return () => {
      dailyChart?.destroy();
      weeklyChart?.destroy();
      monthlyChart?.destroy();
    };
  }, [
    JSON.stringify(dailyLabels),
    JSON.stringify(dailyCounts),
    JSON.stringify(weeklyLabels),
    JSON.stringify(weeklyCounts),
    JSON.stringify(monthlyLabels),
    JSON.stringify(monthlyCounts)
  ]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
      <div style={{ background: '#fff', padding: 12, borderRadius: 8 }}>
        <h3 style={{ margin: '0 0 8px 0' }}>Daily (Last 7 days)</h3>
        <canvas ref={dailyRef} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ background: '#fff', padding: 12, borderRadius: 8 }}>
          <h3 style={{ margin: '0 0 8px 0' }}>Weekly (Last 4 weeks)</h3>
          <canvas ref={weeklyRef} />
        </div>
        <div style={{ background: '#fff', padding: 12, borderRadius: 8 }}>
          <h3 style={{ margin: '0 0 8px 0' }}>Monthly (Last 6 months)</h3>
          <canvas ref={monthlyRef} />
        </div>
      </div>
    </div>
  );
}
