package routie.business.like.domain;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import routie.business.place.domain.Place;

@Repository
public interface PlaceLikeRepository extends JpaRepository<PlaceLike, Long> {

    long countByPlace(Place place);

    Optional<PlaceLike> findByPlaceIdAndUserId(Long placeId, Long userId);

    Optional<PlaceLike> findByPlaceIdAndGuestId(Long placeId, Long guestId);
}
