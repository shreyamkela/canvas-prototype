# Learning Management Platform (Prototype of Canvas by Instructure)
Individual project for CmpE 273 Course Lab in the Spring 19 semester at San Jose State University

## Project Description
The application is an end-to-end prototype of the Canvas platform, a Learning Management System created by Instructure (https://www.instructure.com/canvas). It supports majority of functionalities presented by the actual website such as registration by a student or a faculty, addion/creation of courses by a faculty, enrolling into courses by a student, adding assignments/quizzes, taking quizzes, grading, P2P messaging, pdf document view, real-time notifications, and so on. The application is developed majorly using the MERN stack technologies (MongoDB, ExpressJS, ReactJS and NodeJS) and is made highly scalable and available using the 3-tier distributed system paradigm with fault tolerance and load balancing using the AWS EC2 and ELB, with real-time data pipelining and streaming on Kafka middleware. The Backend is a RESTful service that handles all the requests from the client.

The project was developed in 3 incremental iterations, having increased functionality, complexity, and technology utilization with each iteration:
 - Lab 1 - Majority functionalities such as registration, course creation, enrollment, addition of assignments and quizzes, grading, and so on implemented end-to-end using React, Express.js, Node.js, HTML5, CSS3, and MySQL.
 - Lab 2 - Added P2P messaging feature, Pagination, Kafka for data pipelining, Redux for state management, Passport.js/JWT for authentication, DBMS with MongoDB Mongoose and MySQL, Redis for SQL caching, and deployed the distributed application on Heroku.
 - Lab 3 - Migrated all the various RESTful backend services to a single GraphQL endpoint.
 
<p align="middle">
  <img src="/app-images/app-thumbnail-1.PNG" width="400" />
  <img src="/app-images/app-thumbnail-2.PNG" width="400" />
  <img src="/app-images/app-thumbnail-3.PNG" width="400" />
  <img src="/app-images/app-thumbnail-4.PNG" width="400" />
  <img src="/app-images/app-thumbnail-5.PNG" width="400" />
  <img src="/app-images/app-thumbnail-6.PNG" width="400" />
</p>
 
 
### System Architechture
- Lab 1

<p align="middle">
  <img src="/app-images/system_design_1-thumbnail.PNG" />
</p>

- Lab 2

<p align="middle">
  <img src="/app-images/system_design_3-thumbnail.PNG" />
</p>

- Lab 3

<p align="middle">
  <img src="/app-images/system_design_2-thumbnail.PNG" />
</p>


### Technologies utilized
- Lab 1 - React, Node.js, Express.js, JavaScript, HTML5, CSS3, Bootstrap, Ant Design, MySQL, Bcrypt, REST

- Lab 2 - Redux, Kafka, Zookeeper, Passport.js, JWT, Redis, MongoDB, Mongoose, React, Node.js, Express.js, JavaScript, HTML5, CSS3, Bootstrap, Ant Design, AWS EC2 S3 RDS, Mongo Atlas, Mlab, MySQL, REST

- Lab 3 - GraphQL, Passport.js, JWT, MongoDB, Mongoose, React, Node.js, JavaScript, HTML5, CSS3, Bootstrap, Ant Design, AWS S3, Mongo Atlas, Mlab, MySQL

### Build instructions to run the project on localhost:  
1) Go to the individual Lab folder, for example Lab31, Lab2, or Lab3.
2) Install Backend and Frontend dependencies.
3) Start the backend server with node index.js in the backend folder - ```node index.js```
4) Start the frontend server in the frontend folder - ```npm start```
