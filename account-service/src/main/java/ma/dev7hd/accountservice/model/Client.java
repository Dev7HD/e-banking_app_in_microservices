package ma.dev7hd.accountservice.model;

import lombok.Getter;
import lombok.Setter;
import ma.dev7hd.accountservice.enums.ClientType;

@Getter @Setter
public class Client {
    private Long id;
    private String firstName;
    private String lastName;
    private ClientType clientType;
}
