ALTER TABLE users RENAME COLUMN oauth_provider TO external_authentication_provider;
ALTER TABLE users RENAME COLUMN oauth_identifier TO external_authentication_identifier;
