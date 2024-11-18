package ma.dev7hd.accountservice.business;

import lombok.AllArgsConstructor;
import ma.dev7hd.accountservice.clients.ClientsRestClient;
import ma.dev7hd.accountservice.entities.Account;
import ma.dev7hd.accountservice.model.Client;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.Random;

@Component
@AllArgsConstructor
public class BusinessAccount implements IBusinessAccount {

    private final ClientsRestClient clientsRestClient;

    @Override
    public String generateBankIdentityStatement() {
        Random random = new Random();
        StringBuilder bankIdentity = new StringBuilder();

        // Generate 24 random digits
        for (int i = 0; i < 24; i++) {
            int digit = random.nextInt(10); // Random digit between 0-9
            bankIdentity.append(digit);
        }

        return bankIdentity.toString();
    }

    @Override
    public Account addClientInfo(Account account) {
        Jwt jwt = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String token = "Bearer " + jwt.getTokenValue();
        Client client = clientsRestClient.getClient(token ,account.getClientId());
        account.setCustomerInfo(client);
        return account;
    }

    @Override
    public Account debit(Account account, double amount) {
        assert amount > 0;
        if (account.getBalance() >= amount) account.setBalance(account.getBalance()-amount);
        return account;
    }

    @Override
    public Account credit(Account account, double amount) {
        assert amount > 0;
        account.setBalance(account.getBalance()+amount);
        return account;
    }
}
