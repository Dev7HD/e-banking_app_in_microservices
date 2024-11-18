package ma.dev7hd.accountservice.services;

import lombok.AllArgsConstructor;
import ma.dev7hd.accountservice.business.IBusinessAccount;
import ma.dev7hd.accountservice.dtos.AccountDTO;
import ma.dev7hd.accountservice.dtos.NewAccountDTO;
import ma.dev7hd.accountservice.dtos.TransactionAccountsBalanceDTO;
import ma.dev7hd.accountservice.dtos.TransactionAccountsRibDTO;
import ma.dev7hd.accountservice.entities.Account;
import ma.dev7hd.accountservice.mappers.IMapper;
import ma.dev7hd.accountservice.repositories.AccountRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.security.auth.login.AccountNotFoundException;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class AccountService implements IAccountService {
    private final AccountRepository accountRepository;
    private final IMapper mapper;
    private final IBusinessAccount businessAccount;

    @Override
    public List<AccountDTO> getAllAccounts() {
        List<Account> accounts = accountRepository.findAll();
        List<Account> accountList = accounts.stream().map(businessAccount::addClientInfo).toList();
        return mapper.accountsToAccountDTOs(accountList);
    }

    @Override
    public AccountDTO getAccountById(UUID id) throws AccountNotFoundException {
        Account account = accountRepository.findById(id).orElseThrow(() -> new AccountNotFoundException("Account not found"));
        return mapper.accountToAccountDTO(businessAccount.addClientInfo(account));
    }

    @Override
    public AccountDTO getAccountByRIB(String rib) {
        Account account = accountRepository.findByRib(rib).orElse(null);
        return account != null ? mapper.accountToAccountDTO(businessAccount.addClientInfo(account)) : null;
    }

    @Transactional
    @Override
    public AccountDTO createAccount(NewAccountDTO accountDTO) {
        Account account = Account.builder()
                .accountType(accountDTO.getAccountType())
                .balance(accountDTO.getBalance())
                .createdAt(new Date())
                .currency(accountDTO.getCurrency())
                .clientId(accountDTO.getClientId())
                .build();

        return mapper.accountToAccountDTO(accountRepository.save(businessAccount.addClientInfo(account)));
    }

    @Transactional
    @Override
    public AccountDTO updateAccount(AccountDTO accountDTO, UUID id) throws AccountNotFoundException {
        Account account = accountRepository.findById(id).orElseThrow(() -> new AccountNotFoundException("Account not found"));
        if (accountDTO.getAccountType() != null) account.setAccountType(accountDTO.getAccountType());
        if (accountDTO.getBalance() != null) account.setBalance(accountDTO.getBalance());
        if (accountDTO.getCurrency() != null) account.setCurrency(accountDTO.getCurrency());
        return mapper.accountToAccountDTO(accountRepository.save(businessAccount.addClientInfo(account)));
    }

    @Override
    public void deleteAccountById(UUID id) throws AccountNotFoundException {
        Account account = accountRepository.findById(id).orElseThrow(() -> new AccountNotFoundException("Account not found"));
        accountRepository.delete(account);
    }

    @Transactional
    @Override
    public ResponseEntity<String> processTransaction(TransactionAccountsRibDTO dto, double amount){
        Account sender = accountRepository.findByRib(dto.getRibSender()).orElse(null);
        Account receiver = accountRepository.findByRib(dto.getRibReceiver()).orElse(null);
        if(sender != null && receiver != null && amount > 0 && sender.getBalance() >= amount){
            Account debited = businessAccount.debit(sender, amount);
            Account credited = businessAccount.credit(receiver, amount);
            accountRepository.saveAll(List.of(debited, credited));
            return ResponseEntity.ok("Transaction Successful");
        }
        return ResponseEntity.badRequest().build();
    }
}
