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

    @Column(name = "roadAddressName", nullable = false)
    private String roadAddressName;

    @Column(name = "longitude", nullable = false)
    private Double longitude;

    @Column(name = "latitude", nullable = false)
    private Double latitude;

    @Column(name = "stay_duration_minutes", nullable = false)
    private Integer stayDurationMinutes;

    @Column(name = "open_at", nullable = false)
    private LocalTime openAt;

    @Column(name = "close_at", nullable = false)
    private LocalTime closeAt;

    @Column(name = "break_start_at")
    private LocalTime breakStartAt;

    @Column(name = "break_end_at")
    private LocalTime breakEndAt;

    @ManyToOne
    @JoinColumn(name = "routie_space_id")
    private RoutieSpace routieSpace;

    @OneToMany(cascade = {CascadeType.PERSIST, CascadeType.REMOVE})
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
            final double longitude,
            final double latitude,
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
        validateLongitude(longitude);
        validateLatitude(latitude);
        validateStayDurationMinutes(stayDurationMinutes);
        validateOperatingTime(openAt, closeAt);
        validateBreakTime(breakStartAt, breakEndAt);
        validateBreakTimeWithOperatingTime(openAt, closeAt, breakStartAt, breakEndAt);
        this.name = name;
        this.roadAddressName = roadAddressName;
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
            final double longitude,
            final double latitude,
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
            throw new IllegalArgumentException("휴무일은 필수 입력 사항입니다.");
        }
        return closedDayOfWeeks.stream()
                .map(PlaceClosedDayOfWeek::new)
                .toList();
    }

    private void validateLongitude(final double longitude) {
        if (longitude < -180.0 || longitude > 180.0) {
            throw new IllegalArgumentException("경도는 -180.0 이상 180.0 이하이어야 합니다.");
        }
    }

    private void validateLatitude(final double latitude) {
        if (latitude < -90.0 || latitude > 90.0) {
            throw new IllegalArgumentException("위도는 -90.0 이상 90.0 이하이어야 합니다.");
        }
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
        validateOperatingTime(openAt, closeAt);
        validateBreakTime(breakStartAt, breakEndAt);
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
            throw new IllegalArgumentException("체류 시간은 0분 이상 1440분 이하여야 합니다.");
        }
    }

    private void validateName(final String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("장소명은 필수입니다.");
        }
        if (name.length() > 30) {
            throw new IllegalArgumentException("장소명은 1자 이상 30자 이하여야 합니다.");
        }
    }

    private void validateRoadAddressName(final String roadAddressName) {
        if (roadAddressName == null || roadAddressName.isBlank()) {
            throw new IllegalArgumentException("주소는 필수입니다.");
        }
        if (roadAddressName.length() > 50) {
            throw new IllegalArgumentException("주소는 1자 이상 50자 이하여야 합니다.");
        }
    }

    private void validateOperatingTime(final LocalTime openAt, final LocalTime closeAt) {
        if (openAt == null || closeAt == null) {
            throw new IllegalArgumentException("영업 시간은 필수 입력 사항입니다.");
        }
    }

    private void validateBreakTime(final LocalTime breakStartAt, final LocalTime breakEndAt) {
        boolean hasBreakStart = breakStartAt != null;
        boolean hasBreakEnd = breakEndAt != null;

        if (hasBreakStart != hasBreakEnd) {
            throw new IllegalArgumentException("브레이크 타임 시작 시간과 종료 시간은 함께 존재해야 합니다.");
        }
    }

    private void validateBreakTimeWithOperatingTime(
            final LocalTime openAt,
            final LocalTime closeAt,
            final LocalTime breakStartAt,
            final LocalTime breakEndAt
    ) {
        if (breakStartAt == null || breakEndAt == null) {
            return;
        }
        if (openAt.equals(closeAt)) {
            return;
        }
        if (breakStartAt.isBefore(openAt) || breakEndAt.isAfter(closeAt)) {
            throw new IllegalArgumentException("브레이크 타임은 영업 시간 내에 있어야 합니다.");
        }
    }
}
