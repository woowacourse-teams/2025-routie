package routie.place.domain;

public interface DistanceCalculator {

    boolean supportsStrategy(MovingStrategy movingStrategy);

    int calculateDistance(Place from, Place to, MovingStrategy movingStrategy);
}
