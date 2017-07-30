DROP DATABASE IF EXISTS hapi_starter;
CREATE DATABASE hapi_starter;

\c hapi_starter

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  username character varying(255) NOT NULL,
  password character varying(255),
  created_at timestamp with time zone NOT NULL,
  updated_at timestamp with time zone
);
