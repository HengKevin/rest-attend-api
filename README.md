# Overview

Rest attend api is a simple api to manage attendances of students at the Icubation Center. Our aim to build this api is to help the Icubation Center to manage the attendance of students and to help the students to check in and check out. 

This api is built with Nest js, a progressive Node.js framework for building efficient, reliable and scalable server-side applications.

## Features

-   [x] Create Users
-   [x] Query User
-   [x] Update User's name
-   [x] Delete User
-   [x] Create Attendance
-   [x] Query Attendance by date
-   [x] Query Attendance by user
-   [x] Query Attendance by user and date
-   [x] Query Attendance by location
-   [x] Create Attendance rules
-   [x] Query Attendance rules by id
-   [x] Update Attendance rules 
-   [x] Delete Attendance rules
-   [x] Create Historic Attendance
-   [x] Query Historic Attendance by user
-   [x] Query Historic Attendance by user and date
-   [x] Query Historic Attendance by date
-   [x] Delete Historic Attendance


## Prerequisite

### Requirements for this project are

-   [Node.js, v16.13.1](https://nodejs.org/fr/blog/release/v16.13.1/)
-   [Postgresql](https://www.postgresql.org/)
-   [Postman](https://www.getpostman.com/)
-   [Git](https://git-scm.com/)
-   [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable)

### Clone the repository

```bash
git clone https://github.com/HengKevin/rest-attend-api.git
```

### Install dependencies

```bash
yarn install
```

### Run migrations

```bash
yarn prisma migrate
```

### Update Server's database

```bash
yarn prisma db push
```

### Run the application on dev

```bash
yarn start:dev
```

### To access the Swagger documentation of api localhost
```bash
localhost:3000/api/v1
```

### Run the tests

```bash
yarn test
```

## Local test

### .env
    
```bash
DATABASE_URL=postgresql://{username}:{password}@{host}:{port}/{database_name}?schema=public
```

## Understanding the architecture of Nest js

### Controllers
what is controller for?

Controllers are responsible for handling incoming requests and returning responses to the client. You can think of them as the entry points (routes) to your application.
Example

```bash
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Hello World!';
  }
}
```

### Services

Services are the place where you put the business logic of your application. They are usually used to fetch data from the database, process it, and return it to the controller.

```bash
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
```

### Providers

Providers are classes that can be injected into other classes, and they act as a bridge between different classes. They are usually used to share data between classes.

```bash
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
```

### Entity

Entity is a class that represents a table in your database.

```bash
import { Users } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
export class UserEntity implements Users {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  faceString: string;
}
```

### Dto

Dto is a class that defines the shape of the data to be sent in a request.

```bash
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}
```

### Modules

Modules are containers for controllers, providers, and other modules. They are used to group related functionality and provide a way to organize your application.

```bash
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## Modules

### Users

Users is to record all the users registered by the application.

```bash
├───src
│   ├───modules
│   │   └───users
│   │       ├───dto
│   │       │   ├───user.dto.ts
│   │       │   ├───username.dto.ts
│   │       │
│   │       ├───user.entity.ts
│   │       ├───users.controller.spec.ts
│   │       ├───users.controller.ts
│   │       ├───users.module.ts
│   │       ├───users.service.spec.ts
│   │       └───users.service.ts
```

### Attendances

Attendances is to record the attendance checkIn and checkOut of the students.

```bash
├───src
│   ├───modules
│   │   └───attendances
│   │       ├───dto
│   │       │   ├───attendance.dto.ts
│   │       │
│   │       ├───attendance.entity.ts
│   │       ├───attendances.controller.spec.ts
│   │       ├───attendances.controller.ts
│   │       ├───attendances.module.ts
│   │       ├───attendances.service.spec.ts
│   │       └───attendances.service.ts
```

## Attendance rules

Attendance rules is to record all the rules of the attendance set by the admin.

```bash
├───src
│   ├───modules
│   │   └───attendance-rules
│   │       ├───dto
│   │       │   ├───attendance-rule.dto.ts
│   │       │   ├───update-attendance-rule.dto.ts
│   │       │
│   │       ├───attendance-rule.entity.ts
│   │       ├───attendance-rule.controller.spec.ts
│   │       ├───attendance-rule.controller.ts
│   │       ├───attendance-rule.module.ts
│   │       ├───attendance-rule.service.spec.ts
│   │       └───attendance-rule.service.ts
```

## Historic attendances

Historic sttendances is to record all the attendance and their status by date and location.

```bash
├───src
│   ├───modules
│   │   └───historic-attendances
│   │       ├───dto
│   │       │   ├───historic-attendance.dto.ts
│   │       │
│   │       ├───historic-attendance.entity.ts
│   │       ├───historic-attendance.controller.spec.ts
│   │       ├───historic-attendance.controller.ts
│   │       ├───historic-attendance.module.ts
│   │       ├───historic-attendance.service.spec.ts
│   │       └───historic-attendance.service.ts
```

### Prisma

Prisma is an open-source ORM for Node.js and TypeScript. It is used to define the database schema and to generate the corresponding database client.

```bash
├───src
│   ├───prisma
│   │   ├───prisma.module.ts
│   │   ├───prisma.service.spec.ts
│   │   ├───prisma.service.ts
```

## Project's schema

For this project we will be using prisma to define the schema of the entire project.
    
```bash
datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
}

generator client {
    provider = "prisma-client-js"
}

model User {
    id        Int      @id @default(autoincrement())
    firstName String
    lastName  String
    email     String   @unique
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
}

model Attendance {
    id        Int      @id @default(autoincrement())
    status    String
    date      String
    location  String
    time      String
    temperature String
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    user      User     @relation(fields: [userId], references: [id])
    userId    Int
}

model AttendanceRule {
    id        Int      @id @default(autoincrement())
    status    String
    date      String
    location  String
    time      String
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
}

model HistoricAttendance {
    id        Int      @id @default(autoincrement())
    status    String
    date      String
    location  String
    time      String
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    user      User     @relation(fields: [userId], references: [id])
    userId    Int
}
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
