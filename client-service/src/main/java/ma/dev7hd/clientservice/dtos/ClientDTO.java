package ma.dev7hd.clientservice.dtos;

import lombok.Getter;
import lombok.Setter;
import ma.dev7hd.clientservice.enums.ClientType;

@Getter @Setter
public class ClientDTO {
    private String firstName;
    private String lastName;
    private ClientType clientType;
}
