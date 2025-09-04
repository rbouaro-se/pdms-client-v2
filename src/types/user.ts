
type Location = {
	longitude: number;
	latitude: number;
	description: string | null;
};

type Contact = {
	phoneNumber: string;
	email: string;
};

type Branch = {
	branchId: string;
	name: string;
	location: Location;
	contact: Contact;
};

export type SystemUser = {
	type: "system";
	id: string;
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	role: UserRole;
	status: UserStatus;
  branch: Branch;
  createdAt: string;
  updatedAt: string;
};

export type Customer = {
  type: 'customer'
  id: string
  name: string
  phoneNumber: string
  email?:string
  createdAt: string
}

export interface SystemUserRegistrationRequest {
  email: string
  username: string
  firstName: string
  lastName: string
  role: UserRole
  branchId: string
}

export interface SystemUserUpdateRequest {
  username?: string
  firstName?: string
  lastName?: string
  email?:string
  role?: UserRole
  status?: UserStatus
  branchId?: string
}

export interface UserFetchOptions {
  roles?: UserRole[]
  status?: UserStatus
  branchId?: string
}
export interface BranchResponse {
  branchId: string
  name: string
  location: LocationDTO
  contact: ContactDTO
}

export interface LocationDTO {
  longitude: number
  latitude: number
  description: string
}

export interface ContactDTO {
  phoneNumber: string
  email: string
}

export interface Agent {
  firstName: string
  lastName: string
}


export type AppUser = SystemUser | Customer;

type UserStatus = "active" | "inactive" | "suspended" | "deleted";

export type UserRole = "admin" | "agent" | "branch_manager" | "customer_service";