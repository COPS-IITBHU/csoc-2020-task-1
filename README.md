# Todo Application - CSoC Dev Task 1
In this task you will be working on a todo application made using basic html, css, js. The main motive of this task is to make you familiar with
- Rest APIs
-  AJAX
- Manipulating DOM using JavaScript

## Setting up the project

Follow the following steps to setup this project.

*Note* - Make sure you have node installed in your system. If not, follow the steps given [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to install it.

### Clone this repository
First of all clone this repository using this command
```
git clone https://github.com/COPS-IITBHU/csoc-2020-task-1.git
```

Then change your current directory to the repo's root.
```
cd csoc-2020-task-1
```

### Run the server
For this you need `http-server` installed. You can do it by running this command
```
npm install http-server -g
```

Then you can finally run the server using this command.
```
http-server
```

Then you can go to `localhost:8080` in your browser.

## Todo Application

There are three pages in this site.

- `/` - This is the main page where the user can create, edit or delete the tasks.
- `/login` - This is the login page.
- `/register` - This is the register page.

We have also created a backend server containing the API endpoints required for this application to function completely  - [https://todo-app-csoc.herokuapp.com/](https://todo-app-csoc.herokuapp.com/)

## Tasks
You would notice that the application is not functional completely. So, your task is to make it completely functional. You would be working in `main.js`, `init.js`, `auth_required.js` and `no_auth_required.js` mainly. There are several todos mentioned in these files. You have to complete those.

In particular you have to

- **Complete the auth_required.js and no_auth_required.js** - You may notice that initially you are landed on the main page even when you are logged in. That is wrong. In this files you have to write code to redirect user to pages based on wheather he/she is authenticated or not.

- **Login Function** - Currently only register function works. You have to complete the login function too.

- **Get Tasks function** - There is a function `getTasks` in `init.js`. You would notice that even after logging in, you see two tasks *Sample Task 1* and *Sample Task 2*. These tasks were not created by you. These are dummy tasks. You have complete the `getTasks` function such that the tasks listed are the ones created by the user. (You might have to complete the `addTask` function first)

- **Add, Update, Delete Task function** - These functions are present in the `main.js` file. You have to complete them.

## Points
Here is the breakdown of the points related to each task.

|**Task**|**Points**  |
|--|--|
| Login Function | 15 |
|`auth_required.js` and `no_auth_required.js`|15|
|Add task|25|
|Get tasks|25|
|Edit Task|35|
|Delete Task|35|
|**Total**|150|

## Judging
Judging would be done on the basis of your implementation, authenticity.
