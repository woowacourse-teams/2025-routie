package routie.routie.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import routie.routie.domain.RoutiePlace;

@Repository
public interface RoutiePlaceRepository extends JpaRepository<RoutiePlace, Long> {

    @Modifying
    @Query("DELETE FROM RoutiePlace rp WHERE rp.place.routieSpace.id = :routieSpaceId")
    void deleteByRoutieSpaceId(@Param("routieSpaceId") Long routieSpaceId);
}
