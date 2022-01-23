const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const app = require('../app');
const request = require('supertest');
const { deleteCommentById } = require('../models/comments.model.js');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('/api/topics', () => {
  describe('GET', () => {
    it('status: 200 and return an array of all topics ', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
          const { topics } = body;
          expect(topics).toBeInstanceOf(Array);
          expect(topics).toHaveLength(3);
          topics.forEach((topic) => {
            expect(topic).toEqual({
              description: expect.any(String),
              slug: expect.any(String),
            });
          });
        });
    });

    it("status: 404 and return message 'Invalid url' ", () => {
      return request(app)
        .get('/api/tropics')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Invalid url');
        });
    });
  });
});

describe('/api/articles/:article_id', () => {
  describe('GET', () => {
    it('status: 200 and returns the article with the given article id', () => {
      return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article).toBeInstanceOf(Object);
          expect(article).toEqual({
            author: expect.any(String),
            title: expect.any(String),
            topic: expect.any(String),
            article_id: expect.any(Number),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
          });
          expect(article).toEqual({
            author: 'butter_bridge',
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            article_id: 1,
            body: 'I find this existence challenging',
            created_at: '2020-07-09T21:11:00.000Z',
            votes: 100,
            comment_count: '11',
          });
        });
    });
    it('status: 404 and returns message for valid article id that does not exist', () => {
      return request(app)
        .get('/api/articles/1000')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Not Found');
        });
    });
    it('status: 400 and returns message for invalid article id', () => {
      return request(app)
        .get('/api/articles/pip')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Invalid input');
        });
    });
  });

  describe('PATCH', () => {
    it('status: 200 and returns with the updated article', () => {
      const articleUpdated = {
        votes: -10,
      };
      return request(app)
        .patch('/api/articles/1')
        .send(articleUpdated)
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual({
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: '2020-07-09T21:11:00.000Z',
            votes: 90,
          });
        });
    });
    it('status: 200 and return the unchanged article when the request body is an empty object', () => {
      const articleUpdated = {};
      return request(app)
        .patch('/api/articles/10')
        .send(articleUpdated)
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual({
            article_id: 10,
            title: 'Seven inspirational thought leaders from Manchester UK',
            topic: 'mitch',
            author: 'rogersop',
            body: "Who are we kidding, there is only one, and it's Mitch!",
            created_at: '2020-05-14T05:15:00.000Z',
            votes: 0,
          });
        });
    });
    it('status: 200 and returns the unchanged article when one property of the the request body has an syntax error', () => {
      const articleUpdated = {
        votres: 1,
      };
      return request(app)
        .patch('/api/articles/1')
        .send(articleUpdated)
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual({
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: '2020-07-09T21:11:00.000Z',
            votes: 100,
          });
        });
    });
    it('status 400 and returns message for incorrect type provided in the request body', () => {
      const articleUpdated = {
        votes: 'hello',
      };
      return request(app)
        .patch('/api/articles/5')
        .send(articleUpdated)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad Request');
        });
    });
    it('status: 404 and returns message for valid article id that does not exist', () => {
      return request(app)
        .patch('/api/articles/70')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Not Found');
        });
    });
    it('status: 400 and returns message for invalid article id', () => {
      return request(app)
        .patch('/api/articles/jug')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Invalid input');
        });
    });
  });
});

describe('/api/articles', () => {
  describe('GET', () => {
    it('status: 200 and return an array of all articles ', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(12);
          articles.forEach((article) => {
            expect(article).toEqual({
              author: expect.any(String),
              title: expect.any(String),
              topic: expect.any(String),
              article_id: expect.any(Number),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String),
            });
          });
        });
    });
    it('QUERY: sorted by date and descending order by default,status: 200 and return the array of all articles are', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSortedBy('created_at', { descending: true });
        });
    });
    it('QUERY: ascending order,status: 200 and return the array of all articles', () => {
      return request(app)
        .get('/api/articles?order=ASC')
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSortedBy('created_at', { descending: false });
        });
    });
    it('QUERY: sorted by any query and any order,status: 200 and return array of all articles', () => {
      return request(app)
        .get('/api/articles?order=ASC&sort_by=title')
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSortedBy('title', { descending: false });
        });
    });
    it('QUERY: by topic,status: 200 and returns an array of articles filter by topic', () => {
      return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toHaveLength(11);
          articles.forEach((article) => {
            expect(article.topic).toBe('mitch');
          });
        });
    });
    it('QUERY: by topic,status: 200 and returns an empty array of articles filter by topic', () => {
      return request(app)
        .get('/api/articles?topic=paper')
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toHaveLength(0);
        });
    });
    it("Non-existing Route - status: 404 and return message 'Invalid url' ", () => {
      return request(app)
        .get('/api/artricles')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Invalid url');
        });
    });
    it('status: 400 and return an error message for invalid query(sort_by)', () => {
      return request(app)
        .get('/api/articles?sort_by=invalid_property')
        .expect(400)
        .then(({ body }) => {
          expect(body['msg']).toBe('Invalid query');
        });
    });
    it('status: 400 and return an error message for invalid query(order)', () => {
      return request(app)
        .get('/api/articles?order=1')
        .expect(400)
        .then(({ body }) => {
          expect(body['msg']).toBe('Invalid query');
        });
    });
    it('status: 400 and return an error message for invalid query(topic)', () => {
      return request(app)
        .get('/api/articles?topic=1')
        .expect(400)
        .then(({ body }) => {
          expect(body['msg']).toBe('Invalid query');
        });
    });
  });
});

describe('/api/articles/:article_id/comments', () => {
  describe('GET', () => {
    it('status: 200 and return an array of comment for the given article id', () => {
      return request(app)
        .get('/api/articles/3/comments')
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments).toBeInstanceOf(Array);
          comments.forEach((comment) => {
            expect(comment).toEqual({
              comment_id: expect.any(Number),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            });
          });
        });
    });
    it('status: 200 and return empty array object for article id that exist but does not have any comment', () => {
      return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments.length).toBe(0);
        });
    });
    it('status: 404 and returns message for valid article id that does not exist', () => {
      return request(app)
        .get('/api/articles/1000/comments')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Not Found');
        });
    });
    it('status: 400 and returns message for invalid article id', () => {
      return request(app)
        .get('/api/articles/pip/comments')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Invalid input');
        });
    });
  });
  describe('POST', () => {
    it('status: 201 and returns with the posted comments', () => {
      const commentToAdd = {
        username: 'lurker',
        body: 'Where is the King? I will lead the fight',
      };
      return request(app)
        .post('/api/articles/3/comments')
        .send(commentToAdd)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toEqual({
            comment_id: 19,
            article_id: 3,
            author: 'lurker',
            body: 'Where is the King? I will lead the fight',
            created_at: expect.any(String),
            votes: 0,
          });
        });
    });
    it('status: 400 and return message when request body missing a field', () => {
      const commentToAdd = {
        username: 'rogersop',
      };
      return request(app)
        .post('/api/articles/1/comments')
        .send(commentToAdd)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad Request');
        });
    });
    it('status: 400 and return message when request body property is mispelled', () => {
      const commentToAdd = {
        usernames: 'rogersop',
        body: 'Tasha makes people feel like she is on their side so they can spill the beans',
      };
      return request(app)
        .post('/api/articles/1/comments')
        .send(commentToAdd)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad Request');
        });
    });
    it('status: 400 and return message when request body property is empty object', () => {
      const commentToAdd = {};
      return request(app)
        .post('/api/articles/1/comments')
        .send(commentToAdd)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad Request');
        });
    });

    it('status: 404 and returns message for valid article id that does not exist', () => {
      const commentToAdd = {
        username: 'rogersop',
        body: 'Tasha makes people feel like she is on their side so they can spill the beans',
      };
      return request(app)
        .post('/api/articles/1000/comments')
        .send(commentToAdd)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Not Found');
        });
    });
    it('status: 400 and returns message for invalid article id', () => {
      const commentToAdd = {
        username: 'rogersop',
        body: 'Tasha makes people feel like she is on their side so they can spill the beans',
      };
      return request(app)
        .post('/api/articles/pip/comments')
        .expect(400)
        .send(commentToAdd)
        .then(({ body }) => {
          expect(body.msg).toBe('Invalid input');
        });
    });
  });
});

describe('/api/comments/:comment_id', () => {
  describe('DELETE', () => {
    it('status: 204 and return no content', () => {
      return request(app).delete('/api/comments/2').expect(204);
    });
    it('status: 404 and returns message for valid comment id that does not exist', () => {
      return request(app)
        .delete('/api/comments/0')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Not Found');
        });
    });
    it('status: 400 and returns message for invalid comment id', () => {
      return request(app)
        .delete('/api/comments/dog')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Invalid input');
        });
    });
  });
  describe('PATCH', () => {
    it('status 200 and returns with the updated comment', () => {
      const commentUpdated = {
        votes: 10,
      };
      return request(app)
        .patch('/api/comments/2')
        .send(commentUpdated)
        .expect(200)
        .then(({ body }) => {
          expect(body.comment).toEqual({
            comment_id: 2,
            article_id: 1,
            author: 'butter_bridge',
            body: 'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
            created_at: '2020-10-31T03:03:00.000Z',
            votes: 24,
          });
        });
    });

    it('status: 200 and return the unchanged article when the request body is an empty object', () => {
      const commentUpdated = {};
      return request(app)
        .patch('/api/comments/8')
        .send(commentUpdated)
        .expect(200)
        .then(({ body }) => {
          expect(body.comment).toEqual({
            comment_id: 8,
            article_id: 1,
            author: 'icellusedkars',
            body: 'Delicious crackerbreads',
            created_at: '2020-04-14T21:19:00.000Z',
            votes: 0,
          });
        });
    });
    it('status: 200 and returns the unchanged article when one property of the the request body has an syntax error', () => {
      const commentUpdated = {
        votres: 1,
      };
      return request(app)
        .patch('/api/comments/5')
        .send(commentUpdated)
        .expect(200)
        .then(({ body }) => {
          expect(body.comment).toEqual({
            comment_id: 5,
            article_id: 1,
            author: 'icellusedkars',
            body: 'I hate streaming noses',
            created_at: '2020-11-03T21:00:00.000Z',
            votes: 0,
          });
        });
    });
    it('status: 400 and returns message for incorrect type provided in the request body', () => {
      const commentUpdated = {
        votes: 'hello',
      };
      return request(app)
        .patch('/api/articles/5')
        .send(commentUpdated)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad Request');
        });
    });
    it('status: 404 and returns message for valid comment id that does not exist', () => {
      return request(app)
        .patch('/api/comments/90')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Not Found');
        });
    });
    it('status: 400 and returns message for invalid comment id', () => {
      return request(app)
        .patch('/api/comments/break')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Invalid input');
        });
    });
  });
});

describe('/api/users', () => {
  describe('GET', () => {
    it('status: 200 and return array of all users', () => {
      return request(app)
        .get('/api/users')
        .expect(200)
        .then(({ body }) => {
          const { users } = body;
          expect(users).toBeInstanceOf(Array);
          expect(users).toHaveLength(4);
          users.forEach((user) => {
            expect(user).toEqual({
              username: expect.any(String),
            });
          });
        });
    });
    it("status: 404 and return message 'Invalid url' ", () => {
      return request(app)
        .get('/api/ussers')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Invalid url');
        });
    });
  });
});

describe('/api/users/:username', () => {
  describe('GET', () => {
    it('status: 200 and returns the user with the given username', () => {
      return request(app)
        .get('/api/users/rogersop')
        .expect(200)
        .then(({ body }) => {
          const { user } = body;
          expect(user).toBeInstanceOf(Object);
          expect(user).toEqual({
            username: expect.any(String),
            avatar_url: expect.any(String),
            name: expect.any(String),
          });
        });
    });
    it('status: 404 and return message when the username is valid but it does not exist', () => {
      return request(app)
        .get('/api/users/georges')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Not Found');
        });
    });
  });
});

describe('/api', () => {
  describe('GET', () => {
    it('status: 200 and return all the available endpoints', () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then(({ body }) => {
          const endpoint = body;
          expect(endpoint).toBeInstanceOf(Object);
        });
    });
    it('status: 200 and return all the available endpoints', () => {
      return request(app)
        .get('/apres')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Invalid url');
        });
    });
  });
});
