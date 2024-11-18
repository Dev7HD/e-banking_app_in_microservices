package ma.dev7hd.clientservice.repositories;

import ma.dev7hd.clientservice.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, Long> {

}
