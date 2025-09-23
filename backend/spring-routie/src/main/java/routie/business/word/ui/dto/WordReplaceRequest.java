package routie.business.word.ui.dto;

import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class WordReplaceRequest {

    private List<String> contents;
}
