export interface Client{
  id: number;
  firstName: string;
  lastName: string;
  clientType: ClientType;
}

export interface ClientDTO{
  firstName: string;
  lastName: string;
  clientType: ClientType;
}

export interface Account{
  id: string;
  balance: number;
  accountType: AccountType;
  currency: string;
  rib: string;
  customerInfo: Client;
}

export interface Transaction{
  id: number;
  description: string;
  amount: number;
  date: Date;
  ribSender: string;
  ribReceiver: string;
  transactionType: TransactionType;
}

export interface TransactionDTO{
  ribSender: string;
  ribReceiver: string;
  description: string;
  amount: number;
  transactionType: TransactionType;
}

export enum ClientType{
  Physical,
  Moral
}

export enum TransactionType {
  INSTANTLY,
  NORMAL
}


export enum AccountType {
  SAVING_ACCOUNT,
  CURRENT_ACCOUNT,
}
