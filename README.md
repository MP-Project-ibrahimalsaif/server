# Auction Site (server side)

This is a backend for an Auction site built in Express.js, where people can create an auction for their items, and also they can bid on items they like, and the highest bidder wins the auction.

Trello: https://trello.com/b/GMe6Tyz1/mp-project-ibrahimalsaif

##  Entity Relationship Diagram

![masterpice backend ERD](https://user-images.githubusercontent.com/92247874/146672131-272a861a-9b26-4792-ae22-74334568d8f5.jpg)


## UML Diagram

![masterpice backend UML](https://user-images.githubusercontent.com/92247874/146671663-662c7bba-32f8-4b23-a013-74810c9e291d.jpg)

## Getting Started

### Installing Dependencies

#### Node js

Follow instructions to install the latest version of Node js for your platform in the [Node js docs](https://nodejs.org/en/).

#### NPM Dependencies

Once you have the project in your local machine, install dependencies by running:

```bash
npm install
```

This will install all of the required packages.

##### Key Dependencies

- [Express](https://expressjs.com/) is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

- [mongoose](https://mongoosejs.com/) is an elegant mongodb object modeling for node.js.

- [morgan](https://www.npmjs.com/package/morgan) is a HTTP request logger middleware for node.js.

- [bcrypt](https://www.npmjs.com/package/bcrypt) is a A library to help you hash passwords.

- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) is a JSON Web Token implementation (symmetric and asymmetric).

#### Setting up the variables

You have to set up some variables in the `.env` file, for the app to run properly.

```
PORT=5000
DB_URL=`Your MongoDB DB URL`
SALT=`Your SALT here`
SECRET_KEY=`Your SECRET KEY here`
```

## Running the server

To run the server, execute:

```bash
npm run dev
```

For running the server in development mode, and execute:


```bash
npm run start
```

To run the server on production mode.
