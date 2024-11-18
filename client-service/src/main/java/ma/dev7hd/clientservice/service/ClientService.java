package ma.dev7hd.clientservice.service;

import lombok.AllArgsConstructor;
import ma.dev7hd.clientservice.entities.Client;
import ma.dev7hd.clientservice.repositories.ClientRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class ClientService implements IClientService {
    private final ClientRepository clientRepository;

    @Override
    public Client getClientById(Long id) {
        return clientRepository.findById(id).orElse(null);
    }

    @Override
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

}
