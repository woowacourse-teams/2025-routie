package routie.business.routiespace.infrastructure;

import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class UUIDBaseRandomRoutieSpaceIdentifierProvider extends RandomRoutieSpaceIdentifierProvider {

    @Override
    protected String generateRandomName() {
        return UUID.randomUUID().toString();
    }
}
