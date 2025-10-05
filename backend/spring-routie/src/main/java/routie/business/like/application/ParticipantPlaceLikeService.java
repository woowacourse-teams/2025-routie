// ParticipantPlaceLikeService.java (Refactored)
package routie.business.like.application;

import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import routie.business.authentication.domain.Role;
import routie.business.like.ui.dto.response.LikedPlacesResponse;
import routie.business.participant.domain.Participant;

@Service
@RequiredArgsConstructor
public class ParticipantPlaceLikeService {

    private final List<PlaceLikeService<? extends Participant>> services;
    private Map<Role, PlaceLikeService<? extends Participant>> serviceMap;

    @PostConstruct
    void init() {
        serviceMap = services.stream().collect(Collectors.toMap(PlaceLikeService::getRole, Function.identity()));
    }

    public void addPlaceLike(final Long placeId, final String routieSpaceIdentifier, final Participant participant) {
        findService(participant).likePlace(placeId, routieSpaceIdentifier, participant);
    }

    public void removePlaceLike(final Long placeId, final String routieSpaceIdentifier, final Participant participant) {
        findService(participant).removePlaceLike(placeId, routieSpaceIdentifier, participant);
    }

    public LikedPlacesResponse getLikedPlaces(final String routieSpaceIdentifier, final Participant participant) {
        return findService(participant).getLikedPlaces(routieSpaceIdentifier, participant);
    }

    @SuppressWarnings("unchecked")
    private PlaceLikeService<Participant> findService(final Participant participant) {
        return (PlaceLikeService<Participant>) serviceMap.get(participant.getRole());
    }
}
