# Documentation for User Management Service

This service is developed using **express-babel** template which facilates using latest cutting edge features of _JavaScript_
You need to build this code which generates **ES5** compatible code which can be excuted on any version of **Node.js** (Even though it has been made sure that the Node.js version is above 8.9 in `package.json`).

## Directory Structure

The application code starts inside **/src**. The code organization s fairly simple. It consists of Routes, Controllers and Services.

- **/src**: Entry point of the application code
  - **/routes**: The defination of end points
  - **/controllers**: The core logic of API, the body, headers and manipulations are done here. They are used by Routes
  - **/services**: All the Database interactions are done inside services. They are used by the controllers.
  - **/db**: Contains the DB connection code
  - **/models**: All the `mongoose` models are defined here
  - **/middlewares**: Self explanatory
  - **/utils**: The helper functions are stored here that are used globally across the code

## Understanding of code

- Just look for the imports inside the file to navigate to the desired code block. Functions defined are small chunks of code which was kept as much readable as possible.

- For JWT and DB options are set by user in `src/config/index.js` whose keys are self exlanatory.

- `express-validator` has been used to validate API body, params and queries. (Google for documentation of the library). Validator functions for `users` APIs are defined inside `/src/controllers/users/_requestValidators.js`
