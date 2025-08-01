package routie.place.domain;

public interface DurationCalculator {

    boolean supportsStrategy(MovingStrategy movingStrategy);

    int calculateDuration(Place from, Place to, MovingStrategy movingStrategy);
}
