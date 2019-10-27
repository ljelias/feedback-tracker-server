const RosterService = require('../src/roster/roster-service.js');
const knex = require('knex');

  describe(`roster-service object`, function() {
    let db;

    let testRoster = [
      {
        id: 1,
        first_name: 'Sam',
        last_name: 'Student',
        phone: '888-777-6666',
        email: 'sam.s@mail.com',
        misc_info: 'will change to weekly in July'
      },
      {
        id: 2,
        first_name: 'Eva',
        last_name: 'Estudiante',
        phone: '701-999-8888',
        email: 'ee@mail.com',
        misc_info: 'needs to prep for conference presentation in Aug'
      },
      {
        id: 3,
        first_name: 'Jan',
        last_name: 'Jansen',
        phone: '701-777-6666',
        email: 'jj@mail.com',
        misc_info: 'work phone - 866-555-4444'
      }
    ];

    before(() => {
      db = knex({client: 'pg', connection: process.env.TEST_DATABASE_URL,})
    });
    before (() => {
      return db.into('studentroster')
        .insert(testRoster)
    });
    afterEach(() => db('studentroster').truncate());
    after(() => db.destroy());
    before(() => db('studentroster').truncate());

  describe(`getAllStudents()`, () => {
    context(`Given 'studentroster' has data`, () => {
      beforeEach (() => {
        return db.into('studentroster')
          .insert(testRoster)
      });
  
      it(`retrieves all students from 'studentroster' table`, () => {
        return RosterService.getAllStudents(db)
          .then(actual => { expect(actual).to.eql(testRoster) })
      })
      it(`getStudentById retrieves a student by id from 'studentroster' table`, () => {
        const thirdId = 3
        const thirdTestStudent = testRoster[thirdId - 1]
        return RosterService.getStudentById(db, thirdId)
          .then(actual => {
            expect(actual).to.eql([{
              id: thirdId,
              first_name: 'Jan',
              last_name: 'Jansen',
              phone: '701-777-6666',
              email: 'jj@mail.com',
              misc_info: 'work phone - 866-555-4444'
            }])
          })
      })
      it(`deleteStudent removes student by id from 'studentroster' table`, () => {
        const studentId = 3
        return RosterService.deleteStudent(db, studentId)
          .then(() => RosterService.getAllStudents(db))
          .then(allStudents => {
            const expected = testRoster.filter(student => student.id !== studentId);
            expect(allStudents).to.eql(expected)
          })
      })
      it(`updateStudent updates a student from 'studentroster' table`, () => {
        const idOfStudentToUpdate = 3;
        const newStudentData = {
          first_name: 'Janice',
          phone: '701-772-6666'
        }
        return RosterService.updateStudent(db, idOfStudentToUpdate, newStudentData)
          .then(() => RosterService.getStudentById(db, idOfStudentToUpdate))
          .then(student => {
            expect(student).to.eql([{
              id: idOfStudentToUpdate,
              last_name: 'Jansen',
              email: 'jj@mail.com',
              misc_info: 'work phone - 866-555-4444',
              ...newStudentData,
            }])
          })
      })

    })
    context(`If 'studentroster' has no data`, () => {
      it(`getAllStudents() resolves an empty array`, () => {
        return RosterService.getAllStudents(db)
          .then(actual => { expect(actual).to.eql([]) })
      })
      it(`addStudent adds a new student and resolves the new student with an 'id'`, () => {
        const newStudent = {
            first_name: 'Una',
            last_name: 'Luna',
            phone: '701-333-4444',
            email: 'una@mail.com',
            misc_info: 'supervisor contact super@umn.edu'
        }
        return RosterService.addStudent(db, newStudent)
          .then(actual => {
            expect(actual).to.eql({
              id: 1,
              first_name: 'Una',
              last_name: 'Luna',
              phone: '701-333-4444',
              email: 'una@mail.com',
              misc_info: 'supervisor contact super@umn.edu'
            })
          })
      })

    })

  })
})


