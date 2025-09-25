package routie.business.user.domain;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import routie.business.authentication.domain.external.ExternalAuthenticationProvider;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByExternalAuthenticationIdentifierAndExternalAuthenticationProvider(
            String externalAuthenticationIdentifier,
            ExternalAuthenticationProvider externalAuthenticationProvider
    );
}
