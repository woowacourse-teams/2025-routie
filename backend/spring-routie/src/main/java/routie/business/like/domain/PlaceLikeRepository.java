package routie.business.like.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import routie.business.place.domain.Place;

@Repository
public interface PlaceLikeRepository extends JpaRepository<PlaceLike, Long> {

    long countByPlace(Place place);

    void deleteByPlaceId(long placeId);

    @Modifying
    @Query("DELETE FROM PlaceLike pl WHERE pl.place.routieSpace.id = :routieSpaceId")
    void deleteByRoutieSpaceId(long routieSpaceId);
}
