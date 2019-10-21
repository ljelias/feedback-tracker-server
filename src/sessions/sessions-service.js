const SessionsService = {
  getAllSessions(knex) {
    return knex('tutoringsessions')
      .select('*');
  },
  addSession(knex, newSession) {
    return knex('tutoringsessions')
      .insert(newSession)
      .returning('*')
      .then(rows => { return rows[0]});
  },
  getSessionById(knex, id) {
    return knex('tutoringsessions')
      .select('*')
      .where('id', id); //NEEDED? .first();
  },
  getSessionsByStudentId(knex, id) {
    return knex('tutoringsessions')
      .select('*')
      .where('student_id', id)
  },
  deleteSession(knex, id) {
    return knex('tutoringsessions')
      .where('id', id)
      .delete();
  },
  updateSession(knex, id, updatedSessionInfo) {
    return knex('tutoringsessions')
      .where('id', id)
      .update(updatedSessionInfo);
  }
}

module.exports = SessionsService;