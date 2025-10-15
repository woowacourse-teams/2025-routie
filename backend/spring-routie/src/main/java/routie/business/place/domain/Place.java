package routie.business.place.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import routie.business.hashtag.domain.Hashtag;
import routie.business.routiespace.domain.RoutieSpace;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

@Entity
@Getter
@Table(name = "places")
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor(access = AccessLevel.PACKAGE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Place {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "road_address_name")
    private String roadAddressName;

    @Column(name = "address_name", nullable = false)
    private String addressName;

    @Column(name = "longitude", nullable = false)
    private Double longitude;

    @Column(name = "latitude", nullable = false)
    private Double latitude;

    @ManyToOne
    @JoinColumn(name = "routie_space_id")
    private RoutieSpace routieSpace;

    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "place", cascade = {CascadeType.PERSIST, CascadeType.REMOVE}, orphanRemoval = true)
    private List<PlaceHashtag> placeHashtags = new ArrayList<>();

    public Place(
            final String name,
            final String roadAddressName,
            final String addressName,
            final Double longitude,
            final Double latitude,
            final RoutieSpace routieSpace
    ) {
        validateName(name);
        validateRoadAddressName(roadAddressName);
        validateAddressName(addressName);
        validateLongitude(longitude);
        validateLatitude(latitude);

        this.name = name;
        this.roadAddressName = roadAddressName;
        this.addressName = addressName;
        this.longitude = longitude;
        this.latitude = latitude;
        this.routieSpace = routieSpace;
    }

    public static Place create(
            final String name,
            final String roadAddressName,
            final String addressName,
            final Double longitude,
            final Double latitude,
            final RoutieSpace routieSpace
    ) {
        return new Place(
                name,
                roadAddressName,
                addressName,
                longitude,
                latitude,
                routieSpace
        );
    }

    private void validateName(final String name) {
        if (name == null || name.isBlank()) {
            throw new BusinessException(ErrorCode.PLACE_NAME_REQUIRED);
        }
        if (name.length() > 30) {
            throw new BusinessException(ErrorCode.PLACE_NAME_LENGTH_INVALID);
        }
    }

    private void validateRoadAddressName(final String roadAddressName) {
        if (roadAddressName == null) {
            return;
        }

        if (roadAddressName.isBlank() || roadAddressName.length() > 50) {
            throw new BusinessException(ErrorCode.PLACE_ROAD_ADDRESS_LENGTH_INVALID);
        }
    }

    private void validateAddressName(final String addressName) {
        if (addressName == null || addressName.isBlank()) {
            throw new BusinessException(ErrorCode.PLACE_ADDRESS_REQUIRED);
        }
        if (addressName.length() > 50) {
            throw new BusinessException(ErrorCode.PLACE_ADDRESS_LENGTH_INVALID);
        }
    }

    private void validateLongitude(final double longitude) {
        if (longitude < -180.0 || longitude > 180.0) {
            throw new BusinessException(ErrorCode.PLACE_LONGITUDE_INVALID);
        }
    }

    private void validateLatitude(final double latitude) {
        if (latitude < -90.0 || latitude > 90.0) {
            throw new BusinessException(ErrorCode.PLACE_LATITUDE_INVALID);
        }
    }

    public boolean hasSameCoordinate(final Place otherPlace) {
        return Objects.equals(otherPlace.getLatitude(), latitude)
                && Objects.equals(otherPlace.getLongitude(), longitude);
    }

    public void addHashtags(final List<Hashtag> hashtags) {
        final List<PlaceHashtag> placeHashtags = hashtags.stream()
                .map(hashtag -> new PlaceHashtag(this, hashtag))
                .toList();
        this.placeHashtags.addAll(placeHashtags);
    }

    public void updateHashtags(final List<Hashtag> newHashtags) {
        final Set<String> newHashtagNames = newHashtags.stream()
                .map(Hashtag::getName)
                .collect(Collectors.toSet());
        final Set<String> currentHashtagNames = placeHashtags.stream()
                .map(placeHashtag -> placeHashtag.getHashtag().getName())
                .collect(Collectors.toSet());

        newHashtags.stream()
                .filter(hashtag -> !currentHashtagNames.contains(hashtag.getName()))
                .forEach(hashtag -> placeHashtags.add(new PlaceHashtag(this, hashtag)));

        placeHashtags.removeIf(placeHashtag ->
                !newHashtagNames.contains(placeHashtag.getHashtag().getName())
        );
    }

    public List<Hashtag> getHashtags() {
        return placeHashtags.stream()
                .map(PlaceHashtag::getHashtag)
                .toList();
    }
}
