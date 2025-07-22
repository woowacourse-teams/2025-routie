package routie.place.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import routie.place.domain.PlaceClosedWeekday;

@Repository
public interface PlaceClosedWeekdayRepository extends JpaRepository<PlaceClosedWeekday, Long> {
}
