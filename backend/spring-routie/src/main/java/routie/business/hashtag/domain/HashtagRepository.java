package routie.business.hashtag.domain;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import routie.business.routiespace.domain.RoutieSpace;

public interface HashtagRepository extends JpaRepository<Hashtag, Long> {

    List<Hashtag> findByRoutieSpaceId(Long routieSpaceId);

    Optional<Hashtag> findByRoutieSpaceIdAndName(Long routieSpaceId, String name);
}
