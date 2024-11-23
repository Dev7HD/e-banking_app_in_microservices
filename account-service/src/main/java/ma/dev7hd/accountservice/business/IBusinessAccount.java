package ma.dev7hd.accountservice.business;

import ma.dev7hd.accountservice.entities.Account;

public interface IBusinessAccount {
    String generateBankIdentityStatement();

    Account addClientInfo(Account account);

    Account debit(Account account, double amount);

    Account credit(Account account, double amount);
}
