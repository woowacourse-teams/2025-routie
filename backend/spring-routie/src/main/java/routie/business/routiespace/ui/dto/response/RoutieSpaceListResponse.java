package routie.business.routiespace.ui.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import java.util.List;
import routie.business.routiespace.domain.RoutieSpace;

public record RoutieSpaceListResponse(
        List<RoutieSpaceResponse> routieSpaces
) {

    public static RoutieSpaceListResponse from(final List<RoutieSpace> routieSpaces) {
        List<RoutieSpaceResponse> routieSpaceResponses = routieSpaces.stream()
                .map(RoutieSpaceResponse::from)
                .toList();

        return new RoutieSpaceListResponse(routieSpaceResponses);
    }

    public record RoutieSpaceResponse(
            String identifier,
            String name,
            @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
            LocalDateTime createdTime
    ) {

        public static RoutieSpaceResponse from(final RoutieSpace routieSpace) {
            return new RoutieSpaceResponse(
                    routieSpace.getIdentifier(),
                    routieSpace.getName(),
                    routieSpace.getCreatedAt()
            );
        }
    }
}
