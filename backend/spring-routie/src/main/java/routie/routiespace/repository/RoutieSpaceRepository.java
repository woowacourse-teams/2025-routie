package routie.routiespace.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import routie.routiespace.domain.RoutieSpace;

@Repository
public interface RoutieSpaceRepository extends JpaRepository<RoutieSpace, Long> {

    Optional<RoutieSpace> findByIdentifier(String identifier);
}
