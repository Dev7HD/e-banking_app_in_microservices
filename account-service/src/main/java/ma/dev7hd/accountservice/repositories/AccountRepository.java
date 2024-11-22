package ma.dev7hd.accountservice.repositories;

import ma.dev7hd.accountservice.entities.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AccountRepository extends JpaRepository<Account, UUID> {

    Optional<Account> findByRib(String rib);

    Optional<Account> findByClientId(Long clientId);
}
