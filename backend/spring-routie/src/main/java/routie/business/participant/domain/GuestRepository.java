package routie.business.participant.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import routie.business.routiespace.domain.RoutieSpace;

import java.util.Optional;

public interface GuestRepository extends JpaRepository<Guest, Long> {
    boolean existsByNicknameAndRoutieSpaceId(String nickname, Long routieSpaceId);

    Optional<Guest> findByNicknameAndRoutieSpaceId(String nickname, Long RoutieSpaceId);

    void deleteByRoutieSpace(RoutieSpace routieSpace);
}
