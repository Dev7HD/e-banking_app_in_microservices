package ma.dev7hd.clientservice.web;

import lombok.AllArgsConstructor;
import ma.dev7hd.clientservice.dtos.ClientDTO;
import ma.dev7hd.clientservice.entities.Client;
import ma.dev7hd.clientservice.service.IClientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/clients")
public class ClientController {
    private final IClientService clientService;

    @GetMapping()
    public ResponseEntity<List<Client>> getAllClients() {
        List<Client> clients = clientService.getAllClients();
        return clients.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(clients);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Client> getClientById(@PathVariable Long id) {
        Client client = clientService.getClientById(id);
        return client != null ? ResponseEntity.ok(client) : ResponseEntity.notFound().build();
    }

    @PostMapping("/new")
    public ResponseEntity<Client> createClient(@RequestBody ClientDTO clientDTO) {
        Client client = clientService.addClient(clientDTO);
        return ResponseEntity.ok(client);
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<String> deleteClientById(@PathVariable Long id) {
        return clientService.deleteClientById(id);
    }

    @PutMapping("/{id}/update")
    public Client updateClientById(@PathVariable Long id,@RequestBody ClientDTO dto) {
        return clientService.updateClientById(id, dto);
    }


}
