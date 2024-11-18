package ma.dev7hd.transactionservice.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TransactionDTO {
    private String ribSender;
    private String ribReceiver;
    private double amount;
    private String description;
}
