const express = require('express');
const path = require('path');
// const cuid = require('cuid');
const xss = require('xss');
const TopicsService = require('./topics-service.js');

const topicsRouter = express.Router();
const jsonParser = express.json();


const topicFormat = topic => ({
  id: topic.id,
  lesson_id: topic.lesson_id,
  lesson_date: topic.lesson_date,
  student_id: topic.student_id,
  topic_name: xss(topic.topic_name),
  topic_content: xss(topic.topic_content)
});

topicsRouter
  .route('/')
  .get((req, res, next) => {
    TopicsService.getAllTopics(req.app.get('db'))
      .then(topics => {
        res.json(topics.map(topicFormat))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { lesson_id, student_id, topic_name, topic_content } = req.body;
    const newTopic = { lesson_id, student_id, topic_name, topic_content };
    const requiredFields = { lesson_id, student_id, topic_name };

    for (const [key, value] of Object.entries(requiredFields)) {
      if (value == null) {
        return res.status(400).json({ error: { message: `Request body must include '${key}' `}});
      }
    }
    TopicsService.addTopic(req.app.get('db'), newTopic)
      .then(topic => {
        res.status(201)
          .location(path.posix.join(req.originalUrl +`/${topic.id}`))
          .json(topicFormat(topic))
      })
      .catch(next)
  })

topicsRouter.route('/:student_id')
  .get((req, res) => {
    TopicsService.getDistinctTopicsByStudent(req.app.get('db'), req.params.student_id)
    .then(topics => {
      if(!topics) {return res.status(404).json({error: {message: 'No topics found for this student'}})}
      return res.json(topics)
    })
  })

topicsRouter.route('/session/:session_id')
  .get((req, res) => {
    TopicsService.getAllTopicsBySession(req.app.get('db'), req.params.session_id)
    .then(topics => {
      res.json(topics.map(topicFormat))
    })
  })

topicsRouter.route('/:topic/:student_id')
  .get((req, res) => {
    TopicsService.getSpecificStudentTopic(req.app.get('db'), req.params.topic, req.params.student_id)
      .then(topics => {
        res.json(topics.map(topicFormat))
      })
  })

topicsRouter.route('/:topic_id')
  .all((req, res, next) => {
    TopicsService.getTopicById( req.app.get('db'), req.params.topic_id )
      .then(topic => {
        if(!topic) { return res.status(404).json({error: {message: 'Topic does not exist'} }) }
        res.topic = topic;
        next();
      })
      .catch(next)
  })
  .get((req, res) => {
    return res.json(topicFormat(topic))
  })
  .delete((req, res, next) => {
    TopicsService.deleteTopic( req.app.get('db'), req.params.topic_id )
    .then(() => { res.status(204).end() })
    .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { topic_id, lesson_date, next_topic_info } = req.body;
    const topicToUpdate = { topic_id, lesson_date, next_topic_info };
    const numberOfValues = Object.values(topicToUpdate).filter(Boolean).length;

    if(numberOfValues == 0) {
      return res.status(400).json({ error: {message: `Update request must include: topic_id, lesson_date, or next_topic_info`} })
    }
    TopicsService.updateTopic(req.app.patch.get('db'), req.params.topic_id, topicToUpdate)
      .then(numRowsAffected => { res.status(204).end() })
      .catch(next)
  })


module.exports = topicsRouter;