const knex = require('knex');
const app = require('../src/app.js');

describe('Roster Endpoints', () => {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())
  before('cleanup', () => db('feedbacktracker').truncate())
  afterEach('cleanup', () => db('feedbacktracker').truncate())

  describe(`Unauthorized requests`, () => {
    const testStudents = fixtures.makeStudentsArray()

    beforeEach('insert students', () => {
      return db
        .into('studentroster')
        .insert(testStudents)
    })

/*    it(`responds with 401 Unauthorized for GET /students`, () => {
      return supertest(app)
        .get('/students')
        .expect(401, { error: 'Unauthorized request' })
    })

    it(`responds with 401 Unauthorized for POST /students`, () => {
      return supertest(app)
        .post('/students')
        .send({ first_name: 'SampleName', last_name: 'MyLastName', phone: '222-222-2222', email: 'me@mail.com', other_info: 'more stuff I need to know' })
        .expect(401, { error: 'Unauthorized request' })
    })

    it(`responds with 401 Unauthorized for GET /students/:id`, () => {
      const secondStudent = testStudents[1]
      return supertest(app)
        .get(`/students/${secondStudent.id}`)
        .expect(401, { error: 'Unauthorized request' })
    })

    it(`responds with 401 Unauthorized for DELETE /students/:id`, () => {
      const aStudent = testStudents[1]
      return supertest(app)
        .delete(`/students/${aStudent.id}`)
        .expect(401, { error: 'Unauthorized request' })
    })
  })
*/

  describe('GET /students', () => {
    context(`Given no students`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/students')
//          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, [])
      })
    })

    context('Given there are students in the database', () => {
      const testStudents = fixtures.makeStudentsArray()

      beforeEach('insert students', () => {
        return db
          .into('studentroster')
          .insert(testStudents)
      })

      it('gets the students from the store', () => {
        return supertest(app)
          .get('/students')
          .expect(200, testStudents)
      })
    })

    context(`Given XSS attack data`, () => {
      const { maliciousData, expectedData } = fixtures.makeMaliciousData()

      beforeEach('insert malicious data', () => {
        return db
          .into('studentroster')
          .insert([maliciousData])
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/students`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].first_name).to.eql(expectedData.first_name)
            expect(res.body[0].last_name).to.eql(expectedData.last_name)
          })
      })
    })
  })

  describe('GET /students/:id', () => {
    context(`Given no students`, () => {
      it(`responds 404 the student doesn't exist`, () => {
        return supertest(app)
          .get(`/students/123`)
          .expect(404, {
            error: { message: `Student Not Found` }
          })
      })
    })

    context('Given there are students in the database', () => {
      const testStudents = fixtures.makeStudentsArray()

      beforeEach('insert students', () => {
        return db
          .into('studentroster')
          .insert(testStudents)
      })

      it('responds with 200 and the specified student', () => {
        const studentId = 2
        const expectedStudent = testStudents[studentId - 1]
        return supertest(app)
          .get(`/students/${studentId}`)
          .expect(200, expectedStudent)
      })
    })

    context(`Given an XSS attack`, () => {
      const { maliciousData, expectedData } = fixtures.makeMaliciousData()

      beforeEach('insert malicious data', () => {
        return db
          .into('studentroster')
          .insert([maliciousData])
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/students/${maliciousData.id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.first_name).to.eql(expectedData.first_name)
            expect(res.body.last_name).to.eql(expectedData.last_name)
          })
      })
    })
  })

  describe('DELETE /students/:id', () => {
    context(`Given no students`, () => {
      it(`responds 404 whe student doesn't exist`, () => {
        return supertest(app)
          .delete(`/students/123`)
          .expect(404, {
            error: { message: `Student Not Found` }
          })
      })
    })

    context('Given there are students in the database', () => {
      const testStudents = fixtures.makeStudentsArray()

      beforeEach('insert students', () => {
        return db
          .into('studentroster')
          .insert(testStudents)
      })

      it('removes the student by ID from the store', () => {
        const idToRemove = 2
        const expectedStudents = testStudents.filter(student => student.id !== idToRemove)
        return supertest(app)
          .delete(`/students/${idToRemove}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(204)
          .then(() =>
            supertest(app)
              .get(`/students`)
              .expect(expectedStudents)
          )
      })
    })
  })

  describe('POST /students', () => {
    it(`responds with 400 missing 'name' if not supplied`, () => {
      const newStudentMissingFirstName = {
        //first_name: 'Mary',
        last_name: 'BoPeep',
        phone: '888-222-2222',
        email: 'mbp@mail.com',
        other_info: 'stuff we must know'
      }
      return supertest(app)
        .post(`/students`)
        .send(newStudentMissingFirstName)
        .expect(400, {
          error: { message: `'name' is required` }
        })
    })

    it(`responds with 400 missing 'url' if not supplied`, () => {
      const newStudentMissingLastName = {
        first_name: 'Mary',
        //last_name: 'BoPeep',
        phone: '888-222-2222',
        email: 'mbp@mail.com',
        other_info: 'stuff we must know'
      }
      return supertest(app)
        .post(`/students`)
        .send(newStudentMissingLastName)
        .expect(400, {
          error: { message: `'last name' is required` }
        })
    })


    it('adds a new student to the store', () => {
      const newStudent = {
        first_name: 'Mary',
        last_name: 'BoPeep',
        phone: '888-222-2222',
        email: 'mbp@mail.com',
        other_info: 'stuff we must know'
      }
      return supertest(app)
        .post(`/students`)
        .send(newStudent)
        .expect(201)
        .expect(res => {
          expect(res.body.first_name).to.eql(newStudent.first_name)
          expect(res.body.last_name).to.eql(newStudent.last_name)
          expect(res.body.phone).to.eql(newStudent.phone)
          expect(res.body.email).to.eql(newStudent.email)
          expect(res.body.other_info).to.eql(newStudent.other_info)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/students/${res.body.id}`)
        })
        .then(res =>
          supertest(app)
            .get(`/students/${res.body.id}`)
            .expect(res.body)
        )
    })

    it('removes XSS attack content from response', () => {
      const { maliciousData, expectedData } = fixtures.makeMaliciousData()
      return supertest(app)
        .post(`/students`)
        .send(maliciousData)
        .expect(201)
        .expect(res => {
          expect(res.body.first_name).to.eql(expectedData.first_name)
          expect(res.body.last_name).to.eql(expectedData.last_name)
        })
    })
  })
})