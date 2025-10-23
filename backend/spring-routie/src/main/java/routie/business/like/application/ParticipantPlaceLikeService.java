package routie.business.like.application;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import routie.business.authentication.domain.Role;
import routie.business.like.ui.dto.response.LikedPlacesResponse;
import routie.business.participant.domain.Participant;
import routie.business.place.domain.event.PlaceUpdateEvent;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ParticipantPlaceLikeService {

    private final ApplicationEventPublisher applicationEventPublisher;
    private final Map<Role, PlaceLikeService<? extends Participant>> serviceMap;

    public ParticipantPlaceLikeService(
            final ApplicationEventPublisher applicationEventPublisher,
            final List<PlaceLikeService<? extends Participant>> services
    ) {
        this.applicationEventPublisher = applicationEventPublisher;
        this.serviceMap = services.stream()
                .collect(Collectors.toMap(PlaceLikeService::getRole, Function.identity()));
    }

    @Transactional
    public void addPlaceLike(final Long placeId, final String routieSpaceIdentifier, final Participant participant) {
        findService(participant).likePlace(placeId, routieSpaceIdentifier, participant);
        applicationEventPublisher.publishEvent(new PlaceUpdateEvent(this, placeId, routieSpaceIdentifier));
    }

    @Transactional
    public void removePlaceLike(final Long placeId, final String routieSpaceIdentifier, final Participant participant) {
        findService(participant).removePlaceLike(placeId, routieSpaceIdentifier, participant);
        applicationEventPublisher.publishEvent(new PlaceUpdateEvent(this, placeId, routieSpaceIdentifier));
    }

    public LikedPlacesResponse getLikedPlaces(final String routieSpaceIdentifier, final Participant participant) {
        return findService(participant).getLikedPlaces(routieSpaceIdentifier, participant);
    }

    @SuppressWarnings("unchecked")
    private PlaceLikeService<Participant> findService(final Participant participant) {
        return (PlaceLikeService<Participant>) serviceMap.get(participant.getRole());
    }
}
