# BMAL                                                

We built an application such as reddit or quora where users can publish, comment or like any articles or journal published on the website.

https://bmal237.herokuapp.com/api 
 
 ## Back End Functionalities
 
 The application is hoisted in Heroku. It provide deployment service that allows to push code and it build, run and hoist Node.js application. Heroku allows easy database integration which is great.
 
 ### Build with: 
 * Node.js v17.0.1
 * PostgreSQL 12.9 

### Set Up
To run this projet, you need to install globally Node JS, PostgreSQL and Git.

Then you need to follow these differents steps:

#### Fork this repository

 #### Clone the forked repository 
 On the command line, navigate to the folder you want this repository to be store and enter the code below:
 
 ```
 $ git clone https_url
 ```
#### Install dependencies

You need to enter the following code on your terminal:

* Express: a Node.js web application framework that provides a robust set of features for web and mobile applications.

 ```
 $ npm install express
 ```
* Dotenv: allows us to load environment variables from a .env file into process.env.
 ```
 $ npm install dotenv
 ```
* Pg: a collection of node.js modules for interfacing with your PostgreSQL database.
 ```
 $ npm install pg
 ```
* Pg-format: enables us to safely create dynamic SQL queries and prevent SQL injections.
 ```
 $ npm install pg-format
 ```
 * Jest: a delightful JavaScript Testing Framework with a focus on simplicity.
 ```
 $ npm install -D jest
 ```
* Jest-sorted: extends Jest.expect to allow us to specify the order we expect our responses to return in our tests.
 ```
 $ npm install --save-dev jest-sorted
 ```
* Supertest: allows us to run tests against our server endpoints 
 ```
 $ npm install -D supertest
 ```

#### Create .env files
  In order to connect to different PostgreSQL databases, we need multiples .env files:
  
  In `.env.test`
​
```
PGDATABASE=test_database_name
```
​
In `.env.development`
​
```
PGDATABASE=development_database_name
```
The test_database_name and development_database_name can be found in setup.sql file

#### Seed database
  Database seeding is the initial process of populating a database with data. This data can be dummy data for testing or real one. 
  Before all that, we need to set up the database first.
  ```
  $ npm run setup-dbs
  ```
  Then, we insert data in the database
  ```
  $ npm run seed
  ```
#### Run Test
  The test files are already set in the test environment so you can run your test from the __test__ folder.
  ```
  $ npm test file_name
  ```
 ### Improvements:
 * Replace Promise by async functions
 * SQL injection vulnerabilities on the models files
 * Use `.route` for endpoints that share the same path
