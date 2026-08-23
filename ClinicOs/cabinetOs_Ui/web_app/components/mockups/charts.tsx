type Point = { x: number; y: number };

function smoothPath(points: Point[]) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

type AreaChartProps = {
  data: number[];
  labels: string[];
  id?: string;
};

export function AreaChart({ data, labels, id = "medos-area" }: AreaChartProps) {
  const width = 560;
  const height = 200;
  const paddingX = 14;
  const paddingTop = 12;
  const paddingBottom = 26;
  const max = Math.max(...data) * 1.15;
  const stepX = (width - paddingX * 2) / (data.length - 1);
  const points = data.map((value, i) => ({
    x: paddingX + i * stepX,
    y: paddingTop + (1 - value / max) * (height - paddingTop - paddingBottom),
  }));
  const line = smoothPath(points);
  const area = `${line} L ${points[points.length - 1].x} ${
    height - paddingBottom
  } L ${paddingX} ${height - paddingBottom} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label="Évolution hebdomadaire des rendez-vous"
    >
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#19b8c5" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#19b8c5" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((t) => (
        <line
          key={t}
          x1={paddingX}
          x2={width - paddingX}
          y1={paddingTop + t * (height - paddingTop - paddingBottom)}
          y2={paddingTop + t * (height - paddingTop - paddingBottom)}
          stroke="#dcecef"
          strokeWidth="1"
          strokeDasharray="4 6"
        />
      ))}
      <path d={area} fill={`url(#${id}-fill)`} />
      <path
        d={line}
        fill="none"
        stroke="#08a6b5"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {points.map((point, i) => (
        <circle
          key={i}
          cx={point.x}
          cy={point.y}
          r={i === points.length - 1 ? 5 : 3.5}
          fill="#ffffff"
          stroke="#08a6b5"
          strokeWidth="2.5"
        />
      ))}
      {labels.map((label, i) => (
        <text
          key={label}
          x={paddingX + i * stepX}
          y={height - 8}
          textAnchor="middle"
          fontSize="11"
          fill="#667085"
        >
          {label}
        </text>
      ))}
    </svg>
  );
}

type BarChartProps = {
  data: number[];
  labels: string[];
};

export function BarChart({ data, labels }: BarChartProps) {
  const width = 280;
  const height = 160;
  const gap = 10;
  const barWidth = (width - gap * (data.length + 1)) / data.length;
  const max = Math.max(...data);
  const baseline = height - 24;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label="Activité hebdomadaire"
    >
      {data.map((value, i) => {
        const h = (value / max) * (baseline - 12);
        const x = gap + i * (barWidth + gap);
        return (
          <rect
            key={labels[i]}
            x={x}
            y={baseline - h}
            width={barWidth}
            height={h}
            rx={4}
            fill={i === data.length - 1 ? "#08a6b5" : "#c9ecf0"}
          />
        );
      })}
      {labels.map((label, i) => (
        <text
          key={label}
          x={gap + i * (barWidth + gap) + barWidth / 2}
          y={height - 8}
          textAnchor="middle"
          fontSize="10"
          fill="#667085"
        >
          {label}
        </text>
      ))}
    </svg>
  );
}

type DonutChartProps = {
  value: number;
  label: string;
};

export function DonutChart({ value, label }: DonutChartProps) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 100 100" className="h-28 w-28">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#dcecef"
          strokeWidth="11"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#08a6b5"
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
        />
        <text
          x="50"
          y="54"
          textAnchor="middle"
          fontSize="17"
          fontWeight="700"
          fill="#063b5c"
        >
          {value}%
        </text>
      </svg>
      <p className="mt-1 text-xs font-medium text-medos-slate">{label}</p>
    </div>
  );
}
