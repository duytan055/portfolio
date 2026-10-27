CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	username VARCHAR(50) NOT NULL,
	password_hash TEXT NOT NULL,
	role VARCHAR(20) NOT NULL DEFAULT 'admin'
);

CREATE TABLE projects (
	id SERIAL PRIMARY KEY,
	title VARCHAR(200) NOT NULL,
	slug VARCHAR(200) NOT NULL UNIQUE,
	short_description TEXT,
	description TEXT,
	key_features TEXT[],
	image_url TEXT,
	github_url TEXT,
	demo_url TEXT,
	technologies TEXT[],
	is_featured BOOLEAN DEFAULT FALSE
);

CREATE TABLE skills (
	id SERIAL PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	description TEXT,
	image_url TEXT NOT NULL
);

CREATE TABLE experiences (
	id SERIAL PRIMARY KEY,
	company VARCHAR(255) NOT NULL,
	position VARCHAR(150) NOT NULL,
	description TEXT,
	image_url TEXT,
	location VARCHAR(150) NOT NULL,
	start_date DATE,
	end_date DATE,
	is_current BOOLEAN DEFAULT FALSE
);

CREATE TABLE certificates (
	id SERIAL PRIMARY KEY,
	title VARCHAR(255) NOT NULL,
	description TEXT,
	image_url TEXT,
	issuer_by VARCHAR(255) NOT NULL,
	issue_date DATE NOT NULL,
	expiration_date DATE,
	credential_id VARCHAR(100) NOT NULL,
	credential_url TEXT NOT NULL
);

CREATE TABLE contacts (
	id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	email VARCHAR(255) NOT NULL,
	subject VARCHAR(255),
	message TEXT NOT NULL,
	status VARCHAR(20) NOT NULL DEFAULT 'unread',
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);