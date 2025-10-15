package routie.business.place.application;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import routie.business.hashtag.domain.Hashtag;
import routie.business.hashtag.domain.HashtagRepository;
import routie.business.place.domain.Place;
import routie.business.place.domain.PlaceRepository;
import routie.business.place.ui.dto.request.PlaceCreateRequest;
import routie.business.place.ui.dto.request.PlaceCreateRequestV2;
import routie.business.place.ui.dto.request.UpdateHashtagsRequest;
import routie.business.place.ui.dto.response.PlaceCreateResponse;
import routie.business.place.ui.dto.response.PlaceListResponse;
import routie.business.place.ui.dto.response.PlaceListResponseV2;
import routie.business.place.ui.dto.response.PlaceListResponseV2.PlaceCardResponseV2;
import routie.business.place.ui.dto.response.PlaceReadResponse;
import routie.business.place.ui.dto.response.UpdateHashtagsResponse;
import routie.business.like.domain.PlaceLikeRepository;
import routie.business.routie.domain.RoutiePlaceRepository;
import routie.business.routiespace.domain.RoutieSpace;
import routie.business.routiespace.domain.RoutieSpaceRepository;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PlaceService {

    private final PlaceRepository placeRepository;
    private final RoutieSpaceRepository routieSpaceRepository;
    private final RoutiePlaceRepository routiePlaceRepository;
    private final PlaceLikeRepository placeLikeRepository;
    private final HashtagRepository hashtagRepository;

    public PlaceReadResponse getPlace(final String routieSpaceIdentifier, final long placeId) {
        final RoutieSpace routieSpace = getRoutieSpaceByIdentifier(routieSpaceIdentifier);
        final Place place = getPlaceByIdAndRoutieSpace(placeId, routieSpace);
        return PlaceReadResponse.from(place);
    }

    @Transactional
    public PlaceCreateResponse addPlace(
            final String routieSpaceIdentifier,
            final PlaceCreateRequest placeCreateRequest
    ) {
        final RoutieSpace routieSpace = routieSpaceRepository.findByIdentifier(routieSpaceIdentifier)
                .orElseThrow(() -> new BusinessException(ErrorCode.ROUTIE_SPACE_NOT_FOUND));

        final Place place = Place.create(
                placeCreateRequest.name(),
                placeCreateRequest.roadAddressName(),
                placeCreateRequest.addressName(),
                placeCreateRequest.longitude(),
                placeCreateRequest.latitude(),
                routieSpace
        );
        return new PlaceCreateResponse(placeRepository.save(place).getId());
    }

    @Transactional
    public PlaceCreateResponse addPlaceV2(
            final String routieSpaceIdentifier,
            final PlaceCreateRequestV2 placeCreateRequest
    ) {
        final RoutieSpace routieSpace = routieSpaceRepository.findByIdentifier(routieSpaceIdentifier)
                .orElseThrow(() -> new BusinessException(ErrorCode.ROUTIE_SPACE_NOT_FOUND));

        final Place place = Place.create(
                placeCreateRequest.name(),
                placeCreateRequest.roadAddressName(),
                placeCreateRequest.addressName(),
                placeCreateRequest.longitude(),
                placeCreateRequest.latitude(),
                routieSpace
        );

        final List<Hashtag> hashtags = convertNamesToHashtags(placeCreateRequest.hashtags(), routieSpace);
        place.addHashtags(hashtags);

        return new PlaceCreateResponse(placeRepository.save(place).getId());
    }

    @Transactional
    public UpdateHashtagsResponse modifyHashtags(
            final String routieSpaceIdentifier,
            final long placeId,
            final UpdateHashtagsRequest updateHashtagsRequest
    ) {
        final RoutieSpace routieSpace = getRoutieSpaceByIdentifier(routieSpaceIdentifier);
        final Place place = getPlaceByIdAndRoutieSpace(placeId, routieSpace);

        final List<Hashtag> newHashtags = convertNamesToHashtags(updateHashtagsRequest.hashtags(), routieSpace);
        place.updateHashtags(newHashtags);

        final List<String> updatedHashTagNames = place.getHashtags().stream()
                .map(Hashtag::getName)
                .toList();

        return new UpdateHashtagsResponse(updatedHashTagNames);
    }

    private List<Hashtag> convertNamesToHashtags(final List<String> hashTagNames, final RoutieSpace routieSpace) {
        final Set<String> distinctHashTagNames = new HashSet<>(hashTagNames);
        if (distinctHashTagNames.size() != hashTagNames.size()) {
            throw new BusinessException(ErrorCode.HASHTAG_DUPLICATED);
        }
        return hashTagNames.stream()
                .map(hashTagName -> getOrCreateHashtag(hashTagName, routieSpace))
                .toList();
    }

    private Hashtag getOrCreateHashtag(final String name, final RoutieSpace routieSpace) {
        return hashtagRepository.findByRoutieSpaceAndName(routieSpace, name)
                .orElseGet(() -> hashtagRepository.save(new Hashtag(name, routieSpace)));
    }

    public PlaceListResponse readPlaces(final String routieSpaceIdentifier) {
        final RoutieSpace routieSpace = routieSpaceRepository.findByIdentifier(routieSpaceIdentifier)
                .orElseThrow(() -> new BusinessException(ErrorCode.ROUTIE_SPACE_NOT_FOUND));
        final List<Place> places = routieSpace.getPlaces();
        return PlaceListResponse.from(places);
    }

    public PlaceListResponseV2 readPlacesV2(final String routieSpaceIdentifier) {
        final RoutieSpace routieSpace = routieSpaceRepository.findByIdentifier(routieSpaceIdentifier)
                .orElseThrow(() -> new BusinessException(ErrorCode.ROUTIE_SPACE_NOT_FOUND));
        final List<Place> places = routieSpace.getPlaces();

        final List<PlaceCardResponseV2> placeCardResponses = places.stream()
                .map(place -> PlaceCardResponseV2.createPlaceWithLikeCount(
                        place,
                        placeLikeRepository.countByPlace(place)
                ))
                .toList();

        return new PlaceListResponseV2(placeCardResponses);
    }

    @Transactional
    public void removePlace(final String routieSpaceIdentifier, final long placeId) {
        final RoutieSpace routieSpace = getRoutieSpaceByIdentifier(routieSpaceIdentifier);
        if (!placeRepository.existsByIdAndRoutieSpace(placeId, routieSpace)) {
            throw new BusinessException(ErrorCode.PLACE_NOT_FOUND);
        }
        if (routiePlaceRepository.existsRoutiePlaceByPlaceId(placeId)) {
            throw new BusinessException(ErrorCode.ROUTIE_PLACE_EXIST);
        }
        placeLikeRepository.deleteByPlaceId(placeId);
        placeRepository.deleteById(placeId);
    }

    private RoutieSpace getRoutieSpaceByIdentifier(final String routieSpaceIdentifier) {
        return routieSpaceRepository.findByIdentifier(routieSpaceIdentifier)
                .orElseThrow(() -> new BusinessException(ErrorCode.ROUTIE_SPACE_NOT_FOUND));
    }

    public Place getPlaceByIdAndRoutieSpace(final long placeId, final RoutieSpace routieSpace) {
        return placeRepository.findByIdAndRoutieSpace(placeId, routieSpace)
                .orElseThrow(() -> new BusinessException(ErrorCode.PLACE_NOT_FOUND));
    }
}
