package ma.dev7hd.accountservice.clients;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import ma.dev7hd.accountservice.model.Client;
import ma.dev7hd.accountservice.model.Transaction;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

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

    @DeleteMapping("/transactions/rib/{rib}")
    @CircuitBreaker(name = "transactionService", fallbackMethod = "defaultDeleteTransactions")
    ResponseEntity<String> deleteTransactions(@RequestHeader("Authorization") String token, @PathVariable String rib);

    default Transaction getDefaultTransaction(Long id, Exception e) {
        System.err.println("TRANSACTION-SERVICE Not available");
        return Transaction.builder()
                .id(id)
                .transactionType(null)
                .description("Not available")
                .ribReceiver("Not available")
                .ribSender("Not available")
                .amount(null)
                .date(null)
                .build();
    }

    default List<Client> getDefaultTransactions() {
        System.err.println("TRANSACTION-SERVICE Not available");
        return List.of();
    }

    default void defaultDeleteTransactions(){
        System.err.println("TRANSACTION-SERVICE Not available");
    }
}
