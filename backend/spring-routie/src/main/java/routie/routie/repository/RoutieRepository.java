package routie.routie.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import routie.routie.domain.Routie;

@Repository
public interface RoutieRepository extends JpaRepository<Routie, Long> {
}
