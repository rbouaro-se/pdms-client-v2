export type TAccountType = "Individual" | "Business" | "Client" |"Admin";
export type TAccountProvider = "Local" | "Google" | "Apple";
export type TAccount = {
	_id: string;
	email: string;
	password?: string;
	provider: TAccountProvider;
	phone: string;
	emailVerified: boolean;
	phoneVerified: boolean;
	isActive: boolean;
	mustChangePassword: boolean;
	createdAt: Date;
	updatedAt: Date;
} & (TBusinessAccount | TIndividualAccount | TClientAccount);

export type TUserAccount = {
	id: number;
	username: string;
	type: TAccountType;
	provider: TAccountProvider;
	emailVerified: boolean;
	phoneVerified: boolean;
	isActive: boolean;
	mustChangePassword: boolean;
	canResetPassword: boolean;
	mustOnboardWithStripe: boolean;
	createdAt: Date;
	updatedAt: Date;
}; 

export interface IGoogleAuthResponse {
	hasRegisteredWithGoogle: boolean;
	hasLocalAccount: boolean;
	googleToken: string;
	email: string;
	surname: string;
	othernames: string;
	picture: string;
}
export interface IPayloadBuilder {
	provider: TAccountProvider;
	picture: string; // Allow for different providers
	surname: string;
	othernames: string;
	businessName?: string; // Optional for non-business accounts
	email: string;
	password?: string; // Optional for non-local accounts
	confirmPassword?: string; // Optional for non-local accounts
	latitude: number; // Sample latitude for New York City
	longitude: number;
	type: TAccountType;
	phone: string;
	googleToken?: string; // Optional for non-Google accounts
}

export interface UserRegistration {
	username: string;
	password?: string; 
	confirmPassword?: string;
	picture: string;
	type: TAccountType;
	provider: TAccountProvider;
	googleToken?: string;
	packer?: PackerInfo;
	client?: ClientInfo;
}

export interface PackerInfo {
	surname: string;
	othernames: string;
	businessName?: string;
	businessLocation?: string;
	businessWebsite?: string;
	email: string;
	phone: string;
	latitude: number;
	longitude: number;
}

export interface ClientInfo {
	surname: string;
	othernames: string;
	email: string;
	phone: string;
	latitude: number;
	longitude: number;
}

export type TBusinessAccount = {
	type: "Business";
	businessName: string;
	location: {
		type: "Point";
		coordinates: number[];
	};
	preferences: {
		hourlyRate: number;
	};
	description: string;
	website: string;
};
export type TIndividualAccount = {
	type: "Individual";
	surname: string;
	othernames: string;
	location: {
		type: 'Point';
		coordinates: number[];
	};
	preferences: {
		hourlyRate: number;
	};
};
type TClientAccount = {
	type: "Client";
	location: string;
	surname: string;
	othernames: string;
};

type TNewLocalAccount = {
	provider: "Local";
	password: string;
	confirmPassword: string;
	picture?: string;
	phone: string;
	email: string;
} & (TNewBusinessAccount | TNewIndividualOrClientAccount);

type TNewGoogleAccount = {
	provider: "Google";
	phone: string;
	googleToken: string;
} & (TNewBusinessAccount | TNewIndividualOrClientAccount);

type TNewAppleAccount = {
	provider: "Apple";
	phone: string;
	appleToken: string;
} & (TNewBusinessAccount | TNewIndividualOrClientAccount);

type TNewBusinessAccount = {
	type: "Business";
	businessName: string;
	location: {
		coordinates: [number, number];
	};
};

type TNewIndividualOrClientAccount = {
	type: "Client" | "Individual";
	surname: string;
	othernames: string;
	location: {
		coordinates: [number, number];
	};
};

export type TNewAccount =
	| TNewLocalAccount
	| TNewGoogleAccount
	| TNewAppleAccount;
