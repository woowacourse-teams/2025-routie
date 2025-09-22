CREATE TABLE routie_spaces
(
    created_at DATETIME(6) NULL,
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    updated_at DATETIME(6) NULL,
    identifier VARCHAR(255) NOT NULL,
    name       VARCHAR(255) NOT NULL
);

CREATE TABLE places
(
    break_end_at          TIME(6) NULL,
    break_start_at        TIME(6) NULL,
    close_at              TIME(6) NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    open_at               TIME(6) NULL,
    stay_duration_minutes INT          NOT NULL,
    created_at            DATETIME(6) NULL,
    id                    BIGINT AUTO_INCREMENT PRIMARY KEY,
    routie_space_id       BIGINT NULL,
    updated_at            DATETIME(6) NULL,
    address_name          VARCHAR(255) NOT NULL,
    name                  VARCHAR(255) NOT NULL,
    road_address_name     VARCHAR(255) NULL,
    CONSTRAINT FK_places_routie_space_id FOREIGN KEY (routie_space_id) REFERENCES routie_spaces (id)
);

CREATE TABLE place_closed_dayofweeks
(
    created_at       DATETIME(6) NULL,
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    place_id         BIGINT       NOT NULL,
    closed_dayofweek VARCHAR(255) NOT NULL,
    CONSTRAINT FK_place_closed_dayofweeks_place_id FOREIGN KEY (place_id) REFERENCES places (id)
);

CREATE TABLE routie_places
(
    sequence   INT    NOT NULL,
    created_at DATETIME(6) NULL,
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    place_id   BIGINT NOT NULL,
    routie_space_id BIGINT NOT NULL,
    CONSTRAINT UK_routie_space_place UNIQUE (routie_space_id, place_id),
    CONSTRAINT FK_routie_places_routie_space_id FOREIGN KEY (routie_space_id) REFERENCES routie_spaces (id),
    CONSTRAINT FK_routie_places_place_id FOREIGN KEY (place_id) REFERENCES places (id)
);
