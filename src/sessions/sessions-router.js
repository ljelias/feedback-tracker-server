const express = require('express');
const path = require('path');
// const cuid = require('cuid');
const xss = require('xss');
const SessionsService = require('./sessions-service.js');

const sessionsRouter = express.Router();
const jsonParser = express.json();

const sessionFormat = session => ({
  id: session.id,
  student_id: session.student_id,
  lesson_date: xss(session.lesson_date),
  next_session_info: xss(session.next_session_info)
});

sessionsRouter
  .route('/')
  .get((req, res, next) => {
    SessionsService.getAllSessions(req.app.get('db'))
      .then(sessions => {
        res.json(sessions.map(sessionFormat))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { student_id, lesson_date, next_session_info } = req.body;
    const newSession = { student_id, lesson_date, next_session_info };
    const requiredFields = { student_id, lesson_date };

    for (const [key, value] of Object.entries(requiredFields)) {
      if (value == null) {
        return res.status(400).json({ error: { message: `Request body must include '${key}' `}});
      }
    }
    SessionsService.addSession(req.app.get('db'), newSession)
      .then(session => {
        res.status(201)
          .location(path.posix.join(req.originalUrl +`/${session.id}`))
          .json(sessionFormat(session))
      })
      .catch(next)
  })

sessionsRouter.route('/student/:student_id')
  .get((req, res) => {
    SessionsService.getSessionsByStudentId(req.app.get('db'), req.params.student_id)
    .then(sessions => {
      res.json(sessions.map(sessionFormat))
    })
  })

sessionsRouter.route('/:session_id')
  .all((req, res, next) => {
    SessionsService.getSessionById( req.app.get('db'), req.params.session_id )
      .then(session => {
        if(!session) { return res.status(404).json({error: {message: 'Session does not exist'} }) }
        res.session = session;
        next();
      })
      .catch(next)
  })
  .get((req, res, next) => {
    return res.json(res.session[0]);
  })
  .delete((req, res, next) => {
    SessionsService.deleteSession( req.app.get('db'), req.params.session_id )
    .then(() => { res.status(204).end() })
    .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { student_id, lesson_date, next_session_info } = req.body;
    const sessionToUpdate = { student_id, lesson_date, next_session_info };
    const numberOfValues = Object.values(sessionToUpdate).filter(Boolean).length;

    if(numberOfValues == 0) {
      return res.status(400).json({ error: {message: `Update request must include: student_id, lesson_date, or next_session_info`} })
    }
    SessionsService.updateSession(req.app.patch.get('db'), req.params.session_id, sessionToUpdate)
      .then(numRowsAffected => { res.status(204).end() })
      .catch(next)
  })


module.exports = sessionsRouter;