package routie.place.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
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

    @OneToMany
    @JoinColumn(name = "place_id", nullable = false)
    private List<PlaceClosedWeekday> closedWeekdays = new ArrayList<>();

    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Place(
            final String name,
            final String address,
            final int stayDurationMinutes,
            final LocalTime openAt,
            final LocalTime closeAt,
            final LocalTime breakStartAt,
            final LocalTime breakEndAt,
            final List<PlaceClosedWeekday> closedWeekdays,
            final LocalDateTime createdAt,
            final LocalDateTime updatedAt
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
                closedWeekdays,
                createdAt,
                updatedAt
        );
    }
}
