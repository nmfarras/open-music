# Getting Started with Open Music App

This project is part of Dicoding assignment, create using ExpressJS.

## Available Scripts

In the project directory, you can run:

### `npm run start-dev`

Runs the app in the development mode.\
Open [http://localhost:5000](http://localhost:5000) to access.
Postman will be used for testing.

## Setting up database

In the project directory, create file:

### `.env`

On the file, filled the postgres and server information:

```shell
# server configuration
HOST=localhost
PORT=5000
 
# node-postgres configuration
PGUSER=developer
PGHOST=localhost
PGPASSWORD=supersecretpassword
PGDATABASE=openmusicapp
PGPORT=5432
```

and add file:

### `.env`

which contain postgres port and host

```shell
# server configuration
HOST=0.0.0.0
PORT=5000
```
