package ma.dev7hd.accountservice.business;

import ma.dev7hd.accountservice.entities.Account;
import org.springframework.http.ResponseEntity;

public interface IBusinessAccount {
    String generateBankIdentityStatement();

    Account addClientInfo(Account account);

    ResponseEntity<String> deleteAccountTransactions(String rib);

    Account debit(Account account, double amount);

    Account credit(Account account, double amount);
}
