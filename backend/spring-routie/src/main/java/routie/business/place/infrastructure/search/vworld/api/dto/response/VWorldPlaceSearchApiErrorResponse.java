package routie.business.place.infrastructure.search.vworld.api.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import java.io.IOException;

@JsonDeserialize(using = VWorldPlaceSearchApiErrorResponse.Deserializer.class)
public record VWorldPlaceSearchApiErrorResponse(
        @JsonProperty("level") Integer level,
        @JsonProperty("code") String code,
        @JsonProperty("text") String text
) {

    static class Deserializer extends JsonDeserializer<VWorldPlaceSearchApiErrorResponse> {

        @Override
        public VWorldPlaceSearchApiErrorResponse deserialize(final JsonParser p, final DeserializationContext ctxt)
                throws IOException {
            JsonNode errorNode = parseErrorNode(p);
            return new VWorldPlaceSearchApiErrorResponse(
                    errorNode.path("level").isMissingNode() ? null : errorNode.get("level").asInt(),
                    errorNode.path("code").asText(null),
                    errorNode.path("text").asText(null)
            );
        }

        private JsonNode parseErrorNode(final JsonParser jsonParser) throws IOException {
            JsonNode root = jsonParser.getCodec().readTree(jsonParser);
            return root.path("response").path("error");
        }
    }
}
