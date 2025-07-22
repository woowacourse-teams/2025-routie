package routie.place.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import routie.place.domain.Place;

@Repository
public interface PlaceRepository extends JpaRepository<Place, Long> {
}
