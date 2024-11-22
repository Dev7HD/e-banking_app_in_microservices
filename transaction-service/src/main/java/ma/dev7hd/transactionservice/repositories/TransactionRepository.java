package ma.dev7hd.transactionservice.repositories;

import ma.dev7hd.transactionservice.entities.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query("SELECT t FROM Transaction t WHERE t.ribReceiver = :rib OR t.ribSender = :rib ORDER BY t.date")
    List<Transaction> findByRib(String rib);
}
