import { UserRole } from '@prom-cms/api-client';

export const isAdminRole = (role: UserRole) => role.id === 'admin';
