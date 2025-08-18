package routie.routie.domain.route;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import lombok.Getter;
import routie.routie.domain.RoutiePlace;

public class RouteCalculationContext {

    @Getter
    private final List<RoutiePlace> routiePlaces;
    @Getter
    private final MovingStrategy movingStrategy;
    private final LocalDateTime startDateTime;

    public RouteCalculationContext(
            final LocalDateTime startDateTime,
            final List<RoutiePlace> routiePlaces,
            final MovingStrategy movingStrategy
    ) {
        this.routiePlaces = routiePlaces;
        this.movingStrategy = movingStrategy;
        this.startDateTime = startDateTime;
    }

    public Optional<LocalDateTime> getStartDateTime() {
        return Optional.ofNullable(startDateTime);
    }
}
