## Production

This project can be accessed in production clicking [`right here`](https://working-hours.adrielgarcia.dev/).

## Development Environment:

First: install dependencies:

Project's root dir:
```bash
yarn
```

Second: if you want to change the mongoDB address, it can be done in
.env.development:

```
MONGODB_URI
```

Run the development server:

Project's root dir:
```bash
yarn dev
```

And finally you can open [`http://localhost:3000`](http://localhost:3000) with your browser

## Project structure

### Client
```
src/
  - __tests__/
  - pages/
    - index.tsx
    - history.tsx
  - components/
  - hooks/
  - styles/
  - services/
  - repositories/
```

### Server
```
src/
  - pages/
    - api/
      - date (GET) -> Return current date
      - user (GET) -> Return user data
      - register/:userId (POST) -> Create a new register
      - history/:userId (GET) -> List user's registers history
  - models/
    - Register.ts
    - User.ts
  - utils/
```

### @types
Types are shared between client and server once they run in same server graceful to Next.js :heart_eyes:


Features:

  - [ x ] Register time by user
  - [ x ] Show user data: <b>name, position and last register</b>
  - [ x ] Show current date/time from server
  - [ x ] List register's history: <b>date, arriving and exiting, break times and worked hours</b>
  - [  ] Authentication email/password
  - [  ] Authentication Google (Auth0)

Created by [`@AdrielGarciaS`](https://github.com/AdrielGarciaS).
