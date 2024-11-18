package ma.dev7hd.clientservice.entities;

import jakarta.persistence.*;
import lombok.*;
import ma.dev7hd.clientservice.enums.ClientType;

@Entity
@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstName;
    private String lastName;
    @Enumerated(EnumType.STRING)
    private ClientType clientType;
}
