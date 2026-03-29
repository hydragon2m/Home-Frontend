import { AbilityBuilder, createMongoAbility } from '@casl/ability'

export type Action = 'manage' | 'create' | 'read' | 'update' | 'delete'
export type Subject = 'Organization' | 'User' | 'Finance' | 'Task' | 'all'

export const createAppAbility = (role: string) => {
  const { can, build } = new AbilityBuilder(createMongoAbility)

  if (role === 'ORG_ADMIN') {
    can('manage', 'all')
  } else {
    can('read', 'all')
    can('create', 'Task')
    can('create', 'Finance')
  }

  return build()
}
