package routie.routie.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import routie.routie.domain.RoutiePlace;

@Repository
public interface RoutiePlaceRepository extends JpaRepository<RoutiePlace, Long> {
    boolean existsRoutiePlaceByPlaceId(Long placeId);
}
