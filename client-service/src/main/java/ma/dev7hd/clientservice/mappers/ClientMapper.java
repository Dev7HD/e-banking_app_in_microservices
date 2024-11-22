package ma.dev7hd.clientservice.mappers;

import lombok.AllArgsConstructor;
import ma.dev7hd.clientservice.dtos.ClientDTO;
import ma.dev7hd.clientservice.entities.Client;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@AllArgsConstructor
@Component
public class ClientMapper implements IClientMapper {
    private ModelMapper modelMapper;

    @Override
    public Client convertNewClientDtoToClient(ClientDTO dto){
        return modelMapper.map(dto, Client.class);
    }
}
