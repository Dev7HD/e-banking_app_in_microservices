package ma.dev7hd.accountservice.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import ma.dev7hd.accountservice.enums.ClientType;

@Getter @Setter
@ToString
public class Client {
    private Long id;
    private String firstName;
    private String lastName;
    private ClientType clientType;
}
