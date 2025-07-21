-- 1. routie_spaces 테이블
CREATE TABLE `routie_spaces`
(
    `id`         BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name`       VARCHAR(255) NOT NULL,
    `identifier` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP    NULL,
    `updated_at` TIMESTAMP    NULL
);

-- 2. places 테이블
CREATE TABLE `places`
(
    `id`                    BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name`                  VARCHAR(255) NOT NULL,
    `address`               VARCHAR(255) NOT NULL,
    `stay_duration_minutes` INT          NULL,
    `open_at`               TIME         NULL,
    `close_at`              TIME         NULL,
    `break_start_at`        TIME         NULL,
    `break_end_at`          TIME         NULL,
    `created_at`            TIMESTAMP    NULL,
    `updated_at`            TIMESTAMP    NULL,
    `routie_space_id`       BIGINT       NULL,

    CONSTRAINT `fk_places_routie_space`
        FOREIGN KEY (`routie_space_id`)
            REFERENCES `routie_spaces` (`id`)
);

-- 3. routies 테이블
CREATE TABLE `routies`
(
    `id`              BIGINT AUTO_INCREMENT PRIMARY KEY,
    `created_at`      TIMESTAMP NULL,
    `routie_space_id` BIGINT    NULL,

    CONSTRAINT `fk_routies_routie_space`
        FOREIGN KEY (`routie_space_id`)
            REFERENCES `routie_spaces` (`id`)
);

-- 4. place_closed_weekdays 테이블
CREATE TABLE `place_closed_weekdays`
(
    `id`         BIGINT AUTO_INCREMENT PRIMARY KEY,
    `closed_day` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP    NULL,
    `place_id`   BIGINT       NULL,

    CONSTRAINT `fk_place_closed_weekdays_place`
        FOREIGN KEY (`place_id`)
            REFERENCES `places` (`id`),

    CONSTRAINT `uk_place_closed_day`
        UNIQUE (`place_id`, `closed_day`)
);

-- 5. routie_places 테이블
CREATE TABLE `routie_places`
(
    `id`         BIGINT AUTO_INCREMENT PRIMARY KEY,
    `sequence`   INT       NOT NULL,
    `created_at` TIMESTAMP NULL,
    `place_id`   BIGINT    NULL,
    `routie_id`  BIGINT    NULL,

    CONSTRAINT `fk_routie_places_routie`
        FOREIGN KEY (`routie_id`)
            REFERENCES `routies` (`id`),

    CONSTRAINT `fk_routie_places_place`
        FOREIGN KEY (`place_id`)
            REFERENCES `places` (`id`),

    CONSTRAINT `uk_routie_sequence`
        UNIQUE (`routie_id`, `sequence`)
);
