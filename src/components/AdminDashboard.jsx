import { useEffect, useMemo, useState } from 'react'
import RevealOnScroll from './RevealOnScroll'

const emptyForm = {
  title: '',
  description: '',
  dueDate: '',
  driveLink: '',
}

function AdminDashboard({
  admin,
  students,
  assignments,
  submissions,
  onCreateAssignment,
  onDeleteAssignment,
  onResetDemoData,
  onAddStudent,
}) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [newStudentName, setNewStudentName] = useState('')
  const [studentMessage, setStudentMessage] = useState('')
  const [selectedStudentIds, setSelectedStudentIds] = useState(students.map((student) => student.id))

  useEffect(() => {
    setSelectedStudentIds(students.map((student) => student.id))
  }, [students])

  const ownAssignments = useMemo(
    () => assignments.filter((assignment) => assignment.createdBy === admin.id),
    [assignments, admin.id],
  )

  const studentProgress = useMemo(
    () =>
      students.map((student) => {
        const assigned = ownAssignments.filter((assignment) => assignment.assignedTo.includes(student.id))
        const submitted = assigned.filter(
          (assignment) => submissions[`${assignment.id}_${student.id}`],
        ).length
        return {
          ...student,
          assignedCount: assigned.length,
          submittedCount: submitted,
          progress: assigned.length ? Math.round((submitted / assigned.length) * 100) : 0,
        }
      }),
    [students, ownAssignments, submissions],
  )

  const submitForm = (e) => {
    e.preventDefault()
    const title = form.title.trim()
    const description = form.description.trim()
    const dueDate = form.dueDate.trim()
    const driveLinkRaw = form.driveLink.trim()

    if (!title || !description || !dueDate || !driveLinkRaw) {
      setSuccess('')
      setError('Please fill all fields before creating an assignment.')
      return
    }

    let driveLink = driveLinkRaw
    if (!/^https?:\/\//i.test(driveLink)) {
      driveLink = `https://${driveLink}`
    }

    try {
      new URL(driveLink)
    } catch {
      setSuccess('')
      setError('Please provide a valid Drive link URL.')
      return
    }

    onCreateAssignment({
      title,
      description,
      dueDate,
      driveLink,
      assignedTo: selectedStudentIds,
    })
    setError('')
    setSuccess('Assignment created successfully.')
    setForm(emptyForm)
  }

  const toggleStudent = (studentId) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId],
    )
  }

  const addStudent = () => {
    const name = newStudentName.trim()
    if (!name) {
      setStudentMessage('Enter a name to add a student.')
      return
    }
    onAddStudent(name)
    setStudentMessage(`${name} added successfully.`)
    setNewStudentName('')
  }

  return (
    <section className="space-y-6">
      <RevealOnScroll>
        <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <div className="rounded-3xl border border-fuchsia-400/25 bg-gradient-to-br from-fuchsia-500/20 via-slate-900 to-slate-950 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-200">Control Deck</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{admin.name}&apos;s Admin Hub</h2>
          <p className="mt-1 text-slate-300">
            Build assignments, target students, and track submission signals in one place.
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
          <p className="text-sm text-slate-300">Students in class</p>
          <p className="text-3xl font-bold text-white">{students.length}</p>
          <button
            type="button"
            onClick={onResetDemoData}
            className="mt-4 rounded-xl border border-indigo-300/30 bg-indigo-400/10 px-3 py-2 text-sm font-medium text-indigo-200 hover:bg-indigo-400/20"
          >
            Restore demo dataset
          </button>
        </div>
        </div>
      </RevealOnScroll>

      <RevealOnScroll>
        <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-slate-900/75 p-5">
          <h3 className="mb-3 text-lg font-semibold text-white">Create assignment</h3>
          <form onSubmit={submitForm} className="grid gap-3 md:grid-cols-2">
            <input
              value={form.title}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, title: e.target.value }))
                if (error) setError('')
              }}
              placeholder="Assignment title"
              required
              className="rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500"
            />
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, dueDate: e.target.value }))
                if (error) setError('')
              }}
              required
              className="rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500"
            />
            <input
              value={form.driveLink}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, driveLink: e.target.value }))
                if (error) setError('')
              }}
              placeholder="Google Drive submission link"
              required
              className="rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500 md:col-span-2"
            />
            <textarea
              value={form.description}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, description: e.target.value }))
                if (error) setError('')
              }}
              placeholder="Description"
              rows={3}
              required
              className="rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500 md:col-span-2"
            />
            <div className="md:col-span-2">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-200">Assign to students</p>
                <button
                  type="button"
                  onClick={() => setSelectedStudentIds(students.map((student) => student.id))}
                  className="text-xs text-indigo-300 hover:text-indigo-200"
                >
                  Select all
                </button>
              </div>
              <div className="grid max-h-44 grid-cols-2 gap-2 overflow-auto rounded-xl border border-slate-700 bg-slate-950/70 p-2">
                {students.map((student) => (
                  <label
                    key={student.id}
                    className="flex items-center gap-2 rounded-lg border border-slate-700/70 bg-slate-900/70 px-2 py-1 text-sm text-slate-200"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStudentIds.includes(student.id)}
                      onChange={() => toggleStudent(student.id)}
                      className="accent-indigo-500"
                    />
                    {student.name}
                  </label>
                ))}
              </div>
            </div>
            {error && <p className="md:col-span-2 text-sm text-rose-300">{error}</p>}
            {success && <p className="md:col-span-2 text-sm text-emerald-300">{success}</p>}
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 md:w-fit"
            >
              Create assignment
            </button>
          </form>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/75 p-5">
          <h3 className="mb-3 text-lg font-semibold text-white">Student management</h3>
          <div className="flex gap-2">
            <input
              value={newStudentName}
              onChange={(e) => {
                setNewStudentName(e.target.value)
                if (studentMessage) setStudentMessage('')
              }}
              placeholder="New student name"
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={addStudent}
              className="rounded-xl bg-fuchsia-600 px-3 py-2 text-sm font-semibold text-white hover:bg-fuchsia-500"
            >
              Add
            </button>
          </div>
          {studentMessage && <p className="mt-2 text-sm text-emerald-300">{studentMessage}</p>}
          <div className="mt-4 grid max-h-72 grid-cols-2 gap-2 overflow-auto">
            {students.map((student) => (
              <div key={student.id} className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-sm">
                <p className="font-medium text-slate-100">{student.name}</p>
                <p className="text-xs text-slate-400">{student.id}</p>
              </div>
            ))}
          </div>
        </div>
        </div>
      </RevealOnScroll>

      <RevealOnScroll>
        <div className="rounded-3xl border border-white/10 bg-slate-900/75 p-5">
        <h2 className="mb-3 text-lg font-semibold text-white">Manage assignments</h2>
        <div className="space-y-3">
          {ownAssignments.map((assignment) => (
            <article
              key={assignment.id}
              className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 transition hover:border-indigo-400/40"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-semibold text-slate-100">{assignment.title}</h3>
                  <p className="text-sm text-slate-300">{assignment.description}</p>
                  <p className="mt-1 text-xs text-slate-400">Due: {assignment.dueDate}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Assigned to: {assignment.assignedTo.length} students
                  </p>
                  <a
                    href={assignment.driveLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-indigo-300 hover:text-indigo-200"
                  >
                    Drive link
                  </a>
                </div>
                <button
                  onClick={() => onDeleteAssignment(assignment.id)}
                  className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm font-medium text-rose-300 hover:bg-rose-500/20"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
          {ownAssignments.length === 0 && (
            <p className="text-sm text-slate-400">No assignments created yet.</p>
          )}
        </div>
        </div>
      </RevealOnScroll>

      <RevealOnScroll>
        <div className="rounded-3xl border border-white/10 bg-slate-900/75 p-5">
        <h2 className="mb-3 text-lg font-semibold text-white">Submission overview</h2>
        <div className="space-y-3">
          {studentProgress.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/40 p-3"
            >
              <p className="text-sm font-medium text-slate-200">{student.name}</p>
              <div className="flex items-center gap-2">
                <span className="rounded-lg border border-indigo-400/30 bg-indigo-500/10 px-2 py-1 text-xs text-indigo-200">
                  Assigned: {student.assignedCount}
                </span>
                <span className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-200">
                  Submitted: {student.submittedCount}
                </span>
              </div>
            </div>
          ))}
        </div>
        </div>
      </RevealOnScroll>
    </section>
  )
}

export default AdminDashboard
