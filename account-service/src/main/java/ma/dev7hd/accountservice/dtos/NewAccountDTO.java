package ma.dev7hd.accountservice.dtos;

import lombok.Getter;
import lombok.Setter;
import ma.dev7hd.accountservice.enums.AccountType;

import java.util.UUID;

@Getter @Setter
public class NewAccountDTO {
    private Double balance;
    private AccountType accountType;
    private String currency;
    private Long clientId;
}
