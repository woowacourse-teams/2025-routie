package routie.business.word.application;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import routie.business.word.domain.Word;
import routie.business.word.domain.WordRepository;
import routie.business.word.domain.WordType;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WordService {

    private final WordRepository wordRepository;

    public List<Word> getWords(final WordType wordType) {
        return wordRepository.findAllByWordType(wordType);
    }

    @Transactional
    public Word addWord(final WordType wordType, final String content) {
        final Word word = new Word(wordType, content);
        return wordRepository.save(word);
    }

    @Transactional
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
}
