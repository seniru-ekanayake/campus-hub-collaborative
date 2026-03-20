# CampusHub Phase 1 — QA Test Suite

This directory contains the **external** test codebase for CampusHub Phase 1.
It integrates with the main source code without modifying it.

---

## Directory Structure

```
campus-hub-phase1-tests/
├── README.md                          ← This file
├── backend-tests/
│   ├── pom-additions.xml              ← Dependencies to add to main pom.xml
│   └── src/test/
│       ├── resources/
│       │   └── application-test.properties   ← H2 test DB config
│       └── java/com/wolverhampton/campushub/
│           ├── BaseIntegrationTest.java       ← Shared test base class
│           ├── controller/
│           │   ├── AuthControllerTest.java    ← TC-AUTH-001–010 (10 tests)
│           │   ├── EventControllerTest.java   ← TC-EVT-001–009  (9 tests)
│           │   ├── ClubControllerTest.java    ← TC-CLUB-001–010 (10 tests)
│           │   ├── AnnouncementControllerTest.java ← TC-ANN-001–008 (8 tests)
│           │   └── AdminControllerTest.java   ← TC-ADMIN-001–007 (7 tests)
│           ├── service/
│           │   └── AuthServiceTest.java       ← TC-SVC-001–008  (8 tests)
│           └── security/
│               └── JwtUtilsTest.java          ← TC-JWT-001–005  (5 tests)
├── frontend-tests/
│   ├── package.json
│   ├── jest.config.js
│   ├── setup.js
│   └── tests/
│       ├── auth.test.js               ← TC-FE-AUTH-001–012 (12 tests)
│       ├── utils.test.js              ← TC-FE-UTILS-001–010 (10 tests)
│       └── http.test.js               ← TC-FE-HTTP-001–007  (7 tests)
└── api-tests/
    └── CampusHub_Phase1_API.postman_collection.json   ← 29 API test cases
```

---

## Total Test Count

| Suite | Tests |
|---|---|
| Backend Integration (MockMvc) | 57 |
| Frontend Unit (Jest) | 29 |
| API / Postman Collection | 29 |
| **Total** | **86** |

---

## Integration Instructions

### Step 1 — Add backend test dependencies to pom.xml

Open `campus-hub-phase1/backend/pom.xml` and paste the contents of
`backend-tests/pom-additions.xml` inside the `<dependencies>` block:

```xml
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-test</artifactId>
    <scope>test</scope>
</dependency>
```

### Step 2 — Copy test sources into the main project

```bash
# From this folder:
cp backend-tests/src/test/resources/application-test.properties \
   ../campus-hub-phase1/backend/src/test/resources/

cp -r backend-tests/src/test/java/com/wolverhampton/campushub/* \
      ../campus-hub-phase1/backend/src/test/java/com/wolverhampton/campushub/
```

### Step 3 — Run backend tests

```bash
cd campus-hub-phase1/backend
mvn test
```

Expected output: **57 tests, 0 failures, 0 errors**

---

## Running Frontend Tests

### Prerequisites
- Node.js 18+

### Steps

```bash
cd frontend-tests
npm install
npm test
```

Expected output: **29 tests passed** with coverage report.

---

## Running API Tests (Postman / Newman)

### Option A — Postman Desktop
1. Open Postman
2. Import `api-tests/CampusHub_Phase1_API.postman_collection.json`
3. Set collection variable `baseUrl` = `http://localhost:8080/api`
4. **Start the main application first** (`mvn spring-boot:run`)
5. Run the collection — tests execute in order (auth tokens pass automatically)

### Option B — Newman (CLI)

```bash
npm install -g newman
newman run api-tests/CampusHub_Phase1_API.postman_collection.json \
  --env-var baseUrl=http://localhost:8080/api
```

Expected output: **29 requests, 29 assertions passed**

---

## Test ID Reference

| ID | Description |
|---|---|
| TC-AUTH-001 | Register with valid data |
| TC-AUTH-002 | Duplicate username rejected |
| TC-AUTH-003 | Duplicate email rejected |
| TC-AUTH-004 | Valid login returns JWT |
| TC-AUTH-005 | Wrong password rejected |
| TC-AUTH-006 | Unknown user rejected |
| TC-AUTH-007 | Authenticated profile GET |
| TC-AUTH-008 | Unauthenticated profile blocked |
| TC-AUTH-009 | Profile update persists |
| TC-AUTH-010 | Admin login returns ROLE_ADMIN |
| TC-EVT-001 | Public events GET |
| TC-EVT-002 | Admin creates event |
| TC-EVT-003 | Student blocked from creating |
| TC-EVT-004 | Unauthenticated blocked |
| TC-EVT-005 | Student sees admin-created event |
| TC-EVT-006 | Admin updates event |
| TC-EVT-007 | Admin deletes event |
| TC-EVT-008 | GET all events |
| TC-EVT-009 | GET event by ID |
| TC-CLUB-001–010 | Full ClubHub CRUD + membership |
| TC-ANN-001–008 | Full Announcements CRUD + filters |
| TC-ADMIN-001–007 | Stats, user list, delete, count |
| TC-SVC-001–008 | AuthService unit tests |
| TC-JWT-001–005 | JwtUtils unit tests |
| TC-FE-AUTH-001–012 | Frontend Auth object |
| TC-FE-UTILS-001–010 | Frontend Utils helpers |
| TC-FE-HTTP-001–007 | Frontend Http client |
