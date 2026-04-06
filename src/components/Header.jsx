function Header({ users, currentUser, onUserChange, onResetDemoData }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-lg">
            A
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white sm:text-2xl">Atlas Classroom</h1>
            <p className="text-sm text-slate-400">Assignment cockpit</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2">
          <button
            type="button"
            onClick={onResetDemoData}
            className="rounded-lg border border-indigo-400/30 bg-indigo-500/15 px-3 py-2 text-xs font-semibold text-indigo-200 hover:bg-indigo-500/25"
          >
            Reset local data
          </button>
          <label className="text-sm font-medium text-slate-300" htmlFor="user-switch">
            Logged in as
          </label>
          <select
            id="user-switch"
            value={currentUser.id}
            onChange={(e) => onUserChange(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500"
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  )
}

export default Header
