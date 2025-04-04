// Contact interfaces
export interface IContactPerson {
  name: string;
  relationship?: string;
  email?: string;
  phone?: string;
}

export interface IContact {
  _id?: string;
  name: string;
  position?: string;
  organization?: string;
  email?: string;
  phone?: string;
  wikipediaUrl?: string;
  tags?: string[];
  notes?: string;
  contactPerson?: IContactPerson;
  createdAt?: Date;
  updatedAt?: Date;
}

// User and auth interfaces
export enum Role {
  USER = 'user',
  EDITOR = 'editor',
  ADMIN = 'admin',
}

export interface IUser {
  _id?: string;
  email: string;
  name: string;
  roles: Role[];
}

export interface IAuthResponse {
  access_token: string;
  user: IUser;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  email: string;
  password: string;
  name: string;
}

// API response interfaces
export interface IPaginatedResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

// Export constants
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
  },
  USER: {
    BASE: '/users',
    FIND_ONE: '/users/:email',
    CREATE: '/users',
  },
  CONTACTS: {
    BASE: '/contacts',
    EXPORT: '/contacts/export',
    TAGS: '/contacts/tags',
    ORGANIZATIONS: '/contacts/organizations',
  },
};
