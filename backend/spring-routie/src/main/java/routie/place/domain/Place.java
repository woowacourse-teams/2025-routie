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

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "stay_duration_minutes")
    private int stayDurationMinutes;

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

    @OneToMany(cascade = {CascadeType.PERSIST, CascadeType.REMOVE})
    @JoinColumn(name = "place_id", nullable = false)
    private List<PlaceClosedWeekday> closedWeekdays = new ArrayList<>();

    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    Place(
            final String name,
            final String address,
            final int stayDurationMinutes,
            final LocalTime openAt,
            final LocalTime closeAt,
            final LocalTime breakStartAt,
            final LocalTime breakEndAt,
            final RoutieSpace routieSpace,
            final List<PlaceClosedWeekday> closedWeekdays
    ) {
        this(
                null,
                name,
                address,
                stayDurationMinutes,
                openAt,
                closeAt,
                breakStartAt,
                breakEndAt,
                routieSpace,
                closedWeekdays,
                null,
                null
        );
    }

    public static Place create(
            final String name,
            final String address,
            final int stayDurationMinutes,
            final LocalTime openAt,
            final LocalTime closeAt,
            final LocalTime breakStartAt,
            final LocalTime breakEndAt,
            final RoutieSpace routieSpace,
            final List<DayOfWeek> closedDays
    ) {
        validateName(name);
        validateAddress(address);
        validateStayDurationMinutes(stayDurationMinutes);
        validateBreakTime(breakStartAt, breakEndAt);

        List<PlaceClosedWeekday> closedWeekdays = new ArrayList<>();
        if (closedDays != null) {
            closedWeekdays = closedDays.stream()
                    .map(PlaceClosedWeekday::new)
                    .toList();
        }

        return new Place(
                name,
                address,
                stayDurationMinutes,
                openAt,
                closeAt,
                breakStartAt,
                breakEndAt,
                routieSpace,
                closedWeekdays
        );
    }

    public void modify(
            final int stayDurationMinutes,
            final LocalTime openAt,
            final LocalTime closeAt,
            final LocalTime breakStartAt,
            final LocalTime breakEndAt,
            final List<DayOfWeek> closedDays
    ) {
        validateStayDurationMinutes(stayDurationMinutes);
        validateBreakTime(breakStartAt, breakEndAt);

        this.stayDurationMinutes = stayDurationMinutes;
        this.openAt = openAt;
        this.closeAt = closeAt;
        this.breakStartAt = breakStartAt;
        this.breakEndAt = breakEndAt;
        this.closedWeekdays.clear();
        if (closedDays != null) {
            closedDays.forEach(
                    day -> this.closedWeekdays.add(new PlaceClosedWeekday(day))
            );
        }
    }

    private static void validateStayDurationMinutes(final int stayDurationMinutes) {
        if (stayDurationMinutes < 0 || stayDurationMinutes > 1440) {
            throw new IllegalArgumentException("체류 시간은 0분 이상 1440분 이하여야 합니다.");
        }
    }

    private static void validateName(final String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("장소명은 필수입니다.");
        }
        if (name.length() > 30) {
            throw new IllegalArgumentException("장소명은 1자 이상 30자 이하여야 합니다.");
        }
    }

    private static void validateAddress(final String address) {
        if (address == null || address.isBlank()) {
            throw new IllegalArgumentException("주소는 필수입니다.");
        }
        if (address.length() > 50) {
            throw new IllegalArgumentException("주소는 1자 이상 50자 이하여야 합니다.");
        }
    }

    private static void validateBreakTime(final LocalTime breakStartAt, final LocalTime breakEndAt) {
        boolean hasBreakStart = breakStartAt != null;
        boolean hasBreakEnd = breakEndAt != null;

        if (hasBreakStart != hasBreakEnd) {
            throw new IllegalArgumentException("브레이크 타임 시작 시간과 종료 시간은 함께 존재해야 합니다.");
        }
    }
}
