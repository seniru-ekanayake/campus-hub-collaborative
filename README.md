# CampusHub – Phase 1

University of Wolverhampton · Student Portal project by EIS Coders.

---

## What's in Phase 1

These are the features we actually finished and got working before the deadline. Phase 2 stuff (check-in rewards, facilities, transport) got cut because we ran out of time — see bottom of this file.

| Feature | Where in backend | Where in frontend |
|---|---|---|
| Register / Login | `AuthController` + `AuthService` | `register.html`, `login.html` |
| Admin login (same endpoint, different role) | `AuthController` | `login.html` |
| Profile view + edit | `AuthController` + `AuthService` | `profile.html` |
| Events (admin creates, students view) | `EventController` + `EventService` | `events.html` |
| Club Hub (join/leave, admin manages) | `ClubController` + `ClubService` | `clubs.html` |
| Announcements | `AnnouncementController` + `AnnouncementService` | `announcements.html` |
| Admin panel (users, stats) | `AdminController` | `admin.html` |
| Dashboard | – | `dashboard.html` |

---

## Running it

You need Java 17+, Maven, and MySQL running locally.

```bash
# Make sure MySQL is up and the credentials in application.properties match yours
# Default expects: root / root123 — change if yours is different

cd backend
mvn spring-boot:run
```

Then go to: http://localhost:8080

The app serves the frontend itself (Spring Boot static resources), so you don't need a separate server for the HTML pages.

---

## Default admin account

```
Username: admin
Password: admin123
```

DataInitializer creates this on first run if it doesn't exist. Don't use this in any real deployment obviously.

---

## Project layout

```
campus-hub/
├── backend/
│   ├── src/main/java/com/wolverhampton/campushub/
│   │   ├── config/       SecurityConfig, DataInitializer, WebConfig
│   │   ├── controller/   Auth, Admin, Event, Club, Announcement
│   │   ├── dto/          request/response shapes (AuthDTO, UserDTO, EventDTO, AppDTO)
│   │   ├── entity/       JPA entities – User, Role, Event, Club, ClubMembership, Announcement
│   │   ├── repository/   Spring Data repos for each entity
│   │   ├── security/     JWT filter, JwtUtils, UserDetailsImpl/Service
│   │   └── service/      business logic lives here
│   └── src/main/resources/
│       ├── application.properties   DB + JWT config
│       └── static/       frontend files Spring Boot serves
└── frontend/             standalone copies of the frontend (same files)
```

> **Note:** The frontend folder and `backend/src/main/resources/static/` contain the same files. We kept both because Priya was working on the frontend separately while Aiden set up Spring Boot. Just edit the static/ ones if you're running through Spring.

---

## Known issues / things we'd fix with more time

- Error messages from the backend aren't great — most just say "Invalid credentials" or throw a 400 with a generic message. We'd want proper error codes.
- The JWT secret is hardcoded in `application.properties`. Should be an env variable.
- No input sanitisation on the frontend beyond what the `@Valid` annotations catch on the backend.
- `engagementPoints` field on User exists but nothing actually updates it yet — that was going to be part of the Phase 2 check-in system.
- Admin can delete their own account through the users endpoint. We noticed this late.

---

## Phase 2 (not included)

Removed to keep Phase 1 scoped:
- Check-in & Rewards (the `engagementPoints` field is a leftover from this)
- Facilities booking
- Campus transport schedules
- Mental Health / Counselling appointment booking
