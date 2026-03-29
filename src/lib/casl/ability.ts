import { defineAbility } from '@casl/ability'

export type Action = 'manage' | 'create' | 'read' | 'update' | 'delete'
export type Subject = 'Organization' | 'User' | 'Finance' | 'Task' | 'all'

export const createAppAbility = (role: string) => {
  return defineAbility((can) => {
    if (role === 'ORG_ADMIN') {
      can('manage', 'all')
    } else {
      can('read', 'all')
      // Members can create their own tasks/finance if we add that logic later
      can('create', 'Task')
      can('create', 'Finance')
    }
  })
}
