'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Gather = mongoose.model('Gather'),
  GatherPeople = mongoose.model('GatherPeople'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
let app,
  agent,
  credentials,
  gather;

let gatherObj = {
  type: 'GO_TO_WORK',
  timePeriod: {
    from: 0,
    to: 3600
  },
  datePeriod: {
    from: new Date(),
    to: new Date()
  },
  gatherLocation: '唐家',
  targetLocation: 'SSP',
  default: true,
  people: []
};

let peopleObj = {
  userId: 'xxx',
  name: 'xxx',
  datePeriod: {
    from: new Date(),
    to: new Date()
  },
  phone: '133xxxxxxxx',
  leader: true
}

describe('Gather CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  it('should be able to get a list of gathers', (done) => {
    let gather1 = new Gather(gatherObj);
    let gather2 = new Gather(gatherObj);
    gather1.save(() => {
      gather2.save(() => {
        request(app).get('/api/gathers')
          .end((req, res) => {
            res.body.should.be.instanceof(Array).and.have.lengthOf(2);
            done();
          });
      })
    });
  });

  it('should be able to get a list of gathers with limit & offset', (done) => {
    let gather1 = new Gather(gatherObj);
    let gather2 = new Gather(gatherObj);
    gather1.save(() => {
      gather2.save(() => {
        request(app).get('/api/gathers?limit=1&offset=1')
          .end((req, res) => {
            res.body.should.be.instanceof(Array).and.have.lengthOf(1);
            done();
          });
      })
    });
  });

  it('should be able to create gather', (done) => {
    request(app)
      .post('/api/gathers?limit=1&offset=1')
      .send(gatherObj)
      .end((req, res) => {
        res.statusCode.should.be.exactly(200).and.be.a.Number();
        done();
      });
  });

  it('should be able to update gather', (done) => {
    let gather = new Gather(gatherObj);
    gather.save((err, doc) => {
      request(app)
        .put(`/api/gathers/${doc._id}`)
        .send(gatherObj)
        .end((req, res) => {
          res.statusCode.should.be.exactly(200).and.be.a.Number();
          done();
        });
    })
  });

  it('should be able to read a gather', (done) => {
    let gather = new Gather(gatherObj);
    gather.save((err, doc) => {
      request(app)
        .get(`/api/gathers/${doc._id}`)
        .end((req, res) => {
          res.body._id.should.be.exactly(doc._id.toString());
          done();
        });
    })
  });

  it('should be able to join a gather', (done) => {
    let gather1 = new Gather(gatherObj);
    gather1.save((err, doc) => {
      request(app).post(`/api/gathers/join/${doc._id}`)
        .send(peopleObj)
        .end((req, res) => {
          let people2 = Object.assign({}, peopleObj);
          people2.userId = 'test2';
          request(app).post(`/api/gathers/join/${doc._id}`)
            .send(people2)
            .end((req, res) => {
              res.body.people.should.be.instanceof(Array).and.have.lengthOf(2);
              done();
            })
        });
    });
  });

  it('should not be able to join a gather twice by same people', (done) => {
    let gather1 = new Gather(gatherObj);
    gather1.save((err, doc) => {
      request(app).post(`/api/gathers/join/${doc._id}`)
        .send(peopleObj)
        .end((req, res) => {
          request(app).post(`/api/gathers/join/${doc._id}`)
            .send(peopleObj)
            .end((req, res) => {
              res.body.people.should.be.instanceof(Array).and.have.lengthOf(1);
              done();
            })
        });
    });
  });

  it('should be able to leave a gather', (done) => {
    let gather1 = new Gather(gatherObj);
    let people = new GatherPeople(peopleObj);
    gather1.people = [people];
    gather1.save((err, doc) => {
      request(app).post(`/api/gathers/leave/${doc._id}`)
        .send(peopleObj)
        .end((req, res) => {
          res.body.people.should.be.instanceof(Array).and.have.lengthOf(0);
          done();
        });
    });
  });

  afterEach((done) => {
    Gather.remove().exec(done);
  });
});
