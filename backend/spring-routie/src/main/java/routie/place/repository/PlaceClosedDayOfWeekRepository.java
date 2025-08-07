package routie.place.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import routie.place.domain.PlaceClosedDayOfWeek;

@Repository
public interface PlaceClosedDayOfWeekRepository extends JpaRepository<PlaceClosedDayOfWeek, Long> {
}
