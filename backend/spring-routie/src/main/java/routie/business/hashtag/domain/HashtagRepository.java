package routie.business.hashtag.domain;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import routie.business.routiespace.domain.RoutieSpace;

public interface HashtagRepository extends JpaRepository<Hashtag, Long> {

    List<Hashtag> findByRoutieSpace(RoutieSpace routieSpace);

    Optional<Hashtag> findByRoutieSpaceAndName(RoutieSpace routieSpace, String name);

    void deleteByRoutieSpace(RoutieSpace routieSpace);

    @Query("SELECT h FROM Hashtag h " +
            "LEFT JOIN PlaceHashtag ph ON ph.hashtag = h " +
            "WHERE h.routieSpace = :routieSpace " +
            "GROUP BY h " +
            "ORDER BY COUNT(ph) DESC, h.name ASC")
    List<Hashtag> findByRoutieSpaceOrderByUsageCountDescAndNameAsc(@Param("routieSpace") RoutieSpace routieSpace);
}
