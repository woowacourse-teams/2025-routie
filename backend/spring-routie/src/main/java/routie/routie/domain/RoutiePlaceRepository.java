package routie.routie.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RoutiePlaceRepository extends JpaRepository<RoutiePlace, Long> {
    boolean existsRoutiePlaceByPlaceId(Long placeId);

    @Modifying
    @Query("DELETE FROM RoutiePlace rp WHERE rp.place.routieSpace.id = :routieSpaceId")
    void deleteByRoutieSpaceId(@Param("routieSpaceId") Long routieSpaceId);
}
