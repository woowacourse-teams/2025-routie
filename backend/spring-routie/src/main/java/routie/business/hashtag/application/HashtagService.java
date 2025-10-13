package routie.business.hashtag.application;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import routie.business.hashtag.domain.Hashtag;
import routie.business.hashtag.domain.HashtagRepository;
import routie.business.hashtag.ui.dto.response.HashtagsResponse;
import routie.business.routiespace.domain.RoutieSpace;
import routie.business.routiespace.domain.RoutieSpaceRepository;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HashtagService {

    private final HashtagRepository hashtagRepository;
    private final RoutieSpaceRepository routieSpaceRepository;

    public HashtagsResponse getHashtagsByRoutieSpace(final String routieSpaceIdentifier) {
        RoutieSpace routieSpace = routieSpaceRepository.findByIdentifier(routieSpaceIdentifier)
                .orElseThrow(() -> new BusinessException(ErrorCode.ROUTIE_SPACE_NOT_FOUND));

        List<Hashtag> hashtags = hashtagRepository.findByRoutieSpaceId(routieSpace.getId());

        List<String> distinctHashtagNames = hashtags.stream()
                .map(Hashtag::getName)
                .distinct()
                .sorted()
                .toList();

        return new HashtagsResponse(distinctHashtagNames);
    }
}
