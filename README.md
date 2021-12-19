<div align="center">
<h1>Auction Site (server side)</h1>

This is a backend for an Auction site built in Express.js, where people can create an auction for their items, and also they can bid on items they like, and the highest bidder wins the auction.

![MONGODB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

</div>

Trello: https://trello.com/b/GMe6Tyz1/mp-project-ibrahimalsaif

Deployment: https://Deployment

Slides: https://Slides

## ⚪ User Stories

- A guest can browse the site a see all the available auctions without the need for sign-in.
- A guest must have an account and log-in if they want to use the site features.
- A user can bid on an auction.
- A user can add auctions in his own watch list.
- A user can create auctions for people to start bidding on.
- A user has his own dashboard with all of his information and statistics.
- A user can edit his information from name, avatar, ... etc.
- A user can edit his auction information.
- A user with role `admin` has all the features of a regular user.
- A user with role `admin` can change any auction status.
- A user with role `admin` has a dashboard with all of the site information and statistics.
- A user can report a scammer to the admin so he can't bid or create an auction again.

## ⚪ Entity Relationship Diagram

![masterpice backend ERD](https://user-images.githubusercontent.com/92247874/146672131-272a861a-9b26-4792-ae22-74334568d8f5.jpg)

## ⚪UML Diagram

![masterpice backend UML](https://user-images.githubusercontent.com/92247874/146673943-370964f2-14fc-4004-9d87-0fc0a438c8d6.jpg)

### ■ Installing Dependencies

#### ▸ Node js

Follow instructions to install the latest version of Node js for your platform in the [Node js docs](https://nodejs.org/en/).

#### ▸ NPM Dependencies

Once you have the project in your local machine, install dependencies by running:

```bash
npm install
```

This will install all of the required packages.

#### ▸ Key Dependencies

- [Express](https://expressjs.com/) is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

- [mongoose](https://mongoosejs.com/) is an elegant mongodb object modeling for node.js.

- [morgan](https://www.npmjs.com/package/morgan) is a HTTP request logger middleware for node.js.

- [bcrypt](https://www.npmjs.com/package/bcrypt) is a A library to help you hash passwords.

- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) is a JSON Web Token implementation (symmetric and asymmetric).

#### ▸ Setting up the variables

You have to set up some variables in the `.env` file, for the app to run properly.

```
PORT=5000
DB_URL=`Your MongoDB DB URL`
SALT=`Your SALT here`
SECRET_KEY=`Your SECRET KEY here`
```

## ⚪ Running the server

To run the server, execute:

```bash
npm run dev
```

For running the server in development mode, and execute:

```bash
npm run start
```

To run the server on production mode.

## ⚪ Models

### ▼ Users

| key          | type                | options          | default value    |
| ------------ | ------------------- | ---------------- | ---------------- |
| email        | String              | required, unique | N/A              |
| name         | String              | required         | N/A              |
| password     | String              | N/A              | N/A              |
| avatar       | String              | N/A              | avatar_image_url |
| activeCode   | String              | N/A              | N/A              |
| passwordCode | String              | N/A              | ''               |
| watchlist    | [Schema <Auctions>] | N/A              | N/A              |
| role         | Schema <Roles>      | N/A              | N/A              |
| active       | Boolean             | N/A              | false            |
| blocked      | Boolean             | N/A              | false            |
| timestamp    | Date                | N/A              | Date now         |

### ▼ Auctions

| key          | type            | options  | default value |
| ------------ | --------------- | -------- | ------------- |
| title        | String          | required | N/A           |
| description  | String          | required | N/A           |
| images       | [String]        | required | N/A           |
| initialPrice | Number          | required | 0             |
| currentPrice | Number          | N/A      | 0             |
| minIncrement | Number          | required | 1             |
| categories   | [String]        | N/A      | N/A           |
| endDateTime  | Date            | N/A      | N/A           |
| condition    | String          | required | N/A           |
| buyer        | Schema <Users>  | N/A      | N/A           |
| createdBy    | Schema <Users>  | required | N/A           |
| sold         | Boolean         | N/A      | N/A           |
| status       | Schema <Status> | required | approved      |
| timestamp    | Date            | N/A      | Date now      |

### ▼ Bids

| key       | type              | options  | default value |
| --------- | ----------------- | -------- | ------------- |
| bid       | Number            | required | 1             |
| auction   | Schema <Auctions> | required | N/A           |
| createdBy | Schema <Users>    | required | N/A           |
| timestamp | Date              | N/A      | Date now      |

### ▼ Roles

| key         | type   | options  | default value |
| ----------- | ------ | -------- | ------------- |
| role        | String | required | N/A           |
| permissions | Array  | required | N/A           |
| timestamp   | Date   | N/A      | Date now      |

### ▼ Status

| key       | type   | options          | default value |
| --------- | ------ | ---------------- | ------------- |
| status    | String | required, unique | N/A           |
| timestamp | Date   | N/A              | Date now      |

### ▼ Reports

| key        | type            | options  | default value |
| ---------- | --------------- | -------- | ------------- |
| reason     | String          | required | N/A           |
| reported   | Schema <Users>  | required | N/A           |
| reportedBy | Schema <Users>  | required | N/A           |
| status     | Schema <Status> | required | pending       |
| timestamp  | Date            | N/A      | Date now      |

## ⚪ API Reference

## ■ Getting Started

Base URL: This application can be run locally on the http:/localhost:5000.

## ■ Error Handling

Errors are returned as JSON objects depend on the error.

The API will return two error types when requests fail:

- 400: Bad Request
- 403: Forbidden
- 404: Not Found

## ■ Endpoints

### ▼ GET

#### ● GET /homeAuctions

- General

  - It provides the home page with the required data

- Sample Request
  - `http://localhost:5000/homeAuctions`

<details>
<summary>Response</summary>

```
nothing yet!!
```

</details>

#### ● GET /auctions

- General

  - gets the list of all the auctions

- Sample Request
  - `http://localhost:5000/auctions`

<details>
<summary>Response</summary>

```
nothing yet!!
```

</details>

#### ● GET /auctions/{auction_ID}

- General

  - gets all the data for an auction

- Sample Request
  - `http://localhost:5000/auctions/:id`

<details>
<summary>Response</summary>

```
nothing yet!!
```

</details>

#### ● GET /users/{user_ID}

- General

  - gets all the data for a user

- Sample Request
  - `http://localhost:5000/users/61a771ebb3f5b509471859a5`

<details>
<summary>Response</summary>

```
nothing yet!!
```

</details>

#### ● GET /userAuctions/{user_ID}

- General

  - gets the list of all the user auctions
  - requires `user` role

- Sample Request
  - `http://localhost:5000/userAuctions/61a771ebb3f5b509471859a5`
  - Token

<details>
<summary>Response</summary>

```
nothing yet!!
```

</details>

#### ● GET /userBids/{user_ID}

- General

  - gets the list of all the user bids
  - requires `user` role

- Sample Request
  - `http://localhost:5000/userBids/61a771ebb3f5b509471859a5`
  - Token

<details>
<summary>Response</summary>

```
nothing yet!!
```

</details>

#### ● GET /roles

- General

  - gets the list of all the roles
  - requires `admin` role

- Sample Request
  - `http://localhost:5000/roles`
  - Token

<details>
<summary>Response</summary>

```
nothing yet!!
```

</details>

### ▼ POST

#### ● POST /signup

- General

  - creates a new user

- Request Body

  - email
  - name
  - password
  - role

- Sample Request
  - `http://localhost:5000/signup`
  - Request Body

```
{
	"email": "user@gmail.com",
	"name": "user",
	"password": "12345",
	"role": "61a7389f2c88f46ca3ec0987"
}
```

<details>
<summary>Response</summary>

```
nothing yet!!
```

</details>

#### ● POST /login

- General

  - login a user

- Request Body

  - email
  - password

- Sample Request
  - `http://localhost:5000/login`
  - Request Body

```
{
	"email": "user",
	"password": "12345"
}
```

<details>
<summary>Response</summary>

```
nothing yet!!
```

</details>

#### ● POST /auctions

- General

  - create a new auction
  - requires `user` role

- Request Body

  - title
  - description
  - images
  - initial price
  - min increment
  - categories
  - end dateTime
  - condition

- Sample Request
  - `http://localhost:5000/auctions`
  - Request Body
  - Token

```
{
	"title": "playstation",
	"description": "a playstation 5 in good condition",
  "images": "image url",
  "initial_price": "500",
  "min_increment": "50",
  "categories": "50",
  "end_dateTime": "30-12-2021 12:30:30",
  "condition": "used",
}
```

<details>
<summary>Response</summary>

```
nothing yet!!
```

</details>

#### ● POST /auctionsWatchlist/{auction_id}

- General

  - add auction to the user watch list
  - requires `user` role

- Sample Request
  - `http://localhost:5000/auctionsWatchlist/61a771ebb3f5b509471859a5`
  - Token

<details>
<summary>Response</summary>

```
nothing yet!!
```

</details>

#### ● POST /bids/{auction_id}

- General

  - add bid to an auction
  - requires `user` role

- Sample Request
  - `http://localhost:5000/bids/61a771ebb3f5b509471859a5`
  - Token

<details>
<summary>Response</summary>

```
nothing yet!!
```

</details>

#### ● POST /report/{auction_id}

- General

  - report a user or an auction
  - requires `user` role

- Request Body

  - reason

- Sample Request
  - `http://localhost:5000/report/61a771ebb3f5b509471859a5`
  - Request Body
  - Token

```
{
    "reason":"user didn't ship the product"
}
```

<details>
<summary>Response</summary>

```
nothing yet!!
```

</details>

#### ● POST /createRole

- General

  - creates a new role
  - requires `admin` role

- Request Body

  - role
  - permissions

- Sample Request
  - `http://localhost:5000/createRole`
  - Request Body
  - Token

```
{
    "role":"user",
    "permissions": ["read"]
}
```

<details>
<summary>Response</summary>

```
nothing yet!!
```

</details>

### ▼ PUT

#### ● PUT /auctions/{auction_ID}

- General

  - edit an auction
  - requires `user` role

- Request Body
- title
- description
- images
- categories
- condition

- Sample Request
  - `http://localhost:5000/auctions/61a75cff9d12af263e2e1787`
  - Request Body
  - Token

```
{
	"title": "playstation",
	"description": "a playstation 5 in good condition",
  "images": "image url",
  "categories": "50",
  "condition": "used",
}
```

<details>
<summary>Response</summary>

```
nothing yet!!
```

</details>

#### ● PUT /editAccount

- General

  - edit a user info
  - requires `user` role

- Request Body

  - name
  - avatar

- Sample Request
  - `http://localhost:5000/editAccount`
  - Request Body
  - Token

```
{
	"name": "ibrahim",
	"creatorID": "image url"
}
```

<details>
<summary>Response</summary>

```
nothing yet!!
```

</details>

#### ● PUT /deleteAccount

- General

  - delete a user account
  - requires `user` role

- Sample Request
  - `http://localhost:5000/deleteAccount`
  - Token

<details>
<summary>Response</summary>

```
nothing yet!!
```

</details>

#### ● PUT /changeAuctionStatus/{auction_id}

- General

  - change the auction status
  - requires `admin` role

- Request Body

  - status_id

- Sample Request
  - `http://localhost:5000/changeAuctionStatus/61a75cff9d12af263e2e1787`
  - Token

```
{
	"status_id": "61a75cff9d12af263e2e1787",
}
```

<details>
<summary>Response</summary>

```
nothing yet!!
```

</details>

#### ● PUT /blockUser/{user_id}

- General

  - block any user
  - requires `admin` role

- Sample Request
  - `http://localhost:5000/blockUser/61a75cff9d12af263e2e1787`
  - Token

<details>
<summary>Response</summary>

```
nothing yet!!
```

</details>

#### ● PUT /changeRole/{user_id}

- change a user role
- requires `admin` role

- Request Body

  - role_id

- Sample Request
  - `http://localhost:5000/changeRole/61a75cff9d12af263e2e1787`
  - Token

```
{
	"role_id": "61a75cff9d12af263e2e1787",
}
```

<details>
<summary>Response</summary>

```
nothing yet!!
```

</details>

#### ● PUT /changeReportStatus/{report_id}

- change report status
- requires `admin` role

- Request Body

  - status_id

- Sample Request
  - `http://localhost:5000/changeReportStatus/61a75cff9d12af263e2e1787`
  - Token

```
{
	"status_id": "61a75cff9d12af263e2e1787",
}
```

<details>
<summary>Response</summary>

```
nothing yet!!
```

</details>
