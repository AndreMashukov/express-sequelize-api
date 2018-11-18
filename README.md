# Rest Api

## Description
This is an Restful API which uses Node.js and Mysql. 

##### Routing         : Express
##### ORM Database    : Sequelize
##### Authentication  : Passport, JWT

## Installation

#### Download Code | Clone the Repo

```
git clone {repo_name}
```

#### Install Node Modules
```
npm install
```

#### Create .env File
You will find a example.env file in the home directory. Paste the contents of that into a file named .env in the same directory. 
Fill in the variables to fit your application

## Creating user record and genetic result record
In order to create records in tables Users and Results please run following commands:
```
mocha test/createUser
```
To create a user in the database.
```
mocha test/createResult
```
To create a record of genetic results in the database.

##  Running the application

Run from the command line.
```
npm start
```