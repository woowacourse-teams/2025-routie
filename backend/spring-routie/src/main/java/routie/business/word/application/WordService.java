package routie.business.word.application;

import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import routie.business.word.domain.Word;
import routie.business.word.domain.WordRepository;
import routie.business.word.domain.WordType;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

@Service
@RequiredArgsConstructor
public class WordService {

    private final WordRepository wordRepository;

    @Transactional(readOnly = true)
    public List<Word> getWords(final WordType wordType) {
        return wordRepository.findAllByWordType(wordType);
    }

    public Word addWord(final WordType wordType, final String content) {
        final Word word = new Word(wordType, content);
        return wordRepository.save(word);
    }

    public void deleteWord(final Long wordId) {
        wordRepository.deleteById(wordId);
    }

    @Transactional
    public List<Word> replaceAllWords(final WordType wordType, final List<String> contents) {
        wordRepository.deleteAllByWordType(wordType);
        final List<Word> words = contents.stream()
                .map(content -> new Word(wordType, content))
                .toList();
        return wordRepository.saveAll(words);
    }

    @Transactional(readOnly = true)
    public String getNickname() {
        final List<Word> adjectives = wordRepository.findAllByWordType(WordType.ADJECTIVE);
        if (adjectives.isEmpty()) {
            throw new BusinessException(ErrorCode.ADJECTIVE_NOT_FOUND);
        }

        final List<Word> nouns = wordRepository.findAllByWordType(WordType.NOUN);
        if (nouns.isEmpty()) {
            throw new BusinessException(ErrorCode.NOUN_NOT_FOUND);
        }

        final Word randomAdjective = adjectives.get(ThreadLocalRandom.current().nextInt(adjectives.size()));
        final Word randomNoun = nouns.get(ThreadLocalRandom.current().nextInt(nouns.size()));

        return randomAdjective.getContent() + " " + randomNoun.getContent();
    }
}
