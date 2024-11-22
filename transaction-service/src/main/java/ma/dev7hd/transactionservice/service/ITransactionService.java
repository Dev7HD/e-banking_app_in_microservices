package ma.dev7hd.transactionservice.service;

import ma.dev7hd.transactionservice.dtos.TransactionDTO;
import ma.dev7hd.transactionservice.entities.Transaction;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ITransactionService {
    ResponseEntity<String> processTransaction(TransactionDTO transactionDTO);

    List<Transaction> getAllTransactions();

    List<Transaction> getTransactionsByRib(String rib);

    void deleteTransactions(String rib);
}
