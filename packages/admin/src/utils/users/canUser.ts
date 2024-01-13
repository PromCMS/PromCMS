import { UserRole } from '@prom-cms/api-client';
import { SecurityOptionOptions } from '@prom-cms/schema';

type ActionType = 'create' | 'read' | 'update' | 'delete';

export interface CanUserOptions<T = ActionType | ActionType[]> {
  userRole: UserRole;
  action: T;
  targetEntityTableName: string;
}

export function canUser<T extends ActionType | ActionType[]>({
  userRole,
  action,
  targetEntityTableName,
}: CanUserOptions<T>) {
  const accessPermissionValue = (key: string): boolean => {
    return (
      (userRole.permissions.entities?.[targetEntityTableName]?.[key] ??
        SecurityOptionOptions.DISABLED) !== SecurityOptionOptions.DISABLED
    );
  };

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
