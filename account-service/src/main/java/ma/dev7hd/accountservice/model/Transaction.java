package ma.dev7hd.accountservice.model;

import lombok.Builder;
import ma.dev7hd.accountservice.enums.TransactionType;

import java.util.Date;

@Builder
public class Transaction {
    private Long id;
    private String description;
    private Double amount;
    private Date date;
    private String ribSender;
    private String ribReceiver;
    private TransactionType transactionType;
}