import { initialAssignments, initialSubmissions, initialUsers } from '../data/mockData'

const STORAGE_KEYS = {
  users: 'dashboard_users',
  assignments: 'dashboard_assignments',
  submissions: 'dashboard_submissions',
  currentUser: 'dashboard_current_user',
}

const read = (key, fallback) => {
  const raw = localStorage.getItem(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

const write = (key, value) => localStorage.setItem(key, JSON.stringify(value))

export const bootstrapStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.users)) write(STORAGE_KEYS.users, initialUsers)
  if (!localStorage.getItem(STORAGE_KEYS.assignments)) write(STORAGE_KEYS.assignments, initialAssignments)
  if (!localStorage.getItem(STORAGE_KEYS.submissions)) write(STORAGE_KEYS.submissions, initialSubmissions)
  if (!localStorage.getItem(STORAGE_KEYS.currentUser)) {
    write(STORAGE_KEYS.currentUser, initialUsers[1])
  }
}

export const getUsers = () => read(STORAGE_KEYS.users, initialUsers)
export const getAssignments = () => read(STORAGE_KEYS.assignments, initialAssignments)
export const getSubmissions = () => read(STORAGE_KEYS.submissions, initialSubmissions)
export const getCurrentUser = () => read(STORAGE_KEYS.currentUser, initialUsers[1])

export const setAssignments = (assignments) => write(STORAGE_KEYS.assignments, assignments)
export const setSubmissions = (submissions) => write(STORAGE_KEYS.submissions, submissions)
export const setCurrentUser = (user) => write(STORAGE_KEYS.currentUser, user)
export const setUsers = (users) => write(STORAGE_KEYS.users, users)

export const resetDemoData = (currentUserOverride) => {
  write(STORAGE_KEYS.users, initialUsers)
  write(STORAGE_KEYS.assignments, initialAssignments)
  write(STORAGE_KEYS.submissions, initialSubmissions)
  write(STORAGE_KEYS.currentUser, currentUserOverride ?? initialUsers[1])
}
