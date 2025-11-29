Server setup

1. Install dependencies:

```powershell
cd server; npm install
```

2. Create an environment file:

- Copy `server/.env.sample` to `server/.env` and fill in `MONGO_URI` and `JWT_SECRET`.

3. Run the server:

- Development (requires `nodemon`):

```powershell
cd server; npx nodemon server.js
```

- Production / simple run:

```powershell
cd server; npm start
```

Notes

- If `npx nodemon server.js` reports that `nodemon` is not recognized, ensure you have run `npm install` in the `server` folder. `nodemon` is listed as a devDependency and should be available under `node_modules/.bin`.
- The server will exit with an error if required environment variables are missing. See `.env.sample` for required keys.
