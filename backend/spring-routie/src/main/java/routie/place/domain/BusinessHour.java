package routie.place.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.time.LocalTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Embeddable
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BusinessHour {

    @Column(name = "open_at", nullable = false)
    private LocalTime openAt;

    @Column(name = "close_at", nullable = false)
    private LocalTime closeAt;

    @Column(name = "break_start_at")
    private LocalTime breakStartAt;

    @Column(name = "break_end_at")
    private LocalTime breakEndAt;

    public BusinessHour(
            final LocalTime openAt,
            final LocalTime closeAt,
            final LocalTime breakStartAt,
            final LocalTime breakEndAt
    ) {
        validate(openAt, closeAt, breakStartAt, breakEndAt);
        this.openAt = openAt;
        this.closeAt = closeAt;
        this.breakStartAt = breakStartAt;
        this.breakEndAt = breakEndAt;
    }

    private void validate(
            final LocalTime openAt,
            final LocalTime closeAt,
            final LocalTime breakStartAt,
            final LocalTime breakEndAt
    ) {
        validateOperatingTime(openAt, closeAt);
        validateBreakTime(breakStartAt, breakEndAt);
        validateBreakTimeWithOperatingTime(openAt, closeAt, breakStartAt, breakEndAt);
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
