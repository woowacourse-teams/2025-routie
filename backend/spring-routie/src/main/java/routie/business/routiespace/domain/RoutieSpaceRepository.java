package routie.business.routiespace.domain;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import routie.business.user.domain.User;

@Repository
public interface RoutieSpaceRepository extends JpaRepository<RoutieSpace, Long> {

    Optional<RoutieSpace> findByIdentifier(String identifier);

    List<RoutieSpace> findByOwner(User owner);
}
