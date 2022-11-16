# Coding Challenge for Full Stack Engineers

## Getting Started 
This project is running on Vercel. Endpoint is https://mighty-jaxx-nodejs.vercel.app.

## Local Environment
Clone this repo to your local machine and run the following commands to start the application

Installation
```sh
$ yarn install
# or
$ npm install
```


Prepare environment file at root folder
```sh
DB_URI={{your_mongo_db_uri}

JWT_SECRET={{random_string}}
JWT_REFRESH_SECRET={{random_string}}

JWT_EXPIRATION={{expiry_in_number_seconds}}
JWT_REFRESH_EXPIRATION=604800{{expiry_in_number_seconds}}
```


Or you can use the value below while running on your local machine
```sh
DB_URI=mongodb+srv://mighty_jaxx_tester:KELQyojBZ7OKPVtu@mightyjaxxtest.bnoubmu.mongodb.net/?retryWrites=true&w=majority

JWT_SECRET=jSs9zxgGpFYW8ykpboeY
JWT_REFRESH_SECRET=bIf8myE6HKpGYrNuhEWn

JWT_EXPIRATION=900
JWT_REFRESH_EXPIRATION=604800
```


Start the project
```sh
$ nodemon
# or 
$ yarn start 
# or
$ npm run start 
```

## Requirements
- React 
- Any state management library. Redux is preferred, but no penalty for using other state management libraries. No props drilling
- MongoDB or Firestore database
- Node.JS
- Express.JS

You have 14 days upon receiving this test to complete and submit it back to us

## Instructions
The purpose of this code challenge is to build an admin dashboard with authentication protection and the ability to add new products.

1. Clone this repository and create your own GitHub repository.
2. Push your git repository to GitHub.
3. Initialize a new React project and Node.JS project. 
4. The website should make API calls to the Node.JS app and not interact with the database directly.
5. Create the login page with the following features: 
   - Text inputs for email and password.
   - Submit button.
   - Show an error message for incorrect credentials.
   - Make the page responsive for mobile and desktop devices.
   - Redirect to the admin dashboard page (to be built in the next step) for correct credentials.
6. Build the admin dashboard page:
   - Show a list of products (the products should be fetched from a database). Each product has the following data: SKU, title and image.
   - Add the option to add a new product (should be added to the database as well).
   - Add the option to edit an existing product (should be edited in the database as well).
   - Add the option to remove an existing product (should be removed from the database as well).
   - Add a logout button that redirects to the login page. 
   - Make the page responsive for mobile and desktop devices.
7. When you are done, send us the link to your GitHub repository with a clear readme file and also deploy it on a small server such as Heroku/Vercel and send us the link to test

## Bonus
Bonus points for adding a search bar in the admin dashboard to search for products. 
