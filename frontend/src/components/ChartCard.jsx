import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function ChartCard({
  title,
  subtitle,
  type = "line",
  data,
  options,
  height = 260,
}) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mergedOptions = {
      responsive: true,
      maintainAspectRatio: false,
      ...(options || {}),
    };

    if (!chartRef.current) {
      chartRef.current = new Chart(canvas, {
        type,
        data,
        options: mergedOptions,
      });
    } else {
      const chart = chartRef.current;

      if (chart.config.type !== type) {
        chart.destroy();
        chartRef.current = new Chart(canvas, { type, data, options: mergedOptions });
      } else {
        chart.data = data;
        chart.options = mergedOptions;
        chart.update();
      }
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [type, data, options]);

  return (
    <div className="card chart-card">
      <div className="chart-head">
        <div>
          <div className="chart-title">{title}</div>
          {subtitle ? <div className="muted">{subtitle}</div> : null}
        </div>
      </div>

      <div className="chart-canvas-wrap" style={{ height }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}