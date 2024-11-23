package ma.dev7hd.clientservice.clients;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "ACCOUNT-SERVICE")
public interface AccountRestClient {

    @DeleteMapping("/accounts/client/{id}/delete")
    @CircuitBreaker(name = "accountService", fallbackMethod = "defaultDeleteAccount")
    ResponseEntity<String> deleteAccountByClientId(@RequestHeader("Authorization") String token,@PathVariable Long id);

    default ResponseEntity<String> defaultDeleteAccount(String token, @PathVariable Long id, Exception e) {
        return ResponseEntity.badRequest().body("Account service not available!");
    }

}
