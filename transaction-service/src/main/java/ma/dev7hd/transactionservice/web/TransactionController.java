package ma.dev7hd.transactionservice.web;

import lombok.AllArgsConstructor;
import ma.dev7hd.transactionservice.dtos.TransactionDTO;
import ma.dev7hd.transactionservice.entities.Transaction;
import ma.dev7hd.transactionservice.service.ITransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
