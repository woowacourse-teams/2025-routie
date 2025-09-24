package routie.business.word.ui.v1;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import routie.business.word.application.WordService;
import routie.business.word.domain.Word;
import routie.business.word.domain.WordType;
import routie.business.word.ui.dto.NicknameResponse;
import routie.business.word.ui.dto.WordCreateRequest;
import routie.business.word.ui.dto.WordReplaceRequest;
import routie.business.word.ui.dto.WordResponse;

@RestController
@RequestMapping("/v1/words")
@RequiredArgsConstructor
public class WordControllerV1 {

    private final WordService wordService;

    @GetMapping("/nickname")
    public ResponseEntity<NicknameResponse> getNickname() {
        final String nickname = wordService.getNickname();
        final NicknameResponse response = new NicknameResponse(nickname);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{wordType}")
    public ResponseEntity<List<WordResponse>> getWords(@PathVariable final WordType wordType) {
        final List<Word> words = wordService.getWords(wordType);
        final List<WordResponse> responses = words.stream()
                .map(WordResponse::from)
                .toList();
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/{wordType}")
    public ResponseEntity<Void> addWord(
            @PathVariable final WordType wordType,
            @Valid @RequestBody final WordCreateRequest request
    ) {
        final Word savedWord = wordService.addWord(wordType, request.content());
        final URI location = URI.create(String.format("/v1/words/%s/%d", wordType.name(), savedWord.getId()));
        return ResponseEntity.created(location).build();
    }

    @DeleteMapping("/{wordType}/{wordId}")
    public ResponseEntity<Void> deleteWord(
            @PathVariable final WordType wordType,
            @PathVariable final Long wordId
    ) {
        wordService.deleteWord(wordId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{wordType}")
    public ResponseEntity<List<WordResponse>> replaceAllWords(
            @PathVariable final WordType wordType,
            @Valid @RequestBody final WordReplaceRequest request
    ) {
        final List<Word> words = wordService.replaceAllWords(wordType, request.contents());
        final List<WordResponse> responses = words.stream()
                .map(WordResponse::from)
                .toList();
        return ResponseEntity.ok(responses);
    }
}
