package ma.dev7hd.accountservice.repositories;

import ma.dev7hd.accountservice.entities.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

public interface AccountRepository extends JpaRepository<Account, UUID> {

    Optional<Account> findByRibOrderByCreatedAtDesc(String rib);

    Set<Account> findByClientIdOrderByCreatedAtDesc(Long clientId);

}
