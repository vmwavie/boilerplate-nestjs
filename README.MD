# Yokohama Payment Api

This is a Payment-Api focused on card-machine systems.

## Running

First define a `.env` file with two variables, like below:

```ini
CRYPT_HASH=e8d95a51f3af4a3b134bf6bb680a213a  // Generate token in https://www.md5hashgenerator.com/
TOKEN_HASH="732c87bf50e1078020c1d75b0d8644ce"  // Generate token in https://www.md5hashgenerator.com/
PORT=3333 // Internet port number
MAILTRAP_USER="9afc4257471d8d" // Generate in mailtrap.io
MAILTRAP_PASS="ea490ea6bf78da" // Generate in mailtrap.io
MAIL_PROVIDER="yokohamapay@outlook.com" // Generate in mailtrap.io
CAPTCHA="6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe" // Generate v2 google.com/recaptcha 
PASSWORD_LINK="localhost:3000/url" // Link from frontend to register password

BaseUrl="http://localhost:3333" // Url from backend
```

Make sure you configured `/src/config/data-source.ts`, like below :

```ts
type: 'postgres',
host: 'db-1',
port: 5432,
username: 'postgres',
password: '123123',
database: 'payment-api',
synchronize: true,
logging: false,
entities: [User],
migrations: [CreateUserTable1682197861733],
subscribers: [],
```

Install all dependencies

```sh
yarn install
```

Make sure you have a database created and initialized with data:

```sh
yarn typeorm -- -d ./src/config/data-source.ts migration:run
```

Then run it:

```sh
yarn run dev
```

## Running with Docker

First install PG in docker :

```sh
docker pull postgres
```

Up docker container :

```sh
docker-compose up
```

This will run the app at follow link.

## Documentation

There are two documentation systems enabled:

- http://localhost:PORT/doc/v1
- http://localhost:PORT/doc/v1