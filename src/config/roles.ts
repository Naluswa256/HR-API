// Define types for roles and permissions
type Role = 'rootAdmin' | 'hrAdmin' | 'employee';
export type Permission = 'createAccount' | 'manageEmployees' | 'viewProfile' | 'updateProfile' | 'deleteProfile'| 'manageUsers';

// Define role permissions for the HR management system
const allRoles: Record<Role, Permission[]> = {
  rootAdmin: [],
  hrAdmin: ['createAccount', 'manageEmployees', 'viewProfile', 'updateProfile', 'deleteProfile','manageUsers'],
  employee: ['viewProfile', 'updateProfile'],
};

// Extract roles and map permissions to roles
const roles: Role[] = Object.keys(allRoles) as Role[];
const roleRights = new Map<Role, Permission[]>(Object.entries(allRoles) as [Role, Permission[]][]);


export { roles, roleRights };