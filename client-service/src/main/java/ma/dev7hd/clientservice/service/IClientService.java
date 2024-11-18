package ma.dev7hd.clientservice.service;

import ma.dev7hd.clientservice.entities.Client;

import java.util.List;
import java.util.UUID;

public interface IClientService {
    Client getClientById(Long id);

    List<Client> getAllClients();

}
