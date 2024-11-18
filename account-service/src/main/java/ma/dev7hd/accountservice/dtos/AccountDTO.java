package ma.dev7hd.accountservice.dtos;

import lombok.Getter;
import lombok.Setter;
import ma.dev7hd.accountservice.enums.AccountType;
import ma.dev7hd.accountservice.model.Client;

import java.util.UUID;

@Getter @Setter
public class AccountDTO {
    private UUID id;
    private Double balance;
    private AccountType accountType;
    private String currency;
    private String rib;
    private Client customerInfo;
}
