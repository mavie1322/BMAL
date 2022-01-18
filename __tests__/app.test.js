const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const { seed } = require("../db/seeds/seed.js");
const util = require("../db/utils/index");

beforeEach(() => seed(testData));
afterAll(() => db.end());
