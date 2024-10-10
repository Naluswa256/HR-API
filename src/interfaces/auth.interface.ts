
type Role = 'rootAdmin' | 'hrAdmin' | 'employee'; 

interface IUser {
  name: string;
  email: string;
  password: string;
  role: Role;
  isEmailVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

