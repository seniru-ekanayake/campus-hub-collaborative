-- Create Database
CREATE DATABASE campus_hub;
use campus_hub;

-- DDL script According to the ER diagram
CREATE TABLE roles(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    RoleName ENUM('ROLE_STUDENT', 'ROLE_ADMIN') NOT NULL
);

CREATE TABLE users(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(150) NOT NULL,
    email VARCHAR(300) NOT NULL UNIQUE,
    password VARCHAR(300) NOT NULL,
    firstName VARCHAR(200) NOT NULL,
    lastName VARCHAR(200) NOT NULL,
    studentId VARCHAR(70) NOT NULL UNIQUE,
    profilePicture VARCHAR(300),
    course VARCHAR(150),
    engagementPoints INT NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt DATETIME,

    CONSTRAINT check_user_points
    CHECK (engagementPoints >= 0)
);

CREATE TABLE user_roles(
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,

    PRIMARY KEY(user_id,role_id),

    CONSTRAINT fk_user_roles_user
    FOREIGN KEY(user_id) REFERENCES users(id),

    CONSTRAINT fk_user_roles_role
    FOREIGN KEY(role_id) REFERENCES roles(id)
);

CREATE TABLE clubs(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    meetingSchedule VARCHAR(100),
    location VARCHAR(100) NOT NULL,
    imageUrl VARCHAR(300),
    contactEmail VARCHAR(200) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    createdAt DATETIME
);

CREATE TABLE club_memberships(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role VARCHAR(50) DEFAULT 'MEMBER',
    joinedAt DATETIME,
    users_id BIGINT NOT NULL,
    clubs_id BIGINT NOT NULL,

    CONSTRAINT fk_membership_user
      FOREIGN KEY(users_id) REFERENCES users(id),
    
    CONSTRAINT fk_membership_club
      FOREIGN KEY(clubs_id) REFERENCES clubs(id)
);

CREATE TABLE facilities(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    location VARCHAR(100) NOT NULL,
    campus VARCHAR(200),
    openingTimes VARCHAR(200),
    imageUrl VARCHAR(400),
    status ENUM('OPENED','CLOSED') DEFAULT 'CLOSED',
    createdAt DATETIME,
    updatedAt DATETIME
);

CREATE TABLE events(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    facilities_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    location VARCHAR(100),
    campus VARCHAR(100),
    eventDate DATETIME NOT NULL,
    capacity INT NOT NULL,
    category VARCHAR(100),
    imageUrl VARCHAR(300),
    createdBy BIGINT NOT NULL,
    createdAt DATETIME,

    CONSTRAINT ck_event_capacity CHECK(capacity >=0),

    CONSTRAINT fk_event_host
      FOREIGN KEY (createdBy) REFERENCES users(id),

    CONSTRAINT fk_event_facilities
      FOREIGN KEY (facilities_id) REFERENCES facilities(id)
);

CREATE TABLE announcements(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    createdAt DATETIME,
    pinned BOOLEAN DEFAULT FALSE,

    facilities_id BIGINT,
    user_id BIGINT NOT NULL,

    CONSTRAINT fk_annoc_facilities
     FOREIGN KEY(facilities_id) REFERENCES facilities(id),

    CONSTRAINT fk_annoc_user
     FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE check_ins(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    locationName VARCHAR(150),
    locationType ENUM('FACILITY','EVENT','LIBRARY','LAB')NOT NULL,
    pointsAwarded INT NOT NULL DEFAULT 0,
    checkInTime DATETIME,
    user_id BIGINT NOT NULL,
    event_id BIGINT,

    CONSTRAINT ck_checkin_points CHECK(pointsAwarded >= 0),

    CONSTRAINT fk_checkins_user
     FOREIGN KEY(user_id) REFERENCES users(id),

    CONSTRAINT fk_checkins_event
     FOREIGN KEY(event_id) REFERENCES events(id)
);

CREATE TABLE rewards(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    checkin_id BIGINT NOT NULL,
    description TEXT,
    pointsRequired INT NOT NULL,
    pointsValue INT NOT NULL,
    availableQuantity INT NOT NULL DEFAULT 0,
    locationTypeName VARCHAR(100),
    active BOOLEAN DEFAULT TRUE,
    createdAt DATETIME,

    CONSTRAINT fk_reward_checkins
     FOREIGN KEY(checkin_id) REFERENCES check_ins(id),

    CONSTRAINT ck_reward_points CHECK(pointsRequired > 0),

    CONSTRAINT ck_reward_quantity CHECK (availableQuantity >= 0)
);


CREATE TABLE counselors(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    title VARCHAR(100),
    specialization VARCHAR(300),
    bio TEXT,
    profilePicture VARCHAR(300),
    contactEmail VARCHAR(100) NOT NULL,
    availabilityNotes VARCHAR(500),
    active BOOLEAN,
    createdAt DATETIME
);

CREATE TABLE counseling_sessions(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sessionDate DATETIME NOT NULL,
    issueDescription Text,
    status ENUM('PENDING','APPROVED','CANCELLED','COMPLETED') DEFAULT 'PENDING',
    adminNotes TEXT,
    createdAt DATETIME,

    user_id BIGINT NOT NULL,
    counselors_id BIGINT NOT NULL,

    CONSTRAINT fk_session_user
     FOREIGN KEY (user_id) REFERENCES users(id),

    CONSTRAINT fk_session_counselor
     FOREIGN KEY(counselors_id) REFERENCES counselors(id)
);

CREATE TABLE transport_schedules(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    facility_id BIGINT NOT NULL,
    fromCampus VARCHAR(100),
    toCampus VARCHAR(100),
    departureTime VARCHAR(50),
    arrivalTime VARCHAR(50),
    frequency VARCHAR(100),
    daysOfOperation VARCHAR(100),
    routeInfo VARCHAR(300),
    active BOOLEAN DEFAULT TRUE,
    alertMessage VARCHAR(200),
    updatedTime DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_transport_facility
      FOREIGN KEY (facility_id) REFERENCES facilities(id)
);

-- Populate Database to see Validation and Data intergrity

USE campus_hub;


INSERT INTO roles (id, RoleName)
VALUES (1,'ROLE_ADMIN'), (2,'ROLE_STUDENT');

INSERT INTO users (id, username,email,password,firstName, lastName,studentId,profilePicture,course,engagementPoints,active, createdAt)
VALUES (1,'HenrySmith','HenryS@campushub.com','henry123','Henry','Smith','M001','john.jpg','Computer Science',120,TRUE, '2023-07-15'),
(2,'emmaSmith','emma@campushub.com','Emma123','Emma','Smith','M002','emma.jpg','Software Engineering',250,TRUE,'2025-01-24'),
(3,'ADMIN','admin@campushub.com','$dj4tjdw','System','Admin','ADM001','admin.jpg','Administration',0,TRUE, '2023-01-01'),
(4,'AdriyanWill', 'adriyanw@campushub.com','$5j4gbj','Adriyan', 'Will', 'M003', 'adriyan.png', 'Cyber Security',300,TRUE, '2023-05-02'),
(5,'HiroshCruse', 'hiroshc@campushub.com','$2ask3dfns', 'Hirosh','Cruse','M004','hirosh.jpg', 'Management',400,TRUE,'2024-06-12'),
(6,'DavidTevon', 'tevond@campushub.com','$2arh5dfns', 'David','Tevon','M005','tevon.jpg', 'Marine',350,TRUE,'2024-06-12');


INSERT INTO user_roles (user_id, role_id)
VALUES (1, 2), (2, 2), (3, 1), (4, 2), (5, 2), (6, 2);

INSERT INTO clubs (id, name, description, category, meetingSchedule, location, imageUrl, contactEmail, active, createdAt) VALUES
(1,'Tech Innovators Club','Tecnical Innovation','Technology','Every Wednesday 17:00','Lab 1','tech.jpg','techclub@campushub.com',TRUE,'2024-01-15'),
(2,'Coding Club','Our heart is Programming','Technology','Every Friday 4PM','Lab 01','codingclub.jpg','codingclub@campushub.com',TRUE,'2023-01-12'),
(3,'Photography Club','Creative photography workshops and events','Arts','Wednesday 3PM','Media Room','photo.jpg','photo@campushub.com',TRUE,'2024-05-23');

INSERT INTO club_memberships (role,users_id,clubs_id)
VALUES ('MEMBER', 2, 1), ('LEADER', 1, 1), ('MEMBER', 4, 2), ('LEADER', 5, 3), ('MEMBER', 6, 3);

INSERT INTO facilities (id,name,description,location,campus,openingTimes,imageUrl,status,createdAt,updatedAt)VALUES 
(1,'Main Gym','Student fitness and wellness center','Building B','Main Campus','8:00 AM - 10:00 PM','gym.jpg','OPENED','2023-03-21','2023-03-22'),
(2,'Central Library','24-hour study and research facility','Library Block','Main Campus','24 Hours','library.jpg','OPENED','2023-05-24','2023-03-24'),
(3,'Media','Caputure wonderful moments','Room 05','Main Campus','Wenesday at 4PM','Media.jpg','OPENED','2024-06-26','2024-06-26'),
(4,'Computing','Computing for future','Lab 06','Main Campus','Mon - Fri 4PM','Computing.jpg','OPENED','2024-05-26','2024-05-26'),
(5,'Transport','Inter transport makes life easy','Bus station','Main Gate','Mon - Sat','transport.jpg','OPENED','2024-05-26','2024-05-26');

INSERT INTO events (id,facilities_id,title,description,location,campus,eventDate,capacity,category,imageUrl,createdBy,createdAt)
VALUES (1,4,'Hackathon 2026','Annual inter-university coding competition','Auditorium','Main Campus','2026-03-22',300,'Technology','hackathon.jpg',2,'2026-03-05'),
(2,3,'Photography Workshop','Professional photography training session','Media Hall','Main Campus','2026-07-15',100,'Arts','workshop.jpg',5,'2026-07-10'),
(3,2,'Story creation 2026','Story to inspire','Library','Main Campus','2026-03-29',50,'Library','book.jpg',1,'2026-03-28');

INSERT INTO announcements (title,content,category,pinned,facilities_id,user_id)
VALUES ('Gym Maintenance Notice','The gym will be closed on Sunday for maintenance.','Facility',TRUE,1,3),
('Hackathon Registration Open','Students can now register for Hackathon 2026.','Event',FALSE,NULL,3);

INSERT INTO check_ins (id, locationName, locationType, pointsAwarded, checkInTime, user_id, event_id) VALUES
(1,'Main Library','LIBRARY',10,'2024-02-01 09:15:00', 1, 3),
(2,'GYM','EVENT',20,'2026-03-22 15:30:00', 1,NULL);

INSERT INTO rewards (id, name, checkin_id, description, pointsRequired, pointsValue, availableQuantity, locationTypeName, active, createdAt) VALUES
(1,'GYM',2, 'Paritipate in GYM event',20,20,50,'EVENT',TRUE,'2026-05-22 15:40:00'),
(2,'Library Loyalty Badge',1, 'Awarded for consistent library usage.',10,10,100,'LIBRARY',TRUE,'2024-02-01 09:20:00');

INSERT INTO counselors (name,title,specialization,bio,profilePicture,contactEmail,availabilityNotes,active)
VALUES ('Dr. Tom','Senior Counselor','Mental Health, Academic Stress','Experienced student counselor','tom.jpg','tom@campushub.com','Available Monday-Friday',TRUE);

INSERT INTO counseling_sessions (sessionDate,issueDescription,status,adminNotes,user_id,counselors_id)
VALUES ('2026-05-10 10:00:00','Stress management consultation','APPROVED','Priority session', 1,1);

INSERT INTO transport_schedules (id, facility_id, fromCampus, toCampus, departureTime, arrivalTime, frequency, daysOfOperation, routeInfo, active, alertMessage, updatedTime) VALUES
(1, 5, 'Main Campus',  'North Campus', '07:00', '07:25', 'Every 1 hour', 'Mon-Fri','Main Gate to Library Stop to GYM',TRUE, NULL,'2024-01-01 07:00:00'),
(2, 5, 'North Campus', 'Main Campus',  '07:30', '07:55', 'Every 30 minutes', 'Mon-Fri','North Campus Hub to Library Stop to Main Gate',TRUE, NULL,'2024-01-01 07:00:00'),
(3, 5, 'Management Facality',  'Management Facality', '08:00', '08:20', 'Every 2 hour', 'Mon-Sat', 'Main Gate to Sports Complex to North Campus Hub',TRUE, NULL,'2024-01-01 07:00:00');


-- Trigger to do the rewarding process like Add points to user, reedem rewards using points
-- reedeming the available rewards and after redeem the reward update the users engagementPoints
-- Securily add engagmentPoints to the user
DELIMITER $$
-- Trigger to sucessfully add checkin Points to the User profile
CREATE TRIGGER checkinPointsToUsers
AFTER INSERT ON check_ins
FOR EACH ROW 
BEGIN 
  UPDATE users
  SET engagementPoints = engagementPoints+NEW.pointsAwarded
  WHERE id = NEW.user_id;
END$$

DROP TRIGGER IF EXISTS redeem_reward$$
CREATE TRIGGER redeem_reward
BEFORE INSERT ON rewards
FOR EACH ROW 
-- Initialize the required varaibles
BEGIN DECLARE reward_required INT;
      DECLARE reward_quantity INT;
      DECLARE reward_points INT;
      DECLARE reward_user_id BIGINT;


-- users_id from check_ins
SELECT c.user_id INTO reward_user_id
FROM check_ins c 
WHERE c.id = NEW.checkin_id;

-- adding the required column to the varaiable
SET reward_required = NEW.pointsRequired;
SET reward_quantity = NEW.availableQuantity;


SELECT engagementPoints INTO reward_points
FROM users
WHERE id= reward_user_id;


-- Conditions for Redeeming rewards

IF reward_quantity <= 0 THEN 
  SIGNAL SQLSTATE '45000'
   SET MESSAGE_TEXT = 'Rewards finished';
END IF;

IF reward_points < reward_required THEN 
  SIGNAL SQLSTATE '45000'
   SET MESSAGE_TEXT = 'Not enough points';
END IF;


-- Update engagement points after redeeming reward
UPDATE users
SET engagementPoints = engagementPoints- reward_required
WHERE id = reward_user_id;



END$$

DELIMITER ;

-- Make sure the checkin points update to userProfile after checkin
-- view engagmentPoints
SELECT id, username, engagementPoints
FROM users;
-- Insert a row checkin 
INSERT INTO check_ins (id, locationName, locationType, pointsAwarded, checkInTime, user_id, event_id) VALUES
(3,'MEDIA','EVENT', 30,NOW(),1,2);
-- To ensure the points where added to the userProfile
SELECT id, username, engagementPoints
FROM users;
-- to more specific we can add WHERE CLAUSE and set the user id

-- This is to ensure the reward redeemption works, after points will deduct
-- In the checin_id column its refer user, According to the ER diagram
INSERT INTO rewards(name, checkin_id, description, pointsRequired,pointsValue,availableQuantity,locationTypeName,active,createdAt)
VALUES('Voucher',1,'Library event reward', 30, 30,50,'EVENT',TRUE,NOW());

-- To see the balances of user engagementPoints balances
SELECT id, username, engagementPoints
FROM users;



-- Security for databse sensitive infomation
-- Most of the security were done from backend like 
-- 1. SQL injection prevented by Hibernate
-- 2. Encryption of Password and sensitive data
-- 3. Privacy like RBAC(Role-Based Acess Control) implemented in SpringBoot or Hibernate
-- for acadamic of Database i have create RBAC within workbench but the real implementation is done by Backend Dev

-- RBAC for users of this Database
CREATE USER 'USERS'
IDENTIFIED BY 'Student123';

GRANT SELECT, INSERT, UPDATE ON campus_hub.* TO 'USERS';

-- RBAC for admins of this Database
CREATE USER 'ADMIN'
IDENTIFIED BY 'admin1234';

GRANT SELECT, UPDATE, INSERT, ALTER, CREATE, DROP, DELETE ON campus_hub.*
TO 'ADMIN';