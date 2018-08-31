DROP DATABASE IF EXISTS express_gallery;

DROP USER IF EXISTS express_gallery_user;

CREATE USER express_gallery_user WITH PASSWORD 'password';

CREATE DATABASE express_gallery with OWNER express_gallery_user