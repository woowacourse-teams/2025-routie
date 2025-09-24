package routie.business.word.domain;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WordRepository extends JpaRepository<Word, Long> {

    List<Word> findAllByWordType(WordType wordType);

    void deleteAllByWordType(WordType wordType);
}
