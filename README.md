# Rest-attend-api

Rest attend api is a simple api to manage attendances of students in a school.

## Installation

### Requirements

-   [Node.js](https://nodejs.org/en/)
-   [Postgresql](https://www.postgresql.org/)
-   [Postman](https://www.getpostman.com/)
-   [Git](https://git-scm.com/)
-   [Yarn](https://yarnpkg.com/)

### Clone the repository

```bash
git clone
```

### Install dependencies

```bash
yarn install
```

### Run migrations

```bash
yarn prisma migrate dev
```

### Update Server's database

```bash
yarn prisma db push
```

### Run the application on dev

```bash
yarn start:dev
```

### Run the tests

```bash
yarn test
```

## Usage

### Create a student

```bash
POST /users
```

```json
{
    "name": "John Doe",
    "email": "johndoe@gmail.com",
    "faceString": "-0.06428251,0.06386438,-0.05723983,0.07262037,0.0010176456,-0.114041604,0.012385694,0.04434888...",
}
```

### Create a attendances

```bash
POST /attendances
```

```json
{
    "status": "present",
    "userEmail": "johndoe@gmail.com",
    "date": "23-01-2023",
    "location": "São Paulo",
    "time": "08:00",
    "temperature": "36.5",
}
```

### List attendances

```bash
GET /attendances
```

```json
[
    {
        "id": 1,
        "status": "present",
        "userEmail": "johndoe@gmail.com",
        "date": "23-01-2023",
        "location": "São Paulo",
        "time": "08:00",
        "temperature": "36.5",
        "createdAt": "2023-01-23T8:00:00.000Z",
    },
    {
        "id": 2,
        "status": "present",
        "userEmail": "janedoe@gmail.com",
        "date": "23-01-2023",
        "location": "São Paulo",
        "time": "08:00",
        "temperature": "36.5",
        "createdAt": "2023-01-23T8:00:00.000Z",
    },
]
```

### List attendances by date

```bash

GET /attendances?date=23-01-2023
```

```json
[
    {
        "id": 1,
        "status": "present",
        "userEmail": "johndoe@gmail.com",
        "date": "23-01-2023",
        "location": "São Paulo",
        "time": "08:00",
        "temperature": "36.5",
        "createdAt": "2023-01-23T8:00:00.000Z",
    },
    {
        "id": 2,
        "status": "present",
        "userEmail": "janedoe@gmail.com",
        "date": "23-01-2023",
        "location": "São Paulo",
        "time": "08:00",
        "temperature": "36.5",
        "createdAt": "2023-01-23T8:00:00.000Z",
    },
]
```

### List attendances by userEmail

```bash
GET / attendances?email=johndoe@gmail.com
```

```json
[
    {
        "id": 1,
        "status": "present",
        "userEmail": "johndoe@gmail.com",
        "date": "23-01-2023",
        "location": "São Paulo",
        "time": "08:00",
        "temperature": "36.5",
        "createdAt": "2023-01-23T8:00:00.000Z",
    },
]
```

### List attendances by status

```bash
GET / attendances?status=present
```

```json
[
    {
        "id": 1,
        "status": "present",
        "userEmail": "johndoe@gmail.com",
        "date": "23-01-2023",
        "location": "São Paulo",
        "time": "08:00",
        "temperature": "36.5",
        "createdAt": "2023-01-23T8:00:00.000Z",
    },
    {
        "id": 2,
        "status": "present",
        "userEmail": "janedoe@gmail.com",
        "date": "23-01-2023",
        "location": "São Paulo",
        "time": "08:00",
        "temperature": "36.5",
        "createdAt": "2023-01-23T8:00:00.000Z",
    },
]
```

### List attendances by location

```bash
GET / attendances?location=São Paulo
```

```json
[
    {
        "id": 1,
        "status": "present",
        "userEmail": "johndoe@gmail.com",
        "date": "23-01-2023",
        "location": "São Paulo",
        "time": "08:00",
        "temperature": "36.5",
        "createdAt": "2023-01-23T8:00:00.000Z",
    },
    {
        "id": 2,
        "status": "present",
        "userEmail": "janedoe@gmail.com",
        "date": "23-01-2023",
        "location": "São Paulo",
        "time": "08:00",
        "temperature": "36.5",
        "createdAt": "2023-01-23T8:00:00.000Z",
    },
]
```

### Create attendance-rule for organization

```bash
POST /attendance-rules
```

```json
{
    "earlyMinute": "15",
    "lateMinute": "15",
    "offDutyTime": "17:00",
    "onDutyTime": "08:00",
}
```

### List attendance-rules

```bash
GET /attendance-rules
```

```json
[
    {
        "id": 1,
        "earlyMinute": "15",
        "lateMinute": "15",
        "offDutyTime": "17:00",
        "onDutyTime": "08:00",
        "createdAt": "2023-01-23T8:00:00.000Z",
    },
]
```

### List attendance-rules by id

```bash
GET /attendance-rules/1
```

```json
{
    "id": 1,
    "earlyMinute": "15",
    "lateMinute": "15",
    "offDutyTime": "17:00",
    "onDutyTime": "08:00",
    "createdAt": "2023-01-23T8:00:00.000Z",
}
```


## License

This project is licensed under the Kirirom Institute of Technology - see the [LICENSE](LICENSE) file for details
