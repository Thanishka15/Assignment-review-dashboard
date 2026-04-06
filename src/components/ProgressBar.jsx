function ProgressBar({ value, label }) {
  return (
    <div className="w-full">
      <div className="mb-1 flex justify-between text-xs text-slate-400">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-700/60">
        <div
          className="h-2 rounded-full bg-indigo-500 transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
