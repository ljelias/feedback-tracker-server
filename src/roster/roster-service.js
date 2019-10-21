const RosterService = {
  getAllStudents(knex) {
    return knex('studentroster')
      .select('*');
  },
  addStudent(knex, newStudent) {
    return knex('studentroster')
      .insert(newStudent)
      .returning('*')
      .then(rows => { return rows[0]});
  },
  getStudentById(knex, id) {
    return knex('studentroster')
      .select('*')
      .where('id', id); //NEEDED? .first();
  },
  deleteStudent(knex, id) {
    return knex('studentroster')
      .where('id', id)
      .delete();
  },
  updateStudent(knex, id, updatedStudentInfo) {
    return knex('studentroster')
      .where('id', id)
      .update(updatedStudentInfo);
  }
}

module.exports = RosterService;