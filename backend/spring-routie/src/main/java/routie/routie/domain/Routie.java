package routie.routie.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.IntStream;
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

    @OneToMany(cascade = {CascadeType.PERSIST, CascadeType.REMOVE}, orphanRemoval = true)
    @JoinColumn(name = "routie_space_id", nullable = false)
    private List<RoutiePlace> routiePlaces = new ArrayList<>();

    public static Routie empty() {
        return new Routie(new ArrayList<>());
    }

    public static Routie create(final List<RoutiePlace> routiePlaces) {
        return new Routie(routiePlaces);
    }

    public RoutiePlace createLastRoutiePlace(final Place place) {
        validatePlaceAlreadyExists(place);
        RoutiePlace routiePlace = new RoutiePlace(getLastSequence() + 1, place);
        routiePlaces.add(routiePlace);
        return routiePlace;
    }

    private void validatePlaceAlreadyExists(final Place place) {
        if (containsPlace(place)) {
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

    public void removePlace(final Place place) {
        routiePlaces.remove(getRoutiePlaceByPlace(place));
        reorderPlaces();
    }

    private RoutiePlace getRoutiePlaceByPlace(final Place place) {
        return routiePlaces.stream()
                .filter(routiePlace -> routiePlace.getPlace().equals(place))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("루티에 등록되지 않은 장소입니다."));
    }

    // TODO: 추후 성능 이슈가 발생하면 하나의 SQL로 정렬하는 방식으로 변경 필요
    // 현재 방식은 UPDATE 쿼리를 N번 발생시켜 성능에 영향을 줄 수 있음
    // 객체지향 설계 vs 성능 사이의 트레이드오프 존재
    // 현재는 객체지향 설계를 우선시하여 구현
    private void reorderPlaces() {
        routiePlaces.sort(Comparator.comparingInt(RoutiePlace::getSequence));
        IntStream.range(0, routiePlaces.size())
                .forEach(index -> routiePlaces.get(index).updateSequence(index + 1));
    }
}
