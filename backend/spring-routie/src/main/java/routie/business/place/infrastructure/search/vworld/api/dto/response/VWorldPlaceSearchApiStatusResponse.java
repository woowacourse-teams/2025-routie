package routie.business.place.infrastructure.search.vworld.api.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import java.io.IOException;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@JsonDeserialize(using = VWorldPlaceSearchApiStatusResponse.Deserializer.class)
public record VWorldPlaceSearchApiStatusResponse(
        @JsonProperty("status") Status status
) {

    public boolean isSuccess() {
        return status.isSuccess();
    }

    @Getter
    @RequiredArgsConstructor
    private enum Status {
        OK(true),
        NOT_FOUND(true),
        ERROR(false);

        private final boolean isSuccess;
    }

    static class Deserializer extends JsonDeserializer<VWorldPlaceSearchApiStatusResponse> {

        @Override
        public VWorldPlaceSearchApiStatusResponse deserialize(final JsonParser p, final DeserializationContext ctxt)
                throws IOException {
            final JsonNode errorNode = parseErrorNode(p);
            return new VWorldPlaceSearchApiStatusResponse(Status.valueOf(errorNode.asText(null)));
        }

        private JsonNode parseErrorNode(final JsonParser jsonParser) throws IOException {
            final JsonNode root = jsonParser.getCodec().readTree(jsonParser);
            return root.path("response").path("status");
        }
    }
}
