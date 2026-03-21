CREATE TABLE roles (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name ENUM('ROLE_STUDENT', 'ROLE_ADMIN') NOT NULL UNIQUE,
    PRIMARY KEY (id)
);

CREATE TABLE users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    student_id VARCHAR(255),
    course VARCHAR(255),
    engagement_points INT NOT NULL DEFAULT 0,
    profile_picture VARCHAR(255),
    active BIT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE clubs (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    description TEXT,
    location VARCHAR(255),
    meeting_schedule VARCHAR(255),
    contact_email VARCHAR(255),
    image_url VARCHAR(255),
    active BIT NOT NULL DEFAULT 1,
    created_at DATETIME,
    PRIMARY KEY (id)
);

CREATE TABLE club_memberships (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    club_id BIGINT NOT NULL,
    role VARCHAR(255),
    joined_at DATETIME,
    PRIMARY KEY (id),
    UNIQUE KEY unique_user_club (user_id, club_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (club_id) REFERENCES clubs(id)
);

CREATE TABLE events (
    id BIGINT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    campus VARCHAR(255),
    location VARCHAR(255),
    capacity INT NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    event_date DATETIME,
    created_at DATETIME,
    created_by BIGINT,
    PRIMARY KEY (id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE announcements (
    id BIGINT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(255),
    pinned BIT NOT NULL DEFAULT 0,
    created_at DATETIME,
    author_id BIGINT,
    PRIMARY KEY (id),
    FOREIGN KEY (author_id) REFERENCES users(id)
);