package routie.place.domain;

public interface TravelTimeCalculator {

    boolean supportsStrategy(MovingStrategy movingStrategy);

    int calculateTravelTime(Place from, Place to, MovingStrategy movingStrategy);
}
