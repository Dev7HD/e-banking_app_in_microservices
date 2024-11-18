package ma.dev7hd.transactionservice.repositories;

import ma.dev7hd.transactionservice.entities.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

}
