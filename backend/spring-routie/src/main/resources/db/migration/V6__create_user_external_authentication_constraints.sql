ALTER TABLE users
    ADD CONSTRAINT uk_external_authentication_identifier_provider UNIQUE (external_authentication_identifier, external_authentication_provider);
