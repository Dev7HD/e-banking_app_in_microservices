package ma.dev7hd.accountservice.clients;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import ma.dev7hd.accountservice.model.Client;
import ma.dev7hd.accountservice.model.Transaction;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "TRANSACTION-SERVICE")
public interface TransactionsRestClient {

    @GetMapping("/transactions/{id}")
    @CircuitBreaker(name = "transactionService", fallbackMethod = "getDefaultTransaction")
    Transaction getTransaction(@RequestHeader("Authorization") String token, @PathVariable Long id);

    @GetMapping("/transactions")
    @CircuitBreaker(name = "transactionService", fallbackMethod = "getDefaultTransactions")
    List<Transaction> getTransactions(@RequestHeader("Authorization") String token);

    @GetMapping("/transactions/rib/{rib}")
    @CircuitBreaker(name = "transactionService", fallbackMethod = "getDefaultTransactions")
    List<Transaction> getTransactionsByRib(@RequestHeader("Authorization") String token, @PathVariable Long rib);

    default List<Client> getDefaultTransactions(String token, Exception e) {
        System.err.println("TRANSACTION-SERVICE Not available");
        return List.of();
    }
}
