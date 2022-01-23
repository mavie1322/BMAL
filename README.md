# BMAL

We built an application such as reddit or quora where users can publish, comment or like any articles or journal published on the website.
 
 ## Back End Functionalities
 
 The application is hoisted in Heroku. It provide deployment service that allows to push code and it build, run and hoist Node.js application. Heroku allows easy database integration which is great.
 
 ### Technologies
 The project is created with: 
 * Node.js v17.0.1
 * PostgreSQL 12.9 

### Set Up
To run this projet, you need to install locally ou globally npm, postgres and git.

Then you need to follow these differents steps:

#### Fork this repository

 #### Clone the forked repository 
 On the command line, navigate to the folder you want this repository to be in and enter the code below:
 
 ```
 $ git clone 
 ```
#### Install dependencies

You need to enter the following code on your terminal:

* Express

  It is a Node.js web application framework that provides a robust set of features for web and mobile applications.

 ```
 $ npm install express
 ```
* Dotenv

  It allows us to load environment variables from a .env file into process.env.
 ```
 $ npm install dotenv
 ```
* Pg

  It is a collection of node.js modules for interfacing with your PostgreSQL database.
 ```
 $ npm install pg
 ```
* Pg-format

  It enables us to safely create dynamic SQL queries and prevent SQL injections.
 ```
 $ npm install pg-format
 ```
 * Jest

  A delightful JavaScript Testing Framework with a focus on simplicity.
 ```
 $ npm install -D jest
 ```
* Jest-sorted

  It extends Jest.expect to allow us to specify the order we expect our responses to return in our tests.
 ```
 $ npm install --save-dev jest-sorted
 ```
* Supertest

  It allows us to run tests against our server endpoints 
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
  
