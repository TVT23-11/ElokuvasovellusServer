CREATE TABLE favorites (
    idfavorite integer NOT NULL,
    iduser integer NOT NULL,
    idmovie integer NOT NULL,
    poster character varying(255),
    moviename character varying(255),
    sharelink character varying(255)
);

CREATE TABLE groups (
    idgroup integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now()
);

CREATE TABLE groups_lists (
    idgrouplist integer NOT NULL,
    idgroup integer NOT NULL,
    moviename character varying(255) NOT NULL,
    movieid integer NOT NULL,
    poster character varying(255)
);

CREATE TABLE groups_shows (
    idgroupshow integer NOT NULL,
    idgroup integer NOT NULL,
    theater character varying(255) NOT NULL,
    showtime character varying(255) NOT NULL,
    moviename character varying(255) NOT NULL,
    movieid character varying(255) NOT NULL,
    poster character varying(255)
);

CREATE TABLE reviews (
    idreview integer NOT NULL,
    iduser integer NOT NULL,
    idmovie character varying(255) NOT NULL,
    numberofstars integer,
    review text,
    date timestamp without time zone DEFAULT now(),
    moviename character varying(255),
    poster character varying(255)
);

CREATE TABLE user_groups (
    idusergroup integer NOT NULL,
    iduser integer NOT NULL,
    idgroup integer NOT NULL,
    accepted boolean DEFAULT false,
    isadmin boolean DEFAULT false,
    joined_at timestamp without time zone DEFAULT now()
);

CREATE TABLE users (
    iduser integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    salt character varying(255),
    iterations integer
);


