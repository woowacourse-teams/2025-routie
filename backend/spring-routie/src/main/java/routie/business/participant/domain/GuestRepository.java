package routie.business.participant.domain;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GuestRepository extends JpaRepository<Guest, Long> {
    boolean existsByNicknameAndRoutieSpaceId(String nickname, Long routieSpaceId);

    Optional<Guest> findByNicknameAndRoutieSpaceId(String nickname, Long RoutieSpaceId);
}
