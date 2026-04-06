export const initialUsers = [
  { id: 'admin-1', name: 'Prof. Rajashekar', role: 'admin' },
  { id: 'student-1', name: 'Aarav', role: 'student' },
  { id: 'student-2', name: 'Manya', role: 'student' },
  { id: 'student-3', name: 'Ishaan', role: 'student' },
  { id: 'student-4', name: 'Riya', role: 'student' },
  { id: 'student-5', name: 'Devansh', role: 'student' },
  { id: 'student-6', name: 'Ananya', role: 'student' },
  { id: 'student-7', name: 'Kabir', role: 'student' },
  { id: 'student-8', name: 'Neha', role: 'student' },
  { id: 'student-9', name: 'Vihaan', role: 'student' },
  { id: 'student-10', name: 'Saanvi', role: 'student' },
]

export const initialAssignments = [
  {
    id: 'asg-1',
    title: 'React Component Patterns',
    description: 'Build reusable card and modal components.',
    dueDate: '2026-04-10',
    driveLink: 'https://drive.google.com/example-link-1',
    createdBy: 'admin-1',
    assignedTo: ['student-1', 'student-2', 'student-3', 'student-4', 'student-5'],
  },
  {
    id: 'asg-2',
    title: 'Tailwind Responsive Layout',
    description: 'Create a mobile-first dashboard layout.',
    dueDate: '2026-04-15',
    driveLink: 'https://drive.google.com/example-link-2',
    createdBy: 'admin-1',
    assignedTo: ['student-2', 'student-6', 'student-7', 'student-8'],
  },
]

export const initialSubmissions = {
  'asg-1_student-1': true,
  'asg-1_student-2': false,
  'asg-1_student-3': true,
  'asg-1_student-4': false,
  'asg-1_student-5': true,
  'asg-2_student-1': false,
  'asg-2_student-2': true,
  'asg-2_student-6': false,
  'asg-2_student-7': true,
  'asg-2_student-8': false,
}
