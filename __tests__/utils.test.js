const db = require("../db/connection.js");
const util = require("../db/utils/index");

afterAll(() => db.end());
// SEED FUNCTIONS
describe("UTIL: formatTropicsData", () => {
  test("original data is not mutated", () => {
    const topicData = [
      {
        description: "The man, the Mitch, the legend",
        slug: "mitch",
      },
      {
        description: "Not dogs",
        slug: "cats",
      },
    ];

    util.formatTopicsData(topicData);
    expect(topicData).toEqual([
      {
        description: "The man, the Mitch, the legend",
        slug: "mitch",
      },
      {
        description: "Not dogs",
        slug: "cats",
      },
    ]);
  });
  test("Returns an empty array given an empty array", () => {
    expect(util.formatTopicsData([])).toEqual([]);
  });
  test("Returns an array of a single formatted array given a single shop object", () => {
    const topicData = [
      { description: "Code is love, code is life", slug: "coding" },
    ];
    expect(util.formatTopicsData(topicData)).toEqual([
      ["Code is love, code is life", "coding"],
    ]);
  });
  test("Returns a fully formatted array for multiple shop objects", () => {
    const topicData = [
      {
        description: "The man, the Mitch, the legend",
        slug: "mitch",
      },
      {
        description: "Not dogs",
        slug: "cats",
      },
      {
        description: "what books are made of",
        slug: "paper",
      },
    ];
    const result = [
      ["The man, the Mitch, the legend", "mitch"],
      ["Not dogs", "cats"],
      ["what books are made of", "paper"],
    ];
    expect(util.formatTopicsData(topicData)).toEqual(result);
  });
});

describe("UTIL: formatUsersData", () => {
  test("original data is not mutated", () => {
    const userData = [
      {
        username: "butter_bridge",
        name: "jonny",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      },
      {
        username: "icellusedkars",
        name: "sam",
        avatar_url:
          "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
      },
    ];

    util.formatUsersData(userData);
    expect(userData).toEqual([
      {
        username: "butter_bridge",
        name: "jonny",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      },
      {
        username: "icellusedkars",
        name: "sam",
        avatar_url:
          "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
      },
    ]);
  });
  test("Returns an empty array given an empty array", () => {
    expect(util.formatUsersData([])).toEqual([]);
  });
  test("Returns an array of a single formatted array given a single shop object", () => {
    const userData = [
      {
        username: "butter_bridge",
        name: "jonny",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      },
    ];
    expect(util.formatUsersData(userData)).toEqual([
      [
        "butter_bridge",
        "jonny",
        "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      ],
    ]);
  });

  test("Returns a fully formatted array for multiple shop objects", () => {
    const userData = [
      {
        username: "butter_bridge",
        name: "jonny",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      },
      {
        username: "icellusedkars",
        name: "sam",
        avatar_url:
          "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
      },
      {
        username: "rogersop",
        name: "paul",
        avatar_url:
          "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
      },
    ];
    const result = [
      [
        "butter_bridge",
        "jonny",
        "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      ],
      [
        "icellusedkars",
        "sam",
        "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
      ],
      [
        "rogersop",
        "paul",
        "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
      ],
    ];
    expect(util.formatUsersData(userData)).toEqual(result);
  });
});

describe("UTIL: formatArticlesData", () => {
  test("original data is not mutated", () => {
    const articleData = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1594329060000),
        votes: 100,
      },
      {
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        created_at: new Date(1602828180000),
        votes: 0,
      },
    ];

    util.formatArticlesData(articleData);
    expect(articleData).toEqual([
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1594329060000),
        votes: 100,
      },
      {
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        created_at: new Date(1602828180000),
        votes: 0,
      },
    ]);
  });
  test("Returns an empty array given an empty array", () => {
    expect(util.formatArticlesData([])).toEqual([]);
  });
  test("Returns an array of a single formatted array given a single shop object", () => {
    const articleData = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1594329060000),
        votes: 100,
      },
    ];

    expect(util.formatArticlesData(articleData)).toEqual([
      [
        "Living in the shadow of a great man",
        "mitch",
        "butter_bridge",
        "I find this existence challenging",
        new Date(1594329060000),
        100,
      ],
    ]);
  });

  test("Returns a fully formatted array for multiple shop objects", () => {
    const articleData = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1594329060000),
        votes: 100,
      },
      {
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        created_at: new Date(1602828180000),
        votes: 0,
      },
    ];

    const result = [
      [
        "Living in the shadow of a great man",
        "mitch",
        "butter_bridge",
        "I find this existence challenging",
        new Date(1594329060000),
        100,
      ],
      [
        "Sony Vaio; or, The Laptop",
        "mitch",
        "icellusedkars",
        "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        new Date(1602828180000),
        0,
      ],
    ];
    expect(util.formatArticlesData(articleData)).toEqual(result);
  });
});

describe("UTIL: formatCommentsData", () => {
  test("original data is not mutated", () => {
    const commentData = [
      {
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        article_id: 9,
        created_at: new Date(1586179020000),
      },
      {
        body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        votes: 14,
        author: "butter_bridge",
        article_id: 1,
        created_at: new Date(1604113380000),
      },
    ];

    util.formatCommentsData(commentData);
    expect(commentData).toEqual([
      {
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        article_id: 9,
        created_at: new Date(1586179020000),
      },
      {
        body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        votes: 14,
        author: "butter_bridge",
        article_id: 1,
        created_at: new Date(1604113380000),
      },
    ]);
  });
  test("Returns an empty array given an empty array", () => {
    expect(util.formatCommentsData([])).toEqual([]);
  });
  test("Returns an array of a single formatted array given a single shop object", () => {
    const commentData = [
      {
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        article_id: 9,
        created_at: new Date(1586179020000),
      },
    ];

    expect(util.formatCommentsData(commentData)).toEqual([
      [
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        16,
        "butter_bridge",
        9,
        new Date(1586179020000),
      ],
    ]);
  });

  test("Returns a fully formatted array for multiple shop objects", () => {
    const commentData = [
      {
        body: "I hate streaming noses",
        votes: 0,
        author: "icellusedkars",
        article_id: 1,
        created_at: new Date(1604437200000),
      },
      {
        body: "Lobster pot",
        votes: 0,
        author: "icellusedkars",
        article_id: 1,
        created_at: new Date(1589577540000),
      },
    ];

    const result = [
      [
        "I hate streaming noses",
        0,
        "icellusedkars",
        1,
        new Date(1604437200000),
      ],
      ["Lobster pot", 0, "icellusedkars", 1, new Date(1589577540000)],
    ];
    expect(util.formatCommentsData(commentData)).toEqual(result);
  });
});
