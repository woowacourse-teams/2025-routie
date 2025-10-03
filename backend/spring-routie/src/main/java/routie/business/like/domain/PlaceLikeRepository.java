package routie.business.like.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import routie.business.place.domain.Place;

@Repository
public interface PlaceLikeRepository extends JpaRepository<PlaceLike, Long> {

    long countByPlace(Place place);

    boolean findByPlaceIdAndUserId(Long placeId, Long id);
}
