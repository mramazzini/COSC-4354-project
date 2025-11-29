# Semester Project – Master TODO List

This checklist covers **all four assignments** so the project can be implemented end-to-end from the start.

---

## 0. Project Setup

- [x] Create git repository
- [x] Create `/frontend` (React)
- [x] Create `/backend` (.NET Web API)
- [x] Add root `README.md`
- [x] Define project roles: Volunteer, Administrator
- [ ] Define API contract (list of endpoints)
- [x] Commit initial structure

---

## 1. Frontend (React) – Assignment 2

### 1.1 App Setup

- [x] Initialize React app
- [x] Configure routing
- [x] Add global layout (navbar + main content)
- [x] Add auth context/state
- [x] Add API service layer

---

### 1.2 Authentication

- [x] Login page (email + password)
- [x] Registration page (email + password)
- [ ] Role handling (volunteer/admin)
- [ ] Client-side validation
- [x] Error handling for auth failures
- [ ] Protected routes

---

### 1.3 User Profile Management

- [x] Profile form
  - [x] Full Name (required, max 50)
  - [x] Address 1 (required, max 100)
  - [x] Address 2 (optional, max 100)
  - [x] City (required, max 100)
  - [x] State dropdown (required, 2-char code)
  - [x] Zip Code (5–9 characters)
  - [x] Skills (multi-select, required)
  - [x] Preferences (textarea, optional)
  - [ ] Availability (multi-date picker, required)
- [x] Load profile from backend
- [x] Save profile to backend
- [ ] Frontend validations

---

### 1.4 Event Management (Admin)

- [x] Event list page
- [x] Create event form
  - [ ] Event Name (required, max 100)
  - [ ] Event Description (required)
  - [ ] Location (required)
  - [ ] Required Skills (multi-select)
  - [ ] Urgency (dropdown)
  - [ ] Event Date (date picker)
- [ ] Edit event
- [ ] Delete event

---

### 1.5 Volunteer Matching (Admin)

- [ ] Volunteer list view
- [ ] Auto-match events based on skills & availability
- [ ] Assign volunteer to event
- [ ] Success/error feedback

---

### 1.6 Notifications

- [x] Notification list page
- [x] Notification badge in navbar
- [ ] Display new assignments, updates, reminders

---

### 1.7 Volunteer History

- [ ] Volunteer history table
- [ ] Display all event fields
- [ ] Display participation status
- [ ] Admin view by volunteer

---

### 1.8 Frontend Validation Sweep

- [ ] Required fields enforced
- [ ] Length constraints enforced
- [ ] Proper field types enforced
- [ ] User-friendly error messages

---

## 2. Backend (No Database) – Assignment 3

### 2.1 Backend Setup

- [x] Create .NET Web API project
- [x] Create Domain models
- [x] Create Services
- [x] Create Controllers
- [x] Add Dependency Injection configuration
- [ ] Create test project
- [ ] Add code coverage tooling

---

### 2.2 Domain Models

- [x] UserCredentials
- [x] UserProfile
- [x] EventDetails
- [x] VolunteerHistory
- [x] Notification

---

### 2.3 In-Memory Data Storage

- [ ] In-memory user store
- [ ] In-memory profile store
- [ ] In-memory event store
- [ ] In-memory history store
- [ ] In-memory notification store
- [ ] Seed states, skills, test users

---

### 2.4 Authentication Module

- [x] Register user
- [x] Login user
- [x] Password hashing
- [x] Role support

---

### 2.5 User Profile Module

- [x] Get profile
- [x] Update profile
- [x] Backend validation

---

### 2.6 Event Management Module

- [ ] Create event
- [ ] Update event
- [ ] Delete event
- [ ] List events
- [ ] Backend validation

---

### 2.7 Volunteer Matching Module

- [ ] Match volunteers by skills
- [ ] Match by availability
- [ ] Rank by urgency
- [ ] Assign volunteer to event
- [ ] Create volunteer history entry
- [ ] Trigger notification

---

### 2.8 Notification Module

- [ ] Create notification
- [ ] Get notifications for user
- [ ] Mark as read

---

### 2.9 Volunteer History Module

- [ ] Get history for volunteer
- [ ] Get history by volunteer (admin)

---

### 2.10 Backend Validation

- [ ] Required fields enforced
- [ ] Length constraints enforced
- [ ] Proper data type checks
- [ ] Meaningful error responses

---

### 2.11 Unit Tests & Coverage

- [ ] Auth service tests
- [ ] Profile service tests
- [ ] Event service tests
- [ ] Matching logic tests
- [ ] Notification tests
- [ ] History tests
- [ ] Code coverage > 80%

---

### 2.12 Frontend Integration

- [ ] Connect frontend auth to backend
- [ ] Connect profile forms to backend
- [ ] Connect event pages to backend
- [ ] Connect matching form to backend
- [ ] Connect notifications to backend
- [ ] Connect volunteer history to backend

---

## 3. Database Integration – Assignment 4

### 3.1 Database Setup

- [x] Choose database (RDBMS or NoSQL)
- [x] Configure connection string
- [x] Add ORM / database driver
- [x] Create migrations or schema

---

### 3.2 Database Tables / Documents

- [x] UserCredentials (encrypted password)
- [x] UserProfile
- [x] EventDetails
- [x] VolunteerHistory
- [x] Notifications

---

### 3.3 Persistence Layer

- [x] Replace in-memory stores with DB repositories
- [x] Implement CRUD with database
- [x] Ensure transactional integrity

---

### 3.4 Data Retrieval & Display

- [x] Backend retrieves from database
- [x] Frontend displays persisted data
- [x] Forms populated from backend

---

### 3.5 Validation (DB + Backend)

- [x] Database constraints
- [x] Backend validation consistency

---

### 3.6 Database Unit Tests

- [ ] Repository tests
- [ ] Integration tests
- [ ] Maintain coverage > 80%

---

## 4. Final Checks

- [ ] Frontend fully integrated
- [ ] Backend fully tested
- [ ] Database connected
- [ ] README updated
- [ ] Project builds and runs
- [ ] Assignment requirements met

---
