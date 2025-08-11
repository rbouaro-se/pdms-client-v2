
export type TWalletBalances ={
	balance: number;
	shadowBalance: number;
}

export type TTransactionFilterPayload = {
	status?: TTransactionStatus; // Optional string for 'status'
	transactionType?: TTransactionType; // Optional string for 'transactionType'
	minAmount?: number; // Optional string for 'minAmount'
	maxAmount?: number; // Optional string for 'maxAmount'
	skip?: number; // Optional number for 'skip'
	take?: number; // Optional number for 'take'
};

export type TTransactionType = "Credit" | "Debit" | "Transfer";
export type TTransactionStatus = "Pending" | "Completed" | "Failed";
export type TTransactionInitiator = "Bank" | "Wallet";
export type TTransaction = {
	id: number;
	createdAt: string;
	updatedAt: string;
	amount: number;
	type: TTransactionType;
	description: string;
	stripeTransactionId: string;
	status: TTransactionStatus;
	wallet: number;
	initiator: TTransactionInitiator;
};
