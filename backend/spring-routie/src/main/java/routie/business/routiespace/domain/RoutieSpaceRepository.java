package routie.business.routiespace.domain;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoutieSpaceRepository extends JpaRepository<RoutieSpace, Long> {

    Optional<RoutieSpace> findByIdentifier(String identifier);
}
