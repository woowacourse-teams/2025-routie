package routie.place.domain;

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
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import routie.exception.BusinessException;
import routie.exception.ErrorCode;
import routie.routiespace.domain.RoutieSpace;

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

    @Column(name = "stay_duration_minutes", nullable = false)
    private Integer stayDurationMinutes;

    @Column(name = "open_at")
    private LocalTime openAt;

    @Column(name = "close_at")
    private LocalTime closeAt;

    @Column(name = "break_start_at")
    private LocalTime breakStartAt;

    @Column(name = "break_end_at")
    private LocalTime breakEndAt;

    @ManyToOne
    @JoinColumn(name = "routie_space_id")
    private RoutieSpace routieSpace;

    @OneToMany(cascade = {CascadeType.PERSIST, CascadeType.REMOVE}, orphanRemoval = true)
    @JoinColumn(name = "place_id", nullable = false)
    private List<PlaceClosedDayOfWeek> placeClosedDayOfWeeks = new ArrayList<>();

    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Place(
            final String name,
            final String roadAddressName,
            final String addressName,
            final Double longitude,
            final Double latitude,
            final int stayDurationMinutes,
            final LocalTime openAt,
            final LocalTime closeAt,
            final LocalTime breakStartAt,
            final LocalTime breakEndAt,
            final RoutieSpace routieSpace,
            final List<PlaceClosedDayOfWeek> placeClosedDayOfWeeks
    ) {
        validateName(name);
        validateRoadAddressName(roadAddressName);
        validateAddressName(addressName);
        validateLongitude(longitude);
        validateLatitude(latitude);
        validateStayDurationMinutes(stayDurationMinutes);
        validateOperatingTime(openAt, closeAt);
        validateBreakTime(breakStartAt, breakEndAt);
        validateBreakTimeWithOperatingTime(openAt, closeAt, breakStartAt, breakEndAt);

        this.name = name;
        this.roadAddressName = roadAddressName;
        this.addressName = addressName;
        this.longitude = longitude;
        this.latitude = latitude;
        this.stayDurationMinutes = stayDurationMinutes;
        this.openAt = openAt;
        this.closeAt = closeAt;
        this.breakStartAt = breakStartAt;
        this.breakEndAt = breakEndAt;
        this.routieSpace = routieSpace;
        this.placeClosedDayOfWeeks = placeClosedDayOfWeeks;
    }

    public static Place create(
            final String name,
            final String roadAddressName,
            final String addressName,
            final Double longitude,
            final Double latitude,
            final int stayDurationMinutes,
            final LocalTime openAt,
            final LocalTime closeAt,
            final LocalTime breakStartAt,
            final LocalTime breakEndAt,
            final RoutieSpace routieSpace,
            final List<DayOfWeek> closedDayOfWeeks
    ) {
        List<PlaceClosedDayOfWeek> placeClosedDayOfWeeks = createClosedDayOfWeeks(closedDayOfWeeks);
        return new Place(
                name,
                roadAddressName,
                addressName,
                longitude,
                latitude,
                stayDurationMinutes,
                openAt,
                closeAt,
                breakStartAt,
                breakEndAt,
                routieSpace,
                placeClosedDayOfWeeks
        );
    }

    private static List<PlaceClosedDayOfWeek> createClosedDayOfWeeks(final List<DayOfWeek> closedDayOfWeeks) {
        if (closedDayOfWeeks == null) {
            return List.of();
        }
        return closedDayOfWeeks.stream()
                .map(PlaceClosedDayOfWeek::new)
                .toList();
    }

    public void modify(
            final int stayDurationMinutes,
            final LocalTime openAt,
            final LocalTime closeAt,
            final LocalTime breakStartAt,
            final LocalTime breakEndAt,
            final List<DayOfWeek> closedDayOfWeeks
    ) {
        validateStayDurationMinutes(stayDurationMinutes);
        validateBreakTime(breakStartAt, breakEndAt);
        validateOperatingTime(openAt, closeAt);
        validateBreakTimeWithOperatingTime(openAt, closeAt, breakStartAt, breakEndAt);

        this.stayDurationMinutes = stayDurationMinutes;
        this.openAt = openAt;
        this.closeAt = closeAt;
        this.breakStartAt = breakStartAt;
        this.breakEndAt = breakEndAt;
        this.placeClosedDayOfWeeks.clear();
        this.placeClosedDayOfWeeks.addAll(createClosedDayOfWeeks(closedDayOfWeeks));
    }

    private void validateStayDurationMinutes(final int stayDurationMinutes) {
        if (stayDurationMinutes < 0 || stayDurationMinutes > 1440) {
            throw new BusinessException(ErrorCode.PLACE_STAY_DURATION_INVALID);
        }
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

    private void validateOperatingTime(final LocalTime openAt, final LocalTime closeAt) {
        boolean hasOpenAt = openAt != null;
        boolean hasCloseAt = closeAt != null;

        if (hasOpenAt != hasCloseAt) {
            throw new BusinessException(ErrorCode.PLACE_BUSINESS_HOURS_INCOMPLETE);
        }
    }

    private void validateBreakTime(final LocalTime breakStartAt, final LocalTime breakEndAt) {
        boolean hasBreakStart = breakStartAt != null;
        boolean hasBreakEnd = breakEndAt != null;

        if (hasBreakStart != hasBreakEnd) {
            throw new BusinessException(ErrorCode.PLACE_BREAK_TIME_INCOMPLETE);
        }
    }

    private void validateBreakTimeWithOperatingTime(
            final LocalTime openAt,
            final LocalTime closeAt,
            final LocalTime breakStartAt,
            final LocalTime breakEndAt
    ) {
        if (openAt == null || closeAt == null) {
            return;
        }
        if (breakStartAt == null || breakEndAt == null) {
            return;
        }
        if (openAt.equals(closeAt)) {
            return;
        }
        if (breakStartAt.isBefore(openAt) || breakEndAt.isAfter(closeAt)) {
            throw new BusinessException(ErrorCode.PLACE_BREAK_TIME_OUTSIDE_BUSINESS_HOURS);
        }
    }
}
