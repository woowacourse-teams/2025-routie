package routie.place.domain;

public interface TravelTimeCalculator {

    boolean supportsStrategy(MovingStrategy strategy);

    int calculateTravelTime(Place from, Place to, MovingStrategy strategy);
}
