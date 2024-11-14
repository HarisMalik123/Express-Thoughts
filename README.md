# Express Thoughts App

A simple Express application to create, edit, like, and manage posts. Users can register, log in, create posts, and view or edit their profiles and posts. The app also features user authentication with JSON Web Tokens (JWT) and cookie-based session management.

## Features

- **User Authentication**
  - Register a new account with username, email, password, and other details.
  - Log in to an existing account.
  - Log out and clear the session.

- **Post Management**
  - Create, edit, and view posts.
  - Like/unlike posts.
  - View posts sorted by date.
  - User profiles display the posts created by the user.

- **JWT Authentication**
  - Protect routes with JWT tokens.
  - Ensure only logged-in users can create, edit, and like posts.

## Prerequisites

Before running the app, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14.x or higher)
- [MongoDB](https://www.mongodb.com/) (running locally or through a cloud service like MongoDB Atlas)

## Installation

1. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/HarisMalik123/Express-Thoughts.git
    cd Express-Thoughts
    ```

2. Install the required dependencies:

    ```bash
    npm install
    ```

3. Set up a `.env` file (if required) for environment variables. You may need to define the `JWT_SECRET` and `MONGO_URI` for the app.

4. Start MongoDB if it's running locally, or configure it to connect to a cloud instance (e.g., MongoDB Atlas).

5. Run the app:

    ```bash
    npm start
    ```

   This will start the server on [http://localhost:3000](http://localhost:3000).

## Endpoints

- `GET /` - Landing page.
- `GET /login` - Login page.
- `POST /login` - Login a user.
- `GET /register` - Register page.
- `POST /register` - Register a new user.
- `GET /logout` - Logout a user.
- `GET /feed` - Show all posts (protected route, login required).
- `GET /postshow/:id` - Show a specific post by its ID.
- `GET /EditPost/:id` - Edit a specific post (protected route).
- `POST /editpost/:id` - Submit edited post (protected route).
- `GET /CreatePost` - Create a new post (protected route).
- `POST /submit-post` - Submit a new post (protected route).
- `GET /like/:id` - Like/unlike a post (protected route).
- `GET /profile` - User's profile showing their posts (protected route).

## Technologies Used

- **Node.js**: JavaScript runtime for building the backend.
- **Express.js**: Web framework for Node.js.
- **MongoDB**: NoSQL database to store user and post data.
- **Mongoose**: ODM (Object Data Modeling) library to interact with MongoDB.
- **JWT (JSON Web Token)**: For user authentication.
- **Bcrypt**: For hashing and comparing passwords securely.
- **EJS**: Templating engine for rendering HTML views.
- **Cookie-parser**: Middleware to handle cookies.

## Folder Structure

. ├── models/ │ ├── post.js │ └── user.js ├── public/ │ └── (static files like CSS, images, etc.) ├── views/ │ ├── index.ejs │ ├── login.ejs │ ├── profile.ejs │ ├── start.ejs │ └── (other EJS view templates) ├── app.js (main application file) └── package.json (dependencies and scripts)

## Contributing

Feel free to fork this repository, make changes, and create pull requests. If you find any bugs or issues, please report them through GitHub Issues.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
