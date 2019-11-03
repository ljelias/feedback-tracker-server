# Feedback Tracker Server
  This is the server for the Feedback Tracker client app, version 1. 
  
  Live client app:
https://feedbacktracker.ljelias.now.sh

Client repo: https://github.com/ljelias/feedback-tracker-client

--------------------------------------------------
--------------------------------------------------

## SERVER ENDPOINTS
**BASE URL:** https://hidden-tor-53269.herokuapp.com/api/

The Feedback Tracker client app (version 1) makes use of the following endpoints.

--------------------------------------------------

### **GET /students** 
To retrieve all students on the teacher's roster.

*Example request/response:* 
```
GET https://hidden-tor-53269.herokuapp.com/api/students

Status: 200 OK
[
  {
    "id": 1,
    "first_name": "Sue",
    "last_name": "Student",
    "phone": "651-777-2222",
    "email": "s.student@email.com",
    "misc_info": "skype: SSSkyper"
  },
  {
    "id": 2,
    "first_name": "Joe",
    "last_name": "Estudiante",
    "phone": "612-888-3333",
    "email": "joee@email.com",
    "misc_info": "alt phone: 612-888-3334"
  },
  ...
] 
```
--------------------------------------------------

### **POST /students** 
To add a new student to the teacher's roster.

*Example request/response:* 

```
POST https://hidden-tor-53269.herokuapp.com/api/students

Request body:
{
  "first_name" : "Billy",
  "last_name" : "Bill",
  "phone" : "612-222-3333",
  "email" : "bb@mail.com",
  "misc_info" : "out of town next June" 
}

Status: 201 Created
{
  "id": 6,
  "first_name": "Billy",
  "last_name": "Bill",
  "phone": "612-222-3333",
  "email": "bb@mail.com",
  "misc_info": "out of town next June"
}
```
--------------------------------------------------

### **GET /students/:id** 
To retrieve the data of a single student by id.

*Example request/response:* 
```
GET https://hidden-tor-53269.herokuapp.com/api/students/2

Status: 200 OK
{
  "id": 2,
  "first_name": "Joe",
  "last_name": "Estudiante",
  "phone": "612-888-3333",
  "email": "joee@email.com",
  "misc_info": "alt phone: 612-888-3334"
}
```
--------------------------------------------------

### **PATCH /students/:id** 
To update the data of a given student.

*Example request/response:* 

```
PATCH https://hidden-tor-53269.herokuapp.com/api/students/6

Request body: 
{	"first_name" : "Willy" }

Status: 200 OK
{
  "id": 6,
  "first_name": "Willy",
  "last_name": "Bill",
  "phone": "612-222-3333",
  "email": "bb@mail.com",
  "misc_info": "out of town next June"
}
```
--------------------------------------------------

### **POST /sessions/** 
To post the basic details of a new lesson session.

*Example request/response:* 
```
POST https://hidden-tor-53269.herokuapp.com/api/sessions

Request body:    
{
  "student_id": 4,
  "lesson_date": "04/15/2020",
  "next_session_info": "Next meeting: April 22. Topics: overview of vowels, R-words list."
}

Status: 201 Created
{
  "id": 9,
  "student_id": 4,
  "lesson_date": "Wed Apr 15 2020 00:00:00 GMT+0000 (Coordinated Universal Time)",
  "next_session_info": "Next meeting: April 22. Topics: overview of vowels, R-words list."
}
```
--------------------------------------------------

### **GET /sessions/student/:student_id** 
Retrieve all sessions for a given student. (Used by client app to display a list of all lesson sessions in a user dashboard.)

*Example request/response:* 
```
GET https://hidden-tor-53269.herokuapp.com/api/sessions/student/3

Status: 200 OK
[
  {
    "id": 1,
    "student_id": 3,
    "lesson_date": "Sat Feb 15 2020 00:00:00 GMT+0000 (Coordinated Universal Time)",
    "next_session_info": "Next meeting: March 1. Topics: finish article."
  },
  {
    "id": 3,
    "student_id": 3,
    "lesson_date": "Sun Mar 01 2020 00:00:00 GMT+0000 (Coordinated Universal Time)",
    "next_session_info": "Next meeting: March 15. Topics: new article (polar bears) / R-words list."
  },
  {
    "id": 6,
    "student_id": 3,
    "lesson_date": "Sun Mar 15 2020 00:00:00 GMT+0000 (Coordinated Universal Time)",
    "next_session_info": "Next meeting: April 1. Topics: article reading aloud."
  }
]
```
--------------------------------------------------

### **GET /sessions/:session_id** 
To retrieve the basic details of a particular lesson session.

*Example request/response:* 
```
GET https://hidden-tor-53269.herokuapp.com/api/sessions/1

Status: 200 OK
{
  "id": 1,
  "student_id": 3,
  "lesson_date": "2020-02-15T00:00:00.000Z",
  "next_session_info": "Next meeting: March 1. Topics: finish article."
}
```
--------------------------------------------------

### **POST /topics** 
To post a new topic (lesson point) for a lesson session -- this requires the session_id of an existing lesson session. 

*Example request/response:* 
```
POST https://hidden-tor-53269.herokuapp.com/api/topics

Request body: 
{
  "lesson_id": 7,
  "lesson_date": "03/15/2020",
  "student_id": 4,
  "topic_name": "R-vowel",
  "topic_content": "The vowel in these words does not have sound: turn, birth, heard, thirst, worth, nurse, nerve"
}

Status: 201 Created
{
  "id": 20,
  "lesson_id": 7,
  "lesson_date": "2020-03-15T00:00:00.000Z",
  "student_id": 4,
  "topic_name": "R-vowel",
  "topic_content": "The vowel in these words does not have sound: turn, birth, heard, thirst, worth, nurse, nerve"
}
```
--------------------------------------------------

### **GET /topics/session/:session_id** 
To retrieve all the topics (lesson points) that belong to a particular lesson session.

*Example request/response:* 
```
GET https://hidden-tor-53269.herokuapp.com/api/topics/session/4

Status: 200 OK
[
  {
    "id": 10,
    "lesson_id": 4,
    "lesson_date": "2020-03-02T00:00:00.000Z",
    "student_id": 2,
    "topic_name": "Grammar corrections",
    "topic_content": "You wrote: she concerns that / Corrected: she is concerned that"
  },
  {
    "id": 11,
    "lesson_id": 4,
    "lesson_date": "2020-03-02T00:00:00.000Z",
    "student_id": 2,
    "topic_name": "Confusable words",
    "topic_content": "prospective -this is used to talk about something that could happen in the future, it is potential / perspective -this means point-of-view, or a certain way of seeing things"
  },
  {
    "id": 12,
    "lesson_id": 4,
    "lesson_date": "2020-03-02T00:00:00.000Z",
    "student_id": 2,
    "topic_name": "New vocabulary",
    "topic_content": "encroaching -using the land (not your own land or going over the boundary without permission) / galoshes -rain boots / loafers -leather shoes / pasture -the field where animals eat grass / DIY =do-it-yourself"
  }
]
```
--------------------------------------------------

### **GET /topics/:student_id** 
To retrieve the distinct topic categories for a particular student (this provides the lesson topics that serve as "tags" for categorizing the feedback given to student over time).

*Example request/response:* 
```
GET https://hidden-tor-53269.herokuapp.com/api/topics/4

Status: 200 OK
[
  {
    "topic_name": "Compound nouns"
  },
  {
    "topic_name": "Noun-verb pairs"
  },
  {
    "topic_name": "R-vowel"
  },
  {
    "topic_name": "Words with O+R"
  }
]
```
--------------------------------------------------

### **GET /topics/:topic/:student_id** 
To retrieve all entries (across various lesson dates) of a particular lesson topic for a given student. The "/:topic" portion requires the desired "tag" or topic name.

*Example request/response:* 
```
GET https://hidden-tor-53269.herokuapp.com/api/topics/Words with R/3

Status: 200 OK
[
  {
    "lesson_id": 1,
    "lesson_date": "2020-02-15T00:00:00.000Z",
    "topic_name": "Words with R",
    "topic_content": "It has been a while since we have focused on this. Remember to keep your tongue up near the front. Examples: arm / party -- say it like \"par-dee\" / heard -- R-vowel, EA is silent"
  },
  {
    "lesson_id": 6,
    "lesson_date": "2020-03-15T00:00:00.000Z",
    "topic_name": "Words with R",
    "topic_content": "These words were extra challenging for you: eroding -make sure the D does not sound like a 2nd R / frustrating / river level"
  }
]
```

--------------------------------------------------

## This server is built with: 
- Node.js
- PostgreSQL
- Knex



--------------------------------------------------
