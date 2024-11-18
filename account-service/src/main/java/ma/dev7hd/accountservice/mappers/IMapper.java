package ma.dev7hd.accountservice.mappers;

import ma.dev7hd.accountservice.dtos.AccountDTO;
import ma.dev7hd.accountservice.entities.Account;

import java.util.List;

public interface IMapper {
    AccountDTO accountToAccountDTO(Account account);

    List<AccountDTO> accountsToAccountDTOs(List<Account> accounts);

}
