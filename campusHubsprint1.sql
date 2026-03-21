CREATE DATABASE campusHub;
USE campusHub;

CREATE TABLE User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(45) NOT NULL,
    lastName VARCHAR(45) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    studentId VARCHAR(45) NOT NULL UNIQUE,
    profilePicture VARCHAR(500),
    course VARCHAR(45) NOT NULL,
    engagementPoints INT DEFAULT 0,
    password VARCHAR(80) NOT NULL,
    email VARCHAR(100)NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL
);

CREATE TABLE Clubs (
    clubId INT AUTO_INCREMENT PRIMARY KEY,
    clubName VARCHAR(45) NOT NULL,
    category VARCHAR(80) NOT NULL,
    descriptions VARCHAR(500),
    meeting_schedule VARCHAR(200) NOT NULL,
    location VARCHAR(200) NOT NULL,
    image_url VARCHAR(500),
    active BOOLEAN,
    created_at DATE
);

CREATE TABLE Events (
    eventId INT AUTO_INCREMENT PRIMARY KEY,
    eventTitle VARCHAR(45) NOT NULL,
    description VARCHAR(500),
    location VARCHAR(45) NOT NULL,
    campus VARCHAR(45),
    eventDate DATE,
    capacity INT,
    category VARCHAR(80),
    image_url VARCHAR(500),
    created_by DATE,
    created_at DATE,
    User_user_id INT,
    FOREIGN KEY (User_user_id) REFERENCES User(user_id)
);

CREATE TABLE Announcement (
    announcementId INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(45) NOT NULL,
    content VARCHAR(1000),
    category VARCHAR(45),
    author_id INT,
    created_at DATE,
    pinned TINYINT,
    User_user_id INT,
    FOREIGN KEY (User_user_id) REFERENCES User(user_id)
);

CREATE TABLE ClubMembership (
    clubMembershipId INT AUTO_INCREMENT PRIMARY KEY,
    role VARCHAR(45) NOT NULL,
    joined_at DATE NOT NULL,
    Clubs_clubId INT,
    User_user_id INT,
    FOREIGN KEY (Clubs_clubId) REFERENCES Clubs(clubId),
    FOREIGN KEY (User_user_id) REFERENCES User(user_id)
);