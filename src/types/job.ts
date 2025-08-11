export type TJobRequestStatus =
	| "Pending"
	| "Accepted"
	| "Completed"
	| "Rejected"
	| "Cancelled";

export type TJobAcceptanceStatus = "Pending" | "Accepted" | "Rejected";

export type TClientJobRequestsFilter =
	| "All"
	| "Pending"
	| "Accepted"
	| "Completed"
	| "Rejected";

export type TNearbyPackerInfo = {
	_id: string;
	email: string;
	preferences: {
		hourlyRate: number;
		currency: string;
		availability: [];
	};
};

export type TJobRequest = {
	_id: string;
	client: string;
	location: {
		type: string;
		coordinates: number[];
	};
	jobDescription: string;
	desiredStartTime: Date;
	desiredEndTime: Date | null;
	desiredNumberOfPackers: number;
	budgetPerHour: number;
	status: TJobRequestStatus;
	createdAt: Date;
	updatedAt: Date;
};

// export type TJobAcceptance = {
// 	_id: string;
// 	packer:  string | (TAccount & (TBusinessAccount | TIndividualAccount));
// 	jobRequest: string;
// 	client: string;
// 	status: TJobAcceptanceStatus;
// 	note?: string;
// 	createdAt: Date;
// };

export type TJobCompletion = {
	jobRequest: string;
	client: string;
	packer: string;
	startTime: Date;
	endTime: Date;
	appCommision: number;
	hourlyRate: number;
	payment: {
		amount: number;
		paymentMethod: string;
		transactionId?: string;
		paidAt: Date;
	};
	clientRating: {
		rating: number;
		comment?: string;
	};
	packerRating: {
		rating: number;
		comment?: string;
	};
	createdAt: Date;
};

export type TNewJobRequest = {
	jobDescription: string;
	autoCloseAt: string;
	jobToBeCompletedAt: string;
	isOpened: boolean;
	duration: number;
	budgetPerHour: number;
	location: {
		longitude: number;
		latitude: number;
	};
};


export enum ESortJobByOptions {
	createdAt = "createdAt",
	autoCloseAt = "autoCloseAt",
	isOpened = "isOpened",
}
export enum ESortJobAcceptancesByOptions {
	createdAt = "createdAt",
	status = "status",
}

export interface TGetJobsFilterDto {
	sortBy?: ESortJobByOptions;
	skip?: number;
	take?: number;
}

export interface TGetJobAcceptancesFilterDto {
	sortBy?: ESortJobAcceptancesByOptions;
	skip?: number;
	take?: number;
}

export type TJobStatus =
	| "Pending"
	| "Accepted"
	| "Completed"
	| "Rejected"
	| "Cancelled";


export type PaginatedResponse<T> = {
	records: T;
	currentPage: number;
	numberOfRecords: number;
	totalRecords: number;
	totalPages: number;
};
export type TJobRequestResponse = {
	id: number;
	latitude: number;
	longitude: number;
	jobDescription: string;
	uniqueCode: string;
	duration: number;
	budgetPerHour: number;
	isOpened: boolean;
	autoCloseAt: Date;
	jobToBeCompletedAt: Date;
	status: TJobStatus;
	acceptances: TJobAcceptance[];
	jobRequestCompletions: TJob[];
	createdAt: Date;
	updatedAt: Date;
};

export type TPackerJobRequestResponse = {
	id: number;
	latitude: number;
	longitude: number;
	jobDescription: string;
	uniqueCode: string;
	duration: number;
	isOpened: boolean;
	autoCloseAt: Date;
	jobToBeCompletedAt: Date;
	status: TJobStatus;
	acceptances: TPackerJobAcceptance[];
	jobRequestCompletions: Omit<TJob, "packerJob">[];
	jobRequestClient: TJobClient;
	createdAt: Date;
	updatedAt: Date;
	estimatedEarnings:number
}; 

export type JobAcceptanceWithDetails = {
	id: number;
	jobRequestId: number;
	status: TJobStatus;
	uniqueCode: string;
	notes?: string;
	hourlyRate: number;
	jobToBeCompletedAt: Date;
	createdAt: Date;
	isApproved: boolean;
	approvedAt?: Date;
	jobRequest: {
		id: number;
		latitude: number;
		longitude: number;
		jobDescription: string;
		uniqueCode: string;
		duration: number;
		jobRequestClient: {
			id: number;
			surname: string;
			othernames: string;
			email: string;
			phone: string;
			picture?: string;
		};
		createdAt: Date;
		updatedAt: Date;
	};
	jobRequestCompletions: JobCompletion[];
	estimatedEarnings: number;
};

export type JobCompletion = {
	id: number;
	jobRequest: number;
	status: TJobStatus;
	packerJob: TJobPacker;
	serviceCharge: number;
	duration: number;
	uniqueCode: string;
	hourlyRate: number;
	hasCompleted: boolean;
	jobToBeCompletedAt: Date;
	createdAt: Date;
	updatedAt: Date;
};

// type JobStatus = 'Pending' | 'Approved' | 'Rejected'; // Adjust based on your actual JobStatus type


export type TPackerJobAcceptance = {
	id: number;
	jobRequestId: number;
	status: TJobStatus;
	uniqueCode: string;
	notes?: string;
	hourlyRate: number;
	jobToBeCompletedAt: Date;
	createdAt: Date;
	isApproved: boolean;
	approvedAt?: Date;
};

export type TJobClient = {
	id: number;
	surname: string;
	othernames: string;
	email: string;
	phone: string;
	picture: string;
};

export type TJobAcceptance = {
	id: number;
	packer: TJobPacker;
	jobRequestId: number;
	status: TJobStatus;
	uniqueCode: string;
	notes?: string;
	hourlyRate: number;
	jobToBeCompletedAt: Date;
	createdAt: Date;
	isApproved: boolean;
	approvedAt?: Date;
};

export type TJobPacker = {
	id: number;
	surname: string;
	othernames: string;
	businessName: string;
	businessLocation: string;
	businessWebsite: string;
	email: string;
	phone: string;
	picture:string;
};

export type TJob = {
	id: number;
	jobRequest: number;
	status: TJobStatus;
	packerJob: TJobPacker;
	serviceCharge: number;
	duration: number;
	uniqueCode: string;
	hourlyRate: number;
	hasCompleted: boolean;
	jobToBeCompletedAt: Date;
	createdAt: Date;
	updatedAt: Date;
};


export type UserProps = {
	name: string;
	username: string;
	avatar: string;
	online: boolean;
};

export type MessageProps = {
	id: string;
	content: string;
	timestamp: string;
	unread?: boolean;
	sender: UserProps | "You";
	attachment?: {
		fileName: string;
		type: string;
		size: string;
	};
};

export type ChatProps = {
	id: string;
	sender: UserProps;
	messages: MessageProps[];
};