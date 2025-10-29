export function PollutantCard({ name, value, status, concentration, color }) {
  const colorClasses = {
    amber: {
      ring: 'stroke-amber-500',
      text: 'text-amber-500',
      bg: 'text-amber-400',
    },
    emerald: {
      ring: 'stroke-emerald-500',
      text: 'text-emerald-500',
      bg: 'text-emerald-400',
    },
    red: {
      ring: 'stroke-red-500',
      text: 'text-red-500',
      bg: 'text-red-400',
    },
  }
  
  const colors = colorClasses[color]
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (value / 100) * circumference

  return (
    <article className="bg-slate-800 rounded-xl p-6 flex flex-col items-center">
      <h3 className="text-sm text-slate-400 mb-4">{name}</h3>
      <div className="relative w-32 h-32 mb-4">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="45"
            stroke="#334155"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="64"
            cy="64"
            r="45"
            className={colors.ring}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${colors.bg}`}>{value}</span>
          <span className="text-xs text-slate-400">{status}</span>
        </div>
      </div>
      <div className="text-center">
        <p className={`text-lg font-semibold ${colors.text}`}>
          {concentration}
        </p>
        <p className={`text-sm ${colors.text}`}>{status}</p>
      </div>
    </article>
  )
}