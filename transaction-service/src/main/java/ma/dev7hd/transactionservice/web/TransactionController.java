package ma.dev7hd.transactionservice.web;

import lombok.AllArgsConstructor;
import ma.dev7hd.transactionservice.dtos.TransactionDTO;
import ma.dev7hd.transactionservice.entities.Transaction;
import ma.dev7hd.transactionservice.service.ITransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@AllArgsConstructor
@RequestMapping("/transactions")
public class TransactionController {
    private ITransactionService transactionService;

    @PostMapping("/new")
    public ResponseEntity<String> sendMoney(@RequestBody TransactionDTO transactionDTO) {
        return transactionService.processTransaction(transactionDTO);
    }

    @GetMapping()
    public List<Transaction> getAllTransactions() {
        return transactionService.getAllTransactions();
    }

    @GetMapping("/rib/{rib}")
    public ResponseEntity<Set<Transaction>> getTransactionsByRib(@PathVariable String rib){
        Set<Transaction> transactions = transactionService.getTransactionsByRib(rib);
        if(transactions.isEmpty()){
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(transactions);
    }

    @DeleteMapping("/rib")
    public ResponseEntity<String> deleteTransactions(@RequestBody Set<String> ribs){
        transactionService.deleteTransactions(ribs);
        return ResponseEntity.ok("Account transactions deleted successfully");
    }
}
