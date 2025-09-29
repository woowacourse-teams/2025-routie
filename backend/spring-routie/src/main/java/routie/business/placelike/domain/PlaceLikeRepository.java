package routie.business.placelike.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlaceLikeRepository extends JpaRepository<PlaceLike, Long> {
}
