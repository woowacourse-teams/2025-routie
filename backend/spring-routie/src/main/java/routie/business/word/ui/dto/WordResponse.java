package routie.business.word.ui.dto;

import routie.business.word.domain.Word;
import routie.business.word.domain.WordType;

public record WordResponse(
        Long id,
        WordType wordType,
        String content
) {
    public static WordResponse from(final Word word) {
        return new WordResponse(word.getId(), word.getWordType(), word.getContent());
    }
}
