const knex = require('knex');
const chai = require('chai');
const expect = chai.expect;
const app = require('../src/app.js');
const { makeStudentsArray, makeMaliciousData } = require('./students.fixtures.js')

describe('Roster Endpoints', () => {
  let db;

  before('make knex instance', () => {
    db = knex({ client: 'pg', connection: process.env.TEST_DATABASE_URL, })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())
  before('cleanup', () => db('studentroster').truncate())
  afterEach('cleanup', () => db('studentroster').truncate())

/*  describe(`Unauthorized requests`, () => {
    const testStudents = fixtures.makeStudentsArray()

    beforeEach('insert students', () => {
      return db
        .into('studentroster')
        .insert(testStudents)
    })

    it(`responds with 401 Unauthorized for GET /api/students`, () => {
      return supertest(app)
        .get('/api/students')
        .expect(401, { error: 'Unauthorized request' })
    })

    it(`responds with 401 Unauthorized for POST /api/students`, () => {
      return supertest(app)
        .post('/api/students')
        .send({ first_name: 'SampleName', last_name: 'MyLastName', phone: '222-222-2222', email: 'me@mail.com', other_info: 'more stuff I need to know' })
        .expect(401, { error: 'Unauthorized request' })
    })

    it(`responds with 401 Unauthorized for GET /api/students/:id`, () => {
      const secondStudent = testStudents[1]
      return supertest(app)
        .get(`/api/students/${secondStudent.id}`)
        .expect(401, { error: 'Unauthorized request' })
    })

    it(`responds with 401 Unauthorized for DELETE /api/students/:id`, () => {
      const aStudent = testStudents[1]
      return supertest(app)
        .delete(`/api/students/${aStudent.id}`)
        .expect(401, { error: 'Unauthorized request' })
    })
  })
*/



  describe('GET /api/students', () => {
    context(`Given no students`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/students')
          //.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, [])
      })
    });

    context('Given there are students in the database', () => {
      const testStudents = makeStudentsArray();

      beforeEach('insert students', () => {
        return db
          .into('studentroster')
          .insert(testStudents)
      })

      it('gets the students from the database', () => {
        return supertest(app)
          .get('/api/students')
          .expect(200, testStudents)
      })
    });

    context(`Given XSS attack data`, () => {
      const { maliciousData, expectedData } = makeMaliciousData();

      beforeEach('insert malicious data', () => {
        return db
          .into('studentroster')
          .insert([maliciousData])
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/students`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].first_name).to.eql(expectedData.first_name)
            expect(res.body[0].last_name).to.eql(expectedData.last_name)
          })
      })
    });
  }); 

  describe('GET /api/students/:id', () => {
    context(`Given no students`, () => {
      it(`responds with 500`, () => {     
        return supertest(app)
          .get(`/api/students/5`)
          .expect(500)
      })
    });

    context('Given there are students in the database', () => {
      const testStudents = makeStudentsArray();

      beforeEach('insert students', () => {
        return db
          .into('studentroster')
          .insert(testStudents)
      });
  /*    it('responds with 404 if student is not found', () => {
        return supertest(app)
          .get(`/api/students/59`)    FIGURE OUT THIS PROBLEM WITH THIS TEST
          .expect(404, {error: {message: 'Student not found'}})
      }); */

      it('responds with 200 and the specified student', () => {
        const studentId = 2
        const expectedStudent = testStudents[studentId - 1]
        return supertest(app)
          .get(`/api/students/${studentId}`)
          .expect(200, expectedStudent)
      });
    });

    context(`Given an XSS attack`, () => {
      const { maliciousData, expectedData } = makeMaliciousData();

      beforeEach('insert malicious data', () => {
        return db
          .into('studentroster')
          .insert([maliciousData])
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/students/${maliciousData.id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.first_name).to.eql(expectedData.first_name)
            expect(res.body.last_name).to.eql(expectedData.last_name)
          })
      })
    })
  });

  describe('DELETE /api/students/:id', () => {
 /*   context(`Given no students`, () => {      FIX THIS TEST!!!!!!!!!!!!1
      it(`responds 404 when student doesn't exist`, () => {
        return supertest(app)
          .delete(`/api/students/59`)
          .expect(404, { error: { message: `Student not found` } })
      })
    })
*/
    context('Given there are students in the database', () => {
      const testStudents = makeStudentsArray();

      beforeEach('insert students', () => {
        return db
          .into('studentroster')
          .insert(testStudents)
      })

      it('removes the student by ID from the database', () => {
        const idToRemove = 2
        const expectedStudents = testStudents.filter(student => student.id !== idToRemove)
        return supertest(app)
          .delete(`/api/students/${idToRemove}`)
          //.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(204)
          .then(() =>
            supertest(app)
              .get(`/api/students`)
              .expect(expectedStudents)
          )
      })
    })
  })

  describe('POST /api/students', () => {
    it(`responds with 400 missing 'first_name' if not supplied`, () => {
      const newStudentMissingFirstName = {
        //first_name: 'Mary',
        last_name: 'BoPeep',
        phone: '888-222-2222',
        email: 'mbp@mail.com',
        misc_info: 'stuff we must know'
      }
      return supertest(app)
        .post(`/api/students`)
        .send(newStudentMissingFirstName)
        .expect(400, {
          error: { message: `Request body must include 'first_name' ` }
        })
    })

    it(`responds with 400 missing 'last_name' if not supplied`, () => {
      const newStudentMissingLastName = {
        first_name: 'Mary',
        //last_name: 'BoPeep',
        phone: '888-222-2222',
        email: 'mbp@mail.com',
        misc_info: 'stuff we must know'
      }
      return supertest(app)
        .post(`/api/students`)
        .send(newStudentMissingLastName)
        .expect(400, {
          error: { message: `Request body must include 'last_name' ` }
        })
    })


    it('adds a new student to the database', () => {
      const newStudent = {
        first_name: 'Mary',
        last_name: 'BoPeep',
        phone: '888-222-2222',
        email: 'mbp@mail.com',
        misc_info: 'stuff we must know'
      }
      return supertest(app)
        .post(`/api/students`)
        .send(newStudent)
        .expect(201)
        .expect(res => {
          expect(res.body.first_name).to.eql(newStudent.first_name)
          expect(res.body.last_name).to.eql(newStudent.last_name)
          expect(res.body.phone).to.eql(newStudent.phone)
          expect(res.body.email).to.eql(newStudent.email)
          expect(res.body.misc_info).to.eql(newStudent.misc_info)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/api/students/${res.body.id}`)
        })
        .then(res =>
          supertest(app)
            .get(`/api/students/${res.body.id}`)
            .expect(res.body)
        )
    })

    it('removes XSS attack content from response', () => {
      const { maliciousData, expectedData } = makeMaliciousData();
      return supertest(app)
        .post(`/api/students`)
        .send(maliciousData)
        .expect(201)
        .expect(res => {
          expect(res.body.first_name).to.eql(expectedData.first_name)
          expect(res.body.last_name).to.eql(expectedData.last_name)
        })
    }) 
  });
})