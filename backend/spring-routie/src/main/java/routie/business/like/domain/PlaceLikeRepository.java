package routie.business.like.domain;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import routie.business.place.domain.Place;

@Repository
public interface PlaceLikeRepository extends JpaRepository<PlaceLike, Long> {

    long countByPlace(Place place);

    void deleteByPlaceId(long placeId);

    @Modifying
    @Query("DELETE FROM PlaceLike pl WHERE pl.place.routieSpace.id = :routieSpaceId")
    void deleteByRoutieSpaceId(long routieSpaceId);

    Optional<PlaceLike> findByPlaceIdAndUserId(Long placeId, Long userId);

    Optional<PlaceLike> findByPlaceIdAndGuestId(Long placeId, Long guestId);

    @Query("SELECT pl FROM PlaceLike pl JOIN pl.place p WHERE p.routieSpace.id = :routieSpaceId AND pl.user.id = :userId")
    List<PlaceLike> findByRoutieSpaceIdAndUserId(@Param("routieSpaceId") Long routieSpaceId,
                                                 @Param("userId") Long userId);

    @Query("SELECT pl FROM PlaceLike pl JOIN pl.place p WHERE p.routieSpace.id = :routieSpaceId AND pl.guest.id = :guestId")
    List<PlaceLike> findByRoutieSpaceIdAndGuestId(@Param("routieSpaceId") Long routieSpaceId,
                                                  @Param("guestId") Long guestId);
}
