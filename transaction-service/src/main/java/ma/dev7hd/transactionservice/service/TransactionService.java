package ma.dev7hd.transactionservice.service;

import lombok.AllArgsConstructor;
import ma.dev7hd.transactionservice.clients.AccountRestClient;
import ma.dev7hd.transactionservice.dtos.TransactionAccountsRibDTO;
import ma.dev7hd.transactionservice.dtos.TransactionDTO;
import ma.dev7hd.transactionservice.entities.Transaction;
import ma.dev7hd.transactionservice.repositories.TransactionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@AllArgsConstructor
public class TransactionService implements ITransactionService {
    private final TransactionRepository transactionRepository;
    private final AccountRestClient accountRestClient;

    @Override
    public ResponseEntity<String> processTransaction(TransactionDTO transactionDTO) {
        Jwt jwt = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String token = "Bearer " + jwt.getTokenValue();

        TransactionAccountsRibDTO ribDTO = new TransactionAccountsRibDTO();
        ribDTO.setRibSender(transactionDTO.getRibSender());
        ribDTO.setRibReceiver(transactionDTO.getRibReceiver());

        ResponseEntity<String> accountBalanceResponse = accountRestClient.getAccountBalance(token, ribDTO, transactionDTO.getAmount());

        if (accountBalanceResponse.getStatusCode().value() == 200) {
            String msg = accountBalanceResponse.getBody();

            Transaction transaction = Transaction.builder()
                    .amount(transactionDTO.getAmount())
                    .description(transactionDTO.getDescription())
                    .ribReceiver(ribDTO.getRibReceiver())
                    .ribSender(ribDTO.getRibSender())
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


}
