package routie.routie.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import routie.place.domain.Place;

@Getter
@Embeddable
@AllArgsConstructor(access = AccessLevel.PACKAGE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Routie {

    @OneToMany(cascade = {CascadeType.PERSIST, CascadeType.REMOVE})
    @JoinColumn(name = "routie_space_id", nullable = false)
    private List<RoutiePlace> routiePlaces = new ArrayList<>();

    public static Routie empty() {
        return new Routie(new ArrayList<>());
    }

    public static Routie create(final List<RoutiePlace> routiePlaces) {
        return new Routie(routiePlaces);
    }

    public RoutiePlace createLastRoutiePlace(final Place place) {
        validatePlace(place);
        RoutiePlace routiePlace = new RoutiePlace(getLastSequence() + 1, place);
        routiePlaces.add(routiePlace);
        return routiePlace;
    }

    private void validatePlace(final Place place) {
        if (this.containsPlace(place)) {
            throw new IllegalArgumentException("이미 등록된 장소입니다.");
        }
    }

    private boolean containsPlace(final Place place) {
        return routiePlaces.stream()
                .anyMatch(routiePlace -> routiePlace.getPlace().equals(place));
    }

    private int getLastSequence() {
        return routiePlaces.stream()
                .mapToInt(RoutiePlace::getSequence)
                .max()
                .orElse(0);
    }
}
