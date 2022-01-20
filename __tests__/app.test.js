const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const app = require('../app');
const request = require('supertest');

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
    it('status: 200 and returns the article with the given article_id', () => {
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
        });
    });
    it('status 404 and returns message "Not Found" for aricle_id that does not exist', () => {
      return request(app)
        .get('/api/articles/1000')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Not Found');
        });
    });
    it('status: 400 and returns message "Bad Request" for invalide article_id', () => {
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
    it('status: 200 and return the article with empty object', () => {
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
    it('status: 200 and returns the article without changing the vote', () => {
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
    it('status 400 and returns message "Bad Request" for incorrect type provided', () => {
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
    it('status 200 and the array of all articles are sorted by date', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSortedBy('created_at', { descending: true });
        });
    });
    it('status 200 and return the array of all articles in descending order', () => {
      return request(app)
        .get('/api/articles?order=DESC')
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSortedBy('created_at', { descending: true });
        });
    });
    it('status 200 and the array of all articles are sorted by any query and any order', () => {
      return request(app)
        .get('/api/articles?order=ASC&sort_by=title')
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSortedBy('title', { descending: false });
        });
    });
    it("status: 404 and return message 'Invalid Url' ", () => {
      return request(app)
        .get('/api/artricles')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Invalid Url');
        });
    });
    it('returns 400 and an error message ', () => {
      return request(app)
        .get('/api/articles?sort_by=invalid_property')
        .expect(400)
        .then(({ body }) => {
          expect(body['msg']).toBe('Invalid query');
        });
    });
    it('return 200 and returns an array of articles with mitch as topic', () => {
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
  });
});

describe('/api/articles/:article_id/comments', () => {
  describe('GET', () => {
    it('status: 200 and return an array of comment for the given article_id', () => {
      return request(app)
        .get('/api/articles/2/comments')
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
  });
  describe('POST', () => {
    it('status 201 and returns with the posted comments', () => {
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
            created_at: new Date(),
            votes: 0,
          });
        });
    });
  });
});

describe('/api/comments/:comment_id', () => {
  describe('DELETE', () => {
    it('status: 204 and return no content', () => {
      return request(app).delete('/api/comments/2').expect(204);
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
            created_at: new Date(1594329060000),
            votes: 24,
          });
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
  });
});
