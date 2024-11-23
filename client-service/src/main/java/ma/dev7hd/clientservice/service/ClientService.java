package ma.dev7hd.clientservice.service;

import lombok.AllArgsConstructor;
import ma.dev7hd.clientservice.business.IClientBusiness;
import ma.dev7hd.clientservice.dtos.ClientDTO;
import ma.dev7hd.clientservice.entities.Client;
import ma.dev7hd.clientservice.mappers.ClientMapper;
import ma.dev7hd.clientservice.repositories.ClientRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ClientService implements IClientService {
    private final ClientRepository clientRepository;
    private final ClientMapper clientMapper;
    private final IClientBusiness clientBusiness;

    @Override
    public Client getClientById(Long id) {
        return clientRepository.findById(id).orElse(null);
    }

    @Override
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    @Transactional
    @Override
    public Client addClient(ClientDTO dto) {
        Client client = clientMapper.convertNewClientDtoToClient(dto);
        return clientRepository.save(client);
    }

    @Transactional
    @Override
    public Client updateClientById(Long id, ClientDTO dto) {
        Client client = clientRepository.findById(id).orElse(null);
        if (client != null) {
            if(dto.getFirstName() != null && !dto.getFirstName().isEmpty() && !dto.getFirstName().isBlank()) client.setFirstName(dto.getFirstName());
            if(dto.getLastName() != null && !dto.getLastName().isEmpty() && !dto.getLastName().isBlank()) client.setLastName(dto.getLastName());
            if(dto.getClientType() != null)  client.setClientType(dto.getClientType());
            return clientRepository.save(client);
        }
        return null;
    }

    @Transactional
    @Override
    public ResponseEntity<String> deleteClientById(Long id) {
        Optional<Client> client = clientRepository.findById(id);
        if (client.isPresent()) {
            ResponseEntity<String> response = clientBusiness.deleteAccountByClientId(id);
            if (response.getStatusCode().is2xxSuccessful()) {
                System.out.println("Status 200: " + response.getStatusCode().value());
                clientRepository.delete(client.get());
                return ResponseEntity.ok("Client deleted successfully");
            }
        }
        return ResponseEntity.notFound().build();
    }


}
