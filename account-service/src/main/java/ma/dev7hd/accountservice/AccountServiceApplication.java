package ma.dev7hd.accountservice;

import ma.dev7hd.accountservice.business.IBusinessAccount;
import ma.dev7hd.accountservice.clients.ClientsRestClient;
import ma.dev7hd.accountservice.entities.Account;
import ma.dev7hd.accountservice.enums.AccountType;
import ma.dev7hd.accountservice.model.Client;
import ma.dev7hd.accountservice.repositories.AccountRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@SpringBootApplication
@EnableFeignClients
public class AccountServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AccountServiceApplication.class, args);
    }

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }

    @Value("${temp_token}")
    String token;

    @Bean
    CommandLineRunner commandLineRunner(AccountRepository accountRepository, IBusinessAccount businessAccount, ClientsRestClient clientsRestClient) {
        return args -> {
            System.out.println("token: \nBearer " + token);
            ResponseEntity<List<Client>> clientsResponse = clientsRestClient.getClients("Bearer " + token);
            if(clientsResponse.getStatusCode().is2xxSuccessful()) {
                System.out.println("clients size: " + clientsResponse.getBody().size());
            } else {
                System.err.println("Response status: "+clientsResponse.getStatusCode());
            }
            List<Account> accounts = new ArrayList<>();
            for (Client client : Objects.requireNonNull(clientsResponse.getBody())) {
                for (int i = 0; i < 3; i++) {
                    Account account = Account.builder()
                            .balance(Math.random() * 10000 + 5000)
                            .currency(Math.random() > 0.5 ? "EUR" : "USD")
                            .createdAt(new Date())
                            .accountType(Math.random() > 0.5 ? AccountType.CURRENT_ACCOUNT : AccountType.SAVING_ACCOUNT)
                            .rib(businessAccount.generateBankIdentityStatement())
                            .clientId((client.getId()))
                            .build();
                    accounts.add(account);
                }
            }
            accountRepository.saveAll(accounts);
        };
    }

}
