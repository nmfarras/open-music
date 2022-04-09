# Getting Started with Open Music API

This project is part of Dicoding assignment, create using ExpressJS.

## Available Scripts

In the project directory, you can run:

### `npm run start-dev`

Runs the app in the development mode.\
Open [http://localhost:5000](http://localhost:5000) to access.
Postman will be used for testing.

### `npm install`

Install all module listed on 'package.json'.

## Setting up database

In the project directory, create file:

### `.env`

On the file, filled the postgres and server information:

```shell
# server configuration
HOST=localhost
PORT=5000
 
# node-postgres configuration
PGUSER=user
PGHOST=localhost
PGPASSWORD=password
PGDATABASE=db
PGPORT=5432
```

The user, password, and db can be create and set on psql. Make sure to grant all privileges to the user for the database. And add file:

### `.prod.env`

which contain postgres port and host as followed:

```shell
# server configuration
HOST=0.0.0.0
PORT=5000
```

Make sure the postgres service run, or you can run:

```zsh
sudo service postgresql start
```

If the user, pass, and database already set, and all module already installed, run following script on terminal:

```zsh
npm run migrate up
```

this command will create table on the database based on the setting available on migrations folder.
