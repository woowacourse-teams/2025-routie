package routie.place.domain;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import routie.routiespace.domain.RoutieSpace;

@Repository
public interface PlaceRepository extends JpaRepository<Place, Long> {

    Optional<Place> findByIdAndRoutieSpace(Long id, RoutieSpace routieSpace);

    boolean existsByIdAndRoutieSpace(Long id, RoutieSpace routieSpace);
}
