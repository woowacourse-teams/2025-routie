package routie;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class RoutieApplication {

    public static void main(final String[] args) {
        SpringApplication.run(RoutieApplication.class, args);
    }

}
