package ma.dev7hd.transactionservice.service;

import lombok.AllArgsConstructor;
import ma.dev7hd.transactionservice.clients.AccountRestClient;
import ma.dev7hd.transactionservice.dtos.TransactionAccountsRibDTO;
import ma.dev7hd.transactionservice.dtos.TransactionDTO;
import ma.dev7hd.transactionservice.entities.Transaction;
import ma.dev7hd.transactionservice.enums.TransactionType;
import ma.dev7hd.transactionservice.repositories.TransactionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@AllArgsConstructor
public class TransactionService implements ITransactionService {
    private final TransactionRepository transactionRepository;
    private final AccountRestClient accountRestClient;

    @Override
    public ResponseEntity<String> processTransaction(TransactionDTO transactionDTO) {
        Jwt jwt = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String token = "Bearer " + jwt.getTokenValue();

        if (transactionDTO.getRibReceiver() == null || transactionDTO.getRibSender() == null || transactionDTO.getRibReceiver().isEmpty() || transactionDTO.getRibSender().isEmpty() || transactionDTO.getRibReceiver().equals(transactionDTO.getRibSender())) {
            return ResponseEntity.badRequest().body("Transaction cannot be processed.");
        }

        TransactionAccountsRibDTO ribDTO = new TransactionAccountsRibDTO();
        ribDTO.setRibSender(transactionDTO.getRibSender());
        ribDTO.setRibReceiver(transactionDTO.getRibReceiver());

        ResponseEntity<String> accountBalanceResponse = accountRestClient.makeTransaction(token, ribDTO, transactionDTO.getAmount());

        if (accountBalanceResponse.getStatusCode().value() == 200) {
            String msg = accountBalanceResponse.getBody();

            Transaction transaction = Transaction.builder()
                    .amount(transactionDTO.getAmount())
                    .description(transactionDTO.getDescription())
                    .ribReceiver(ribDTO.getRibReceiver())
                    .ribSender(ribDTO.getRibSender())
                    .transactionType(TransactionType.valueOf(transactionDTO.getTransactionType().toString()))
                    .build();

            transactionRepository.save(transaction);

            return ResponseEntity.ok(msg);
        }

        return ResponseEntity.badRequest().body("Transaction failed!");
    }

    @Override
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    @Override
    public Set<Transaction> getTransactionsByRib(Set<String> rib){
        return transactionRepository.findByRibs(rib);
    }

    @Override
    public Set<Transaction> getTransactionsByRib(String rib){
        return transactionRepository.findByRib(rib);
    }

    @Override
    public void deleteTransactions(Set<String> ribs){
        List<Transaction> transactions = new ArrayList<>(getTransactionsByRib(ribs));
        if (!transactions.isEmpty()){
            transactionRepository.deleteAll(transactions);
        }
        System.out.println("transactions are empty");
    }


}
