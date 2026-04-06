import { useMemo, useState } from 'react'
import ProgressBar from './ProgressBar'

function StudentDashboard({
  student,
  assignments,
  submissions,
  onConfirmSubmission,
  onUnsubmitAssignment,
  onResetStudentSubmissions,
}) {
  const [confirmStepByAssignment, setConfirmStepByAssignment] = useState({})

  const ownAssignments = useMemo(
    () => assignments.filter((assignment) => assignment.assignedTo.includes(student.id)),
    [assignments, student.id],
  )

  const submittedCount = ownAssignments.filter(
    (assignment) => submissions[`${assignment.id}_${student.id}`],
  ).length
  const progress = ownAssignments.length
    ? Math.round((submittedCount / ownAssignments.length) * 100)
    : 0

  const toggleFirstConfirm = (assignmentId) => {
    setConfirmStepByAssignment((prev) => ({
      ...prev,
      [assignmentId]: prev[assignmentId] === 'first' ? null : 'first',
    }))
  }

  const finalizeConfirm = (assignmentId) => {
    onConfirmSubmission(assignmentId, student.id)
    setConfirmStepByAssignment((prev) => ({ ...prev, [assignmentId]: null }))
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-3xl border border-indigo-400/30 bg-gradient-to-br from-indigo-600/20 via-slate-900 to-slate-950 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-200">Student Studio</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Welcome back, {student.name}</h2>
          <p className="mt-1 text-slate-300">Track your tasks and confirm submissions in two steps.</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
          <p className="text-sm text-slate-300">Completion</p>
          <p className="text-3xl font-bold text-white">{progress}%</p>
          <p className="mb-3 text-sm text-slate-400">
            {submittedCount} / {ownAssignments.length} submitted
          </p>
          <ProgressBar value={progress} label="Progress" />
          <button
            type="button"
            onClick={() => onResetStudentSubmissions(student.id)}
            className="mt-3 rounded-xl border border-amber-300/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-200 hover:bg-amber-500/20"
          >
            Reset my submissions
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ownAssignments.map((assignment) => {
          const submissionKey = `${assignment.id}_${student.id}`
          const isSubmitted = Boolean(submissions[submissionKey])
          const isInFirstStep = confirmStepByAssignment[assignment.id] === 'first'

          return (
            <article
              key={assignment.id}
              className="rounded-3xl border border-white/10 bg-slate-900/75 p-4 shadow-lg transition hover:-translate-y-0.5 hover:border-indigo-400/40"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold text-white">{assignment.title}</h3>
                <span
                  className={`rounded-full border px-2 py-1 text-xs font-semibold ${
                    isSubmitted
                      ? 'border-emerald-400/30 bg-emerald-500/15 text-emerald-300'
                      : 'border-amber-300/30 bg-amber-500/10 text-amber-300'
                  }`}
                >
                  {isSubmitted ? 'Submitted' : 'Not submitted'}
                </span>
              </div>
              <p className="mb-3 text-sm text-slate-300">{assignment.description}</p>
              <div className="mb-4 space-y-1 text-sm">
                <p className="text-slate-300">
                  <span className="font-medium">Due:</span> {assignment.dueDate}
                </p>
                <a
                  className="font-medium text-indigo-300 transition hover:text-indigo-200"
                  href={assignment.driveLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open Drive submission link
                </a>
              </div>
              {!isSubmitted && (
                <div className="space-y-2">
                  {!isInFirstStep && (
                    <button
                      onClick={() => toggleFirstConfirm(assignment.id)}
                      className="w-full rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                    >
                      Yes, I have submitted
                    </button>
                  )}
                  {isInFirstStep && (
                    <div className="rounded-xl border border-indigo-300/25 bg-indigo-500/10 p-3">
                      <p className="mb-2 text-sm text-indigo-100">
                        Final check: are you sure you already submitted your work using the Drive link?
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => finalizeConfirm(assignment.id)}
                          className="rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                        >
                          Confirm submission
                        </button>
                        <button
                          onClick={() => toggleFirstConfirm(assignment.id)}
                          className="rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {isSubmitted && (
                <button
                  type="button"
                  onClick={() => onUnsubmitAssignment(assignment.id, student.id)}
                  className="rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
                >
                  Mark as not submitted
                </button>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default StudentDashboard
