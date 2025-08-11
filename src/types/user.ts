
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
};

export type Customer = {
  type: 'customer'
  id: string
  name: string
  phoneNumber: string
}

export type AppUser = SystemUser | Customer;

type UserStatus = "active" | "inactive" | "suspended" | "deleted";

export type UserRole = "admin" | "agent" | "branch_manager" | "customer_service";