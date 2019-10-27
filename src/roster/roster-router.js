const express = require('express');
const path = require('path');
// const cuid = require('cuid');
const xss = require('xss');
const RosterService = require('./roster-service.js');

const rosterRouter = express.Router();
const jsonParser = express.json();


const studentFormat = student => ({
  id: student.id,
  first_name: xss(student.first_name),
  last_name: xss(student.last_name),
  phone: xss(student.phone),
  email: xss(student.email),
  misc_info: xss(student.misc_info)
});

rosterRouter
  .route('/')
  .get((req, res, next) => {
    RosterService.getAllStudents(req.app.get('db'))
      .then(students => {
        res.json(students.map(studentFormat))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { first_name,  last_name, phone, email, misc_info} = req.body;
    console.log(req.body);
    const newStudent = { first_name, last_name, phone, email, misc_info };
    const requiredFields = { first_name, last_name };

    for (const [key, value] of Object.entries(requiredFields)) {
      if (value == null) {
        return res.status(400).json({ error: { message: `Request body must include '${key}' `}});
      }
    }
    RosterService.addStudent(req.app.get('db'), newStudent)
      .then(student => {
        res.status(201)
          .location(path.posix.join(req.originalUrl +`/${student.id}`))
          .json(studentFormat(student))
      })
      .catch(next)
  })


rosterRouter.route('/:id')
  .all((req, res, next) => {
    const { id } = req.params;
    RosterService.getStudentById( req.app.get('db'), id )
      .then(student => {
        if(!student) { return res.status(404).json({error: {message: 'Student not found'} }) }
        console.log(student);
        res.student = student;
        next();
      })
      .catch(next)
  })
  .get((req, res) => {
    console.log(res.student);
    res.json(studentFormat(res.student[0]))
  })
  .delete((req, res, next) => {
    const { id } = req.params;

    RosterService.deleteStudent( req.app.get('db'), id )
    .then(() => { res.status(204).end() })
    .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { first_name, last_name, phone, email, misc_info } = req.body;
    const studentToUpdate = { first_name, last_name, phone, email, misc_info };
    const numberOfValues = Object.values(studentToUpdate).filter(Boolean).length;

    if(numberOfValues == 0) {
      return res.status(400).json({ error: {message: `Update request must include: first_name, last_name, phone, email, or misc_info`} })
    }
    RosterService.updateStudent(req.app.get('db'), req.params.id, studentToUpdate)
      .then((student) => { res.status(200).json(studentFormat(student)) })
      .catch(next)
  })


module.exports = rosterRouter;