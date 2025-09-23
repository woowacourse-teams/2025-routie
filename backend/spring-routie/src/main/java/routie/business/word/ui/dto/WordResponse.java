package routie.business.word.ui.dto;

import lombok.Getter;
import routie.business.word.domain.Word;
import routie.business.word.domain.WordType;

@Getter
public class WordResponse {

    private final Long id;
    private final WordType wordType;
    private final String content;

    private WordResponse(final Long id, final WordType wordType, final String content) {
        this.id = id;
        this.wordType = wordType;
        this.content = content;
    }

    public static WordResponse from(final Word word) {
        return new WordResponse(word.getId(), word.getWordType(), word.getContent());
    }
}
