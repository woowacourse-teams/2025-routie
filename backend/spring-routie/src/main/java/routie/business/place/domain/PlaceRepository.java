package routie.business.place.domain;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import routie.business.hashtag.domain.Hashtag;
import routie.business.routiespace.domain.RoutieSpace;

@Repository
public interface PlaceRepository extends JpaRepository<Place, Long> {

    Optional<Place> findByIdAndRoutieSpace(Long id, RoutieSpace routieSpace);

    boolean existsByIdAndRoutieSpace(Long id, RoutieSpace routieSpace);

    @Modifying
    @Query("DELETE FROM PlaceHashtag ph WHERE ph.place.routieSpace = :routieSpace")
    void deletePlaceHashtagsByRoutieSpace(@Param("routieSpace") RoutieSpace routieSpace);

    @Modifying
    @Query("DELETE FROM PlaceHashtag ph WHERE ph.hashtag = :hashtag")
    void deletePlaceHashtagsByHashtag(@Param("hashtag") Hashtag hashtag);

    @Query("SELECT COUNT(ph) FROM PlaceHashtag ph WHERE ph.hashtag = :hashtag")
    Long countPlaceHashtagsByHashtag(@Param("hashtag") Hashtag hashtag);
}
