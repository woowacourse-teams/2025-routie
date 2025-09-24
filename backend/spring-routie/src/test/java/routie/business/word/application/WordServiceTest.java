package routie.business.word.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import routie.business.word.domain.Word;
import routie.business.word.domain.WordRepository;
import routie.business.word.domain.WordType;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class WordServiceTest {

    @Autowired
    private WordService wordService;

    @Autowired
    private WordRepository wordRepository;

    @Test
    @DisplayName("특정 타입의 단어 목록을 조회한다.")
    void getWords() {
        // given
        wordRepository.save(new Word(WordType.ADJECTIVE, "행복한"));
        wordRepository.save(new Word(WordType.ADJECTIVE, "즐거운"));
        wordRepository.save(new Word(WordType.NOUN, "하루"));

        // when
        final List<Word> adjectives = wordService.getWords(WordType.ADJECTIVE);
        final List<Word> nouns = wordService.getWords(WordType.NOUN);

        // then
        assertThat(adjectives).hasSize(2);
        assertThat(nouns).hasSize(1);
    }

    @Test
    @DisplayName("새로운 단어를 추가한다.")
    void addWord() {
        // given
        final WordType wordType = WordType.ADJECTIVE;
        final String content = "새로운";

        // when
        final Word savedWord = wordService.addWord(wordType, content);

        // then
        assertThat(savedWord.getId()).isNotNull();
        assertThat(savedWord.getWordType()).isEqualTo(wordType);
        assertThat(savedWord.getContent()).isEqualTo(content);

        final Word foundWord = wordRepository.findById(savedWord.getId()).orElseThrow();
        assertThat(foundWord).isEqualTo(savedWord);
    }

    @Test
    @DisplayName("ID로 특정 단어를 삭제한다.")
    void deleteWord() {
        // given
        final Word savedWord = wordRepository.save(new Word(WordType.NOUN, "삭제될단어"));
        final Long wordId = savedWord.getId();

        // when
        wordService.deleteWord(wordId);

        // then
        assertThat(wordRepository.findById(wordId)).isEmpty();
    }

    @Test
    @DisplayName("특정 타입의 단어 전체를 새로운 목록으로 덮어쓴다.")
    void replaceAllWords() {
        // given
        wordRepository.save(new Word(WordType.ADJECTIVE, "오래된1"));
        wordRepository.save(new Word(WordType.ADJECTIVE, "오래된2"));
        wordRepository.save(new Word(WordType.NOUN, "유지될단어"));

        final List<String> newContents = List.of("새로운1", "새로운2", "새로운3");

        // when
        final List<Word> replacedWords = wordService.replaceAllWords(WordType.ADJECTIVE, newContents);

        // then
        assertThat(replacedWords).hasSize(3);
        assertThat(replacedWords.get(0).getContent()).isEqualTo("새로운1");

        final List<Word> adjectives = wordRepository.findAllByWordType(WordType.ADJECTIVE);
        assertThat(adjectives).hasSize(3);
        assertThat(adjectives.stream().map(Word::getContent)).containsExactlyInAnyOrder("새로운1", "새로운2", "새로운3");

        final List<Word> nouns = wordRepository.findAllByWordType(WordType.NOUN);
        assertThat(nouns).hasSize(1);
        assertThat(nouns.get(0).getContent()).isEqualTo("유지될단어");
    }

    @Test
    @DisplayName("닉네임을 성공적으로 생성한다.")
    void getNickname_success() {
        // given
        wordRepository.save(new Word(WordType.ADJECTIVE, "행복한"));
        wordRepository.save(new Word(WordType.NOUN, "하루"));

        // when
        final String nickname = wordService.getNickname();

        // then
        assertThat(nickname).isEqualTo("행복한 하루");
    }

    @Test
    @DisplayName("닉네임 생성 시 형용사가 없으면 예외가 발생한다.")
    void getNickname_throwsException_whenAdjectiveNotFound() {
        // given
        wordRepository.save(new Word(WordType.NOUN, "하루"));

        // when & then
        assertThatThrownBy(() -> wordService.getNickname())
                .isInstanceOf(BusinessException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.ADJECTIVE_NOT_FOUND);
    }

    @Test
    @DisplayName("닉네임 생성 시 명사가 없으면 예외가 발생한다.")
    void getNickname_throwsException_whenNounNotFound() {
        // given
        wordRepository.save(new Word(WordType.ADJECTIVE, "행복한"));

        // when & then
        assertThatThrownBy(() -> wordService.getNickname())
                .isInstanceOf(BusinessException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.NOUN_NOT_FOUND);
    }
}
