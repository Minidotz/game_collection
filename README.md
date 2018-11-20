# Game Collection
Game Collection is a responsive web app designed for tracking games you own. It's a [React](https://reactjs.org/) app (created using [create-react-app](https://github.com/facebook/create-react-app)) with [Node.js](https://nodejs.org/en/) handling the back end. A [MongoDB](https://www.mongodb.com/) database is also required.

## Getting Started
Requirements:
* [Node.js](https://nodejs.org/en/) installed.
* A [MongoDB](https://www.mongodb.com/) database.
* A [GiantBomb](https://www.giantbomb.com/) API key - If you have an existing account, you can find your personal key [here](https://www.giantbomb.com/api/). Otherwise, you need to create a new account at GiantBomb.

Once you have the above, the next step is to rename the `.env.example` file to `.env` and configure the environment variables listed.
* API_KEY - This is your personal GiantBomb API key.
* DB_NAME - The name of the database in MongoDB.

You can also set the optional `PORT` variable if you need to change the port Node.js will be running. The default value is `5000`.

The app is using the [dotenv](https://github.com/motdotla/dotenv) module to read environment variables.

## Run the app
To run the app locally:
```bash
git clone https://github.com/Minidotz/game_collection.git
cd game_collection
npm run install-deps
npm run dev
```

Open `http://localhost:3000`. You should now see the app running!
