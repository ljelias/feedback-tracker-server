CREATE TABLE lessontopics (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  lesson_id INTEGER REFERENCES tutoringsessions(id) ON DELETE CASCADE NOT NULL,
  lesson_date DATE,
  student_id INTEGER REFERENCES studentroster(id) ON DELETE CASCADE NOT NULL,
  topic_name VARCHAR(60),
  topic_content VARCHAR(900)
);