package ma.dev7hd.accountservice.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class TransactionAccountsBalanceDTO {
    private double balanceSender;
    private double balanceReceiver;
}
