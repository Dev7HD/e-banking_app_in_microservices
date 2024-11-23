package ma.dev7hd.accountservice.services;

import ma.dev7hd.accountservice.dtos.AccountDTO;
import ma.dev7hd.accountservice.dtos.NewAccountDTO;
import ma.dev7hd.accountservice.dtos.TransactionAccountsRibDTO;
import ma.dev7hd.accountservice.entities.Account;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

import javax.security.auth.login.AccountNotFoundException;
import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface IAccountService {
    List<AccountDTO> getAllAccounts();

    AccountDTO getAccountById(UUID id) throws AccountNotFoundException;

    AccountDTO getAccountByRIB(String rib) throws AccountNotFoundException;

    @Transactional
    AccountDTO createAccount(NewAccountDTO accountDTO);

    @Transactional
    AccountDTO updateAccount(AccountDTO accountDTO, UUID id) throws AccountNotFoundException;

    @Transactional
    void deleteAccountById(UUID id) throws AccountNotFoundException;

    @Transactional
    ResponseEntity<String> processTransaction(TransactionAccountsRibDTO dto, double amount);

    @Transactional
    ResponseEntity<String> deleteAccountByClientId(Long clientId);

    Set<Account> getClientAccounts(Long clientId);
}
