package ma.dev7hd.clientservice;

import ma.dev7hd.clientservice.entities.Client;
import ma.dev7hd.clientservice.enums.ClientType;
import ma.dev7hd.clientservice.repositories.ClientRepository;
import org.modelmapper.ModelMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;

import java.util.ArrayList;
import java.util.List;

@SpringBootApplication
@EnableFeignClients
public class ClientServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ClientServiceApplication.class, args);
    }

    @Bean
    ModelMapper modelMapper(){
        return new ModelMapper();
    }

    @Bean
    CommandLineRunner commandLineRunner(ClientRepository clientRepository) {
        return args -> {
            List<Client> clients = new ArrayList<>();
            for (int i = 0; i < 20; i++) {
                Client client = Client.builder()
                        .clientType(Math.random() > 0.5 ? ClientType.Moral : ClientType.Physical)
                        .firstName("firstName" + i)
                        .lastName("lastName" + i)
                        .build();
                clients.add(client);
            }
            clientRepository.saveAll(clients);
        };
    }

}
