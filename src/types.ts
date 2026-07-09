export interface Account {
  id: string;
  accountNumber: string;
  ownerName: string;
  balance: number;
}

export interface Transaction {
  id: string;
  senderAccountId: string;
  receiverAccountId: string;
  amount: number;
  timestamp: string;
}

export interface TransferRequest {
  senderAccountId: string;
  receiverAccountId: string;
  amount: number;
}
