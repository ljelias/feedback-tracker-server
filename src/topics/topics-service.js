const TopicsService = {
  getAllTopics(knex) {
    return knex('lessontopics')
      .select('*');
  },
  addTopic(knex, newTopic) {
    return knex('lessontopics')
      .insert(newTopic)
      .returning('*')
      .then(rows => { return rows[0]});
  },
  getDistinctTopicsByStudent(knex, student_id){
    return knex('lessontopics')
      .distinct('topic_name')
      .where('student_id', student_id)
  },
  getAllTopicsBySession(knex, session_id){
    return knex('lessontopics')
      .select('*')
      .where('lesson_id', session_id)
  },
  getSpecificStudentTopic(knex, topic, student_id) {
    return knex.from('lessontopics')
    .select('lesson_id', 'lesson_date', 'topic_name', 'topic_content')
    .where({
      topic_name: topic,
      student_id: student_id
    })
//    .innerJoin('tutoringsessions', 'lessontopics.lesson_id', 'tutoringsessions.id')
//    .select('tutoringsessions.lesson_date', 'lessontopics.topic_name', 'lessontopics.student_id','lessontopics.topic_content')
  },
  getTopicById(knex, id) {
    return knex('lessontopics')
      .select('*')
      .where('id', id); //NEEDED? .first();
  },
  deleteTopic(knex, id) {
    return knex('lessontopics')
      .where('id', id)
      .delete();
  },
  updateTopic(knex, id, updatedTopicInfo) {
    return knex('lessontopics')
      .where('id', id)
      .update(updatedTopicInfo);
  }
}

module.exports = TopicsService;