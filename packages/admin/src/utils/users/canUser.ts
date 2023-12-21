import { UserRole } from '@prom-cms/api-client';

type ActionType = 'create' | 'read' | 'update' | 'delete';

export interface CanUserOptions<T = ActionType | ActionType[]> {
  userRole: UserRole;
  action: T;
  targetModel: string;
}

export function canUser<T extends ActionType | ActionType[]>({
  userRole,
  action,
  targetModel,
}: CanUserOptions<T>) {
  const isAdmin = userRole.id === 0;
  const accessPermissionValue = (key: string): boolean =>
    isAdmin || (userRole.permissions?.models?.[targetModel]?.[key] ?? false);

  if (Array.isArray(action)) {
    return Object.fromEntries(
      action.map((actionKey) => [
        actionKey,
        accessPermissionValue(actionKey.at(0) as string),
      ])
    ) as Record<ActionType, boolean>;
  } else {
    return accessPermissionValue(action.at(0) as string);
  }
}
