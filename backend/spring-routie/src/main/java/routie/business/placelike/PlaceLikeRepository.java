package routie.business.placelike;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import routie.business.placelike.domain.PlaceLike;

@Repository
public interface PlaceLikeRepository extends JpaRepository<PlaceLike, Long> {
}
