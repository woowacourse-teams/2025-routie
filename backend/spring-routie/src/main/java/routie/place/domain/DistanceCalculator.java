package routie.place.domain;

public interface DistanceCalculator {

    boolean supportsStrategy(MovingStrategy strategy);

    int calculateDistance(Place from, Place to, MovingStrategy strategy);
}
