import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import StudentDashboard from './components/StudentDashboard'
import AdminDashboard from './components/AdminDashboard'
import {
  bootstrapStorage,
  getAssignments,
  getCurrentUser,
  getSubmissions,
  getUsers,
  resetDemoData,
  setAssignments,
  setCurrentUser,
  setSubmissions,
  setUsers as setUsersInStorage,
} from './utils/storage'

function App() {
  const [users, setUsers] = useState([])
  const [assignments, setAssignmentsState] = useState([])
  const [submissions, setSubmissionsState] = useState({})
  const [currentUser, setCurrentUserState] = useState(null)

  useEffect(() => {
    bootstrapStorage()
    setUsers(getUsers())
    setAssignmentsState(getAssignments())
    setSubmissionsState(getSubmissions())
    setCurrentUserState(getCurrentUser())
  }, [])

  const students = useMemo(() => users.filter((user) => user.role === 'student'), [users])

  if (!currentUser) return null

  const handleUserChange = (userId) => {
    const next = users.find((user) => user.id === userId)
    if (!next) return
    setCurrentUserState(next)
    setCurrentUser(next)
  }

  const handleConfirmSubmission = (assignmentId, studentId) => {
    const updated = {
      ...submissions,
      [`${assignmentId}_${studentId}`]: true,
    }
    setSubmissionsState(updated)
    setSubmissions(updated)
  }

  const handleUnsubmitAssignment = (assignmentId, studentId) => {
    const updated = {
      ...submissions,
      [`${assignmentId}_${studentId}`]: false,
    }
    setSubmissionsState(updated)
    setSubmissions(updated)
  }

  const handleResetStudentSubmissions = (studentId) => {
    const updated = { ...submissions }
    assignments
      .filter((assignment) => assignment.assignedTo.includes(studentId))
      .forEach((assignment) => {
        updated[`${assignment.id}_${studentId}`] = false
      })
    setSubmissionsState(updated)
    setSubmissions(updated)
  }

  const handleCreateAssignment = (form) => {
    const targetStudents =
      form.assignedTo && form.assignedTo.length > 0
        ? form.assignedTo
        : students.map((student) => student.id)

    const newAssignment = {
      id: `asg-${Date.now()}`,
      title: form.title.trim(),
      description: form.description.trim(),
      dueDate: form.dueDate,
      driveLink: form.driveLink.trim(),
      createdBy: currentUser.id,
      assignedTo: targetStudents,
    }
    const updatedAssignments = [newAssignment, ...assignments]
    setAssignmentsState(updatedAssignments)
    setAssignments(updatedAssignments)
  }

  const handleAddStudent = (name) => {
    const existingIds = users
      .filter((user) => user.role === 'student')
      .map((student) => Number(student.id.split('-')[1] ?? 0))
    const nextIndex = (Math.max(0, ...existingIds) || 0) + 1
    const student = {
      id: `student-${nextIndex}`,
      name: name.trim(),
      role: 'student',
    }
    const updatedUsers = [...users, student]
    setUsers(updatedUsers)
    setUsersInStorage(updatedUsers)
  }

  const handleDeleteAssignment = (assignmentId) => {
    const updatedAssignments = assignments.filter((assignment) => assignment.id !== assignmentId)
    const updatedSubmissions = { ...submissions }

    Object.keys(updatedSubmissions).forEach((key) => {
      if (key.startsWith(`${assignmentId}_`)) {
        delete updatedSubmissions[key]
      }
    })

    setAssignmentsState(updatedAssignments)
    setSubmissionsState(updatedSubmissions)
    setAssignments(updatedAssignments)
    setSubmissions(updatedSubmissions)
  }

  const handleResetDemoData = () => {
    resetDemoData(currentUser)
    setUsers(getUsers())
    setAssignmentsState(getAssignments())
    setSubmissionsState(getSubmissions())
    setCurrentUserState(getCurrentUser())
  }

  return (
    <div className="min-h-screen text-slate-100">
      <Header
        users={users}
        currentUser={currentUser}
        onUserChange={handleUserChange}
        onResetDemoData={handleResetDemoData}
      />
      <main className="mx-auto w-full max-w-7xl px-4 py-6">
        <div className="relative mb-6 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 p-5 text-sm">
          <div className="pointer-events-none absolute -top-16 right-0 h-32 w-32 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-14 left-10 h-28 w-28 rounded-full bg-fuchsia-500/15 blur-3xl" />
          <p className="relative text-slate-200">
            <span className="font-semibold">Current role:</span> {currentUser.role}
          </p>
          <p className="relative mt-1 text-slate-400">
            Data is persisted in <code>localStorage</code>, so submissions and assignments remain after refresh.
          </p>
        </div>

        {currentUser.role === 'student' ? (
          <StudentDashboard
            student={currentUser}
            assignments={assignments}
            submissions={submissions}
            onConfirmSubmission={handleConfirmSubmission}
            onUnsubmitAssignment={handleUnsubmitAssignment}
            onResetStudentSubmissions={handleResetStudentSubmissions}
          />
        ) : (
          <AdminDashboard
            admin={currentUser}
            students={students}
            assignments={assignments}
            submissions={submissions}
            onCreateAssignment={handleCreateAssignment}
            onDeleteAssignment={handleDeleteAssignment}
            onResetDemoData={handleResetDemoData}
            onAddStudent={handleAddStudent}
          />
        )}
      </main>
    </div>
  )
}

export default App
