package ma.dev7hd.clientservice.mappers;

import ma.dev7hd.clientservice.dtos.ClientDTO;
import ma.dev7hd.clientservice.entities.Client;

public interface IClientMapper {
    Client convertNewClientDtoToClient(ClientDTO dto);
}
