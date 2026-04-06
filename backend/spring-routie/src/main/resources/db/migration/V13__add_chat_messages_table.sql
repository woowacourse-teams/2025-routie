CREATE TABLE `chat_messages` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `routie_space_id` BIGINT NOT NULL,
    `user_id` BIGINT,
    `guest_id` BIGINT,
    `message_type` VARCHAR(20) NOT NULL,
    `content` VARCHAR(1000),
    `created_at` DATETIME(6) NOT NULL,
    CONSTRAINT `fk_chat_messages_space`
        FOREIGN KEY (`routie_space_id`) REFERENCES `routie_spaces`(`id`),
    CONSTRAINT `fk_chat_messages_user`
        FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
    CONSTRAINT `fk_chat_messages_guest`
        FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`)
);
CREATE INDEX `idx_chat_messages_space_time` ON `chat_messages` (`routie_space_id`, `created_at`);
