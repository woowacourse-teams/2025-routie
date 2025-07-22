package routie.routiespace.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import routie.routiespace.domain.RoutieSpace;

@Repository
public interface RoutieSpaceRepository extends JpaRepository<RoutieSpace, Long> {
}
