package ma.dev7hd.accountservice.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Positive;
import lombok.*;
import ma.dev7hd.accountservice.enums.AccountType;
import ma.dev7hd.accountservice.model.Client;
import org.hibernate.annotations.UuidGenerator;

import java.util.Date;
import java.util.UUID;

@Entity
@Setter
@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Account {
    @Id @UuidGenerator(style = UuidGenerator.Style.TIME)
    private UUID id;

    @Positive(message = "Balance must be positive!")
    private double balance;

    @Enumerated(EnumType.STRING)
    private AccountType accountType;

    private String rib;

    private Date createdAt;

    private String currency;

    private Long clientId;

    @Transient
    private Client customerInfo;
}
