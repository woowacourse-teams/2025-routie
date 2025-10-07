package routie.business.like.domain;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import routie.business.participant.domain.Guest;
import routie.business.participant.domain.User;
import routie.business.place.domain.Place;
import routie.business.routiespace.domain.RoutieSpace;

@Repository
public interface PlaceLikeRepository extends JpaRepository<PlaceLike, Long> {

    long countByPlace(Place place);

    void deleteByPlaceId(long placeId);

    @Modifying
    @Query("DELETE FROM PlaceLike pl WHERE pl.place.routieSpace = :routieSpace")
    void deleteByRoutieSpace(@Param("routieSpace") RoutieSpace routieSpace);

    Optional<PlaceLike> findByPlaceIdAndUser(Long placeId, User user);

    Optional<PlaceLike> findByPlaceIdAndGuest(Long placeId, Guest guest);

    boolean existsByPlaceIdAndUser(Long placeId, User user);

    boolean existsByPlaceIdAndGuest(Long placeId, Guest guest);

    @Query("SELECT pl FROM PlaceLike pl JOIN pl.place p WHERE p.routieSpace = :routieSpace AND pl.user = :user")
    List<PlaceLike> findByRoutieSpaceAndUser(@Param("routieSpace") RoutieSpace routieSpace,
                                             @Param("user") User user);

    @Query("SELECT pl FROM PlaceLike pl JOIN pl.place p WHERE p.routieSpace = :routieSpace AND pl.guest = :guest")
    List<PlaceLike> findByRoutieSpaceAndGuest(@Param("routieSpace") RoutieSpace routieSpace,
                                              @Param("guest") Guest guest);
}
