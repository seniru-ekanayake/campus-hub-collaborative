# CampusHub - University of Wolverhampton

A full-stack student portal centralising campus services, information, and engagement at the University of Wolverhampton. The project includes a **Spring Boot web application** and an **Expo React Native mobile app**, both powered by the same REST API backend.

Student Portal project by **EIS Coders**.

---

## Team

| Name | Role |
|---|---|
| Jude Tirosh | Backend - Spring Boot, security, services |
| Amashi Aththanagoda | Frontend - HTML/CSS/JS pages And Mobile app - Expo React Native |
| Jude Danushan | Database and entities, helped with repositories |

---

## Phase 1 - Completed Features

These are the features finished and working before the Phase 1 deadline. Phase 2 additions (check-in rewards, facilities, transport, mental health portal) are implemented in the codebase but were cut from the original scope due to time constraints.

| Feature | Backend | Web Frontend |
|---|---|---|
| Register / Login | AuthController + AuthService | register.html, login.html |
| Admin login (same endpoint, different role) | AuthController | login.html |
| Profile view and edit | AuthController + AuthService | profile.html |
| Events (admin creates, students view) | EventController + EventService | events.html |
| Club Hub (join/leave, admin manages) | ClubController + ClubService | clubs.html |
| Announcements | AnnouncementController + AnnouncementService | announcements.html |
| Admin panel (users, stats) | AdminController | admin.html |
| Dashboard | - | dashboard.html |

---

## Project Structure

```
campus-hub/
├── backend/
│   ├── src/main/java/com/wolverhampton/campushub/
│   │   ├── CampusHubApplication.java
│   │   ├── config/         SecurityConfig, DataInitializer, WebConfig
│   │   ├── controller/     Auth, Admin, Event, Club, Announcement,
│   │   │                   Facility, Transport, CheckIn, Counseling
│   │   ├── dto/            request/response shapes (AuthDTO, UserDTO, EventDTO, AppDTO, FacilityDTO)
│   │   ├── entity/         JPA entities - User, Role, Event, Club, ClubMembership,
│   │   │                   Announcement, Facility, TransportSchedule, CheckIn,
│   │   │                   Reward, Counselor, CounselingSession
│   │   ├── repository/     Spring Data repos for each entity
│   │   ├── security/       JWT filter, JwtUtils, UserDetailsImpl/Service
│   │   └── service/        business logic lives here
│   └── src/main/resources/
│       ├── application.properties   DB + JWT config
│       └── static/                  frontend files Spring Boot serves
│           ├── index.html
│           ├── css/style.css
│           ├── js/app.js, layout.js
│           └── pages/
├── frontend/               standalone copies of the frontend (same files as static/)
│   ├── index.html
│   ├── css/style.css
│   ├── js/app.js, layout.js
│   └── pages/
│       ├── dashboard.html
│       ├── events.html
│       ├── announcements.html
│       ├── facilities.html
│       ├── clubs.html
│       ├── transport.html
│       ├── checkin.html
│       ├── mental-health.html
│       ├── profile.html
│       ├── admin.html
│       ├── login.html
│       └── register.html
└── mobile/                 Expo React Native mobile app
    ├── App.js
    ├── app.json
    ├── package.json
    └── src/
        ├── components/     Reusable UI components
        ├── constants/      Theme and API config
        ├── navigation/     Stack and drawer navigators
        ├── screens/
        │   ├── auth/       Login, Register
        │   ├── main/       Dashboard, Events, Clubs, Facilities,
        │   │               Transport, Announcements, Check-In, Wellbeing, Profile
        │   └── admin/      Add Event, Club, Announcement, Facility, Transport
        ├── services/       API client and campus service layer
        ├── store/          Auth state (Zustand)
        └── utils/          Async storage helpers
```

> Note: `frontend/` and `backend/src/main/resources/static/` contain the same files. Both are kept because the frontend was developed separately while the backend was being set up. If you are running through Spring Boot, edit the `static/` copies.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 17, Spring Boot 3.2, Spring Security (JWT), Hibernate ORM, JPA |
| Database | MySQL 8 |
| Build | Maven |
| Web Frontend | HTML, CSS, Vanilla JavaScript |
| Mobile | React Native (Expo), Zustand, React Navigation |
| Server | Embedded Tomcat (port 8080) |

---

## Prerequisites

- Java 17+
- MySQL 8+
- Maven 3.6+
- Node.js 18+ and npm (for mobile)
- Expo Go app on your phone (for mobile testing)

---

## Backend Setup

### 1. Create Database

```sql
CREATE DATABASE campus_hub;
```

### 2. Configure Database

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.username=your_mysql_user
spring.datasource.password=your_mysql_password
```

Default expects `root` / `root123` - change if yours is different.

### 3. Build and Run

```bash
cd backend
mvn spring-boot:run
```

### 4. Access the Web App

Open [http://localhost:8080](http://localhost:8080)

The app serves the frontend itself via Spring Boot static resources, so no separate server is needed for the HTML pages.

### Default Admin Credentials

- **Username:** `admin`
- **Password:** `admin123`

`DataInitializer` creates this on first run if it does not already exist. Do not use this in any real deployment.

---

## Frontend (Standalone)

The `frontend/` folder is a standalone version of the web app that can be opened directly in a browser without running the backend. Useful for UI development and demos.

Open `frontend/index.html` in any modern browser to get started.

---

## Mobile App Setup

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Configure API URL

Edit `mobile/src/constants/api.js` and set your backend IP:

```js
export const BASE_URL = 'http://YOUR_LOCAL_IP:8080';
```

Use your machine's local network IP (e.g. `192.168.1.x`), not `localhost`, so the phone can reach the backend.

### 3. Start the App

```bash
npx expo start
```

Scan the QR code with the **Expo Go** app on your Android or iOS device.

---

## Database Entities

| Entity | Description |
|---|---|
| User | Students and admin accounts |
| Role | ROLE_STUDENT, ROLE_ADMIN |
| Facility | Campus buildings and services |
| Event | Campus events |
| Announcement | News feed and announcements |
| TransportSchedule | Inter-campus shuttle timetables |
| Club | Student clubs and societies |
| ClubMembership | Student-Club many-to-many join |
| CheckIn | Engagement check-in records |
| Reward | Redeemable reward catalogue |
| Counselor | Wellbeing counselor profiles |
| CounselingSession | Booked counseling sessions |

---

## API Endpoints

### Public

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Student registration |
| POST | `/api/auth/login` | Login - returns JWT token |

### Authenticated (Student + Admin)

| Method | Endpoint | Description |
|---|---|---|
| GET/PUT | `/api/auth/profile` | View or update profile |
| GET | `/api/facilities` | View all facilities |
| GET | `/api/events` | View upcoming events |
| GET | `/api/announcements` | View announcements |
| GET | `/api/transport` | View transport schedules |
| GET | `/api/clubs` | View all clubs |
| POST | `/api/clubs/{id}/join` | Join a club |
| DELETE | `/api/clubs/{id}/leave` | Leave a club |
| POST | `/api/checkin` | Check in at a campus location |
| GET | `/api/checkin/my` | My check-in history |
| GET | `/api/rewards` | View reward catalogue |
| GET | `/api/counseling/counselors` | View available counselors |
| POST | `/api/counseling/sessions` | Book a counseling session |
| GET | `/api/counseling/sessions/my` | My booked sessions |
| PATCH | `/api/counseling/sessions/{id}/cancel` | Cancel a session |

### Admin Only

| Method | Endpoint | Description |
|---|---|---|
| ALL | `/api/admin/**` | Full CRUD for all content types |
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/users` | User management |

---

## Features

| Feature | Phase | Web | Mobile |
|---|---|---|---|
| JWT Authentication | 1 | Yes | Yes |
| Events | 1 | Yes | Yes |
| Announcements | 1 | Yes | Yes |
| Club Hub | 1 | Yes | Yes |
| Admin Dashboard | 1 | Yes | Yes |
| Profile | 1 | Yes | Yes |
| Facility Feed | 2 | Yes | Yes |
| Transport Schedules | 2 | Yes | Yes |
| Check-In Rewards | 2 | Yes | Yes |
| Mental Health Portal | 2 | Yes | Yes |
| Push Notifications | Planned | - | - |

---

## Security Notes

- Passwords hashed with BCrypt
- JWT tokens expire after 24 hours
- Counseling session details visible only to the booked student and admin
- All admin endpoints protected with `ROLE_ADMIN` Spring Security authorisation
- CORS configured for development - restrict in production

---

## Known Issues

- Error messages from the backend are not very descriptive - most say "Invalid credentials" or return a 400 with a generic message. Proper error codes are planned.
- The JWT secret is hardcoded in `application.properties`. It should be moved to an environment variable before any real deployment.
- No input sanitisation on the frontend beyond what `@Valid` annotations catch on the backend.
- `engagementPoints` field on `User` exists but nothing updates it yet - this was going to be part of the Phase 2 check-in system.
- Admin can delete their own account through the users endpoint.
