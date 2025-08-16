package routie.routie.domain.route;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import lombok.Getter;
import routie.place.domain.MovingStrategy;
import routie.routie.domain.RoutiePlace;

@Getter
public class RouteCalculationContext {

    private final List<RoutiePlace> routiePlaces;
    private final MovingStrategy movingStrategy;
    private final Optional<LocalDateTime> startDateTime;

    public RouteCalculationContext(
            final List<RoutiePlace> routiePlaces,
            final MovingStrategy movingStrategy,
            final LocalDateTime startDateTime
    ) {
        this.routiePlaces = routiePlaces;
        this.movingStrategy = movingStrategy;
        this.startDateTime = Optional.ofNullable(startDateTime);
    }

}
