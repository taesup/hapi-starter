DROP DATABASE IF EXISTS hapi_starter;
CREATE DATABASE hapi_starter;

\c hapi_starter

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  username character varying(255) NOT NULL,
  password character varying(255) NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX users_username_idx ON users (username);
