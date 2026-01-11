# 📘 APIFlashcards

## 🏗️ Installation

`npm install`

## 🧰 Configuration (environment variables)

`DB_FILE=file:local.db`

`JWT_TOKEN=insert a jwt token here`

## 🏁 Start the project

`npm run dev`

## Database initialization

`npm run db:push`

`npm run db:seed`

---

## Base URL

`http://localhost:3000`

---

## 🔑 Authentification

### 🔹 Registration

**POST** `/auth/register`

**Purpose**: The route used to register

**Necessary authentication type**: public

#### Body (JSON)

```json
{
	"email": "HugoMaganza@gmail.com",
	"firstname": "Hugo",
	"lastname": "Maganza",
	"password": "motdepasse",
	"isAdmin": true
}
```

**PS**: isAdmin being an optional field as its default value is set to false. Include it only if you want the user you create to be an admin.

#### Response
```json
{
  "message": "user created",
  "userData": {
    "email": "HugoMaganza@gmail.com",
    "firstname": "Hugo",
    "lastname": "Maganza",
    "id": "user_id"
  },
  "token": "user_token"
}
```

### 🔹 Login

**POST** `/auth/login`

**Purpose**: The route used to login

**Necessary authentication type**: public

#### Body (JSON)

```json
{
	"email": "clementMoisson@wanadoo.com",
	"password": "motdepasse"
}
```

#### Response (JSON)

```json
{
  "message": "user logged in",
  "userData": {
    "email": "clementMoisson@wanadoo.com",
    "id": "user_id"
  },
  "token": "user_token"
}
```

---

## 📑 Management of collections

### 🔹 Create a collection

**POST** `/collection/`

#### Headers 

```
Authorization: Bearer jwt_token
```

**Purpose**: Creating a collection.

**Necessary authentication type**: authenticated

#### Body (JSON)

```json
{
	"title": "History",
	"description": "Collection gathering history flashcards",
	"isPublic": true
}
```

#### Response (JSON)

```json
{
  "message": "Collection created",
  "data": [
    {
      "id": "collection_id",
      "userId": "user_id",
      "title": "History",
      "description": "Collection gathering history flashcards",
      "isPublic": true
    }
  ]
}

```

### 🔹 Consult a collection

**GET** `/collection/:id`

#### Headers 

```
Authorization: Bearer jwt_token
```

**Purpose**: Consulting the collection that you provided the id of.

**Necessary authentication type**: authenticated

#### Response (JSON)

```json
{
  "message": "Collection found",
  "data": {
    "id": "collection_id",
    "userId": "user_id",
    "title": "History",
    "description": "Collection gathering history flashcards",
    "isPublic": true
  }
}
```

### 🔹 List your own collections

**GET** `/collection/me`

#### Headers 

```
Authorization: Bearer jwt_token
```

**Purpose**: Listing all the collection that belongs to you.

**Necessary authentication type**: authenticated

#### Response (JSON)

```json
{
  "message": "Collection found",
  "data": [
    {
      "id": "collection_id",
      "userId": "user_id",
      "title": "Anglais",
      "description": "Collection regroupant les flashcards pour l'anglais",
      "isPublic": true
    },
    {
      "id": "collection_id",
      "userId": "user_id",
      "title": "Mathématiques",
      "description": "Collection regroupant les flashcards pour les mathématiques",
      "isPublic": false
    },
    {
      "id": "collection_id",
      "userId": "user_id",
      "title": "History",
      "description": "Collection gathering history flashcards",
      "isPublic": true
    }
  ]
}
```

### 🔹 Search public collections

**GET** `/collection/search/:title`

#### Headers 

```
Authorization: Bearer jwt_token
```

**Purpose**: Searching a collection among all the public collections from its name.

**Necessary authentication type**: authenticated

#### Response (JSON)

```json
{
  "message": "Collection found",
  "data": [
    {
      "id": "collection_id",
      "userId": "user_id",
      "title": "History",
      "description": "Collection gathering history flashcards",
      "isPublic": true
    }
  ]
}
```

### 🔹 Edit a collection

**PUT** `/collection/:id`

#### Headers 

```
Authorization: Bearer jwt_token
```

**Purpose**: Modify something about the collection you gave the id of.

**Necessary authentication type**: authenticated

#### Body (JSON)

```json
{
  "title": "History/Geography",
  "description": "Collection gathering history and geography flashcards"
}
```

#### Response (JSON)

```json
{
  "message": "Collection updated"
}
```

### 🔹 Delete a collection

**DELETE** `/collection/:id`

#### Headers 

```
Authorization: Bearer jwt_token
```

**Purpose**: Deleting the collection you gave the id of.

**Necessary authentication type**: authenticated

#### Response (JSON)

```json
{
  "message": "Collection deleted"
}
```

---

## 📚 Management of flashcards

### 🔹 Create a flashcard

**POST** `/flashcards/`

#### Headers 

```
Authorization: Bearer jwt_token
```

**Purpose**: Creating a flashcard

**Necessary authentication type**: authenticated

#### Body (JSON)

```json
{
	"collectionId": "collection_id",
	"front": "When did World War II begin ?",
	"back": "1939",
	"frontUrl": "https://assets.editorial.aetnd.com/uploads/2009/10/marine-wwii-gettyimages-1371382695.jpg",
	"backUrl": "http://www.archives.gov/research/military/ww2/photos/images/ww2-158.jpg"
}
```

#### Response (JSON)

```json
{
  "message": "Flashcard created",
  "data": [
    {
      "id": "flashcard_id",
      "collectionId": "collection_id",
      "front": "When did World War II begin ?",
      "back": "1939",
      "frontUrl": "https://assets.editorial.aetnd.com/uploads/2009/10/marine-wwii-gettyimages-1371382695.jpg",
      "backUrl": "http://www.archives.gov/research/military/ww2/photos/images/ww2-158.jpg",
      "createdAt": "2026-01-11T02:23:53.000Z"
    }
  ]
}
```

**PS**: frontUrl and backUrl being two optional fields.

### 🔹 Consult a flashcard

**GET** `/flashcards/:id`

#### Headers 

```
Authorization: Bearer jwt_token
```

**Purpose**: Consulting the flashcard that you provided the id of.

**Necessary authentication type**: authenticated

#### Response (JSON)

```json
{
  "message": "Flashcard found",
  "data": {
    "id": "flashcard_id",
    "collectionId": "collection_id",
    "front": "When did World War II begin ?",
    "back": "1939",
    "frontUrl": "https://assets.editorial.aetnd.com/uploads/2009/10/marine-wwii-gettyimages-1371382695.jpg",
    "backUrl": "http://www.archives.gov/research/military/ww2/photos/images/ww2-158.jpg",
    "createdAt": "2026-01-11T02:23:53.000Z"
  }
}
```

### 🔹 List the flashcards of a collection

**GET** `/flashcards/:collectionId/all`

#### Headers 

```
Authorization: Bearer jwt_token
```

**Purpose**: Listing all the flashcards of the collection that you provided the id of.

**Necessary authentication type**: authenticated

#### Response (JSON)

```json
[
  {
    "id": "flashcard_id",
    "collectionId": "collection_id",
    "front": "When did World War II begin ?",
    "back": "1939",
    "frontUrl": "https://assets.editorial.aetnd.com/uploads/2009/10/marine-wwii-gettyimages-1371382695.jpg",
    "backUrl": "http://www.archives.gov/research/military/ww2/photos/images/ww2-158.jpg",
    "createdAt": "2026-01-11T02:23:53.000Z"
  },
  {
    "id": "flashcard_id",
    "collectionId": "collection_id",
    "front": "When did World War II end ?",
    "back": "1945",
    "frontUrl": "https://assets.editorial.aetnd.com/uploads/2009/10/marine-wwii-gettyimages-1371382695.jpg",
    "backUrl": "http://www.archives.gov/research/military/ww2/photos/images/ww2-158.jpg",
    "createdAt": "2026-01-11T02:43:28.000Z"
  }
]
```

### 🔹 Retrieve flashcards to revise from a collection

**GET** `/flashcards/:collectionId/revise`

#### Headers 

```
Authorization: Bearer jwt_token
```

**Purpose**: Get from a specific collection all the flashcards that need to be revised (flashcards whose next review date has arrived or passed)

**Necessary authentication type**: authenticated

#### Response (JSON)

If there are no flashcards to revise

```json
{
  "message": "No flashcards to review"
}
```

And if there are flashcards to revise

```json
{
  "data": {
    "id": "flashcard_id",
    "collectionId": "collection_id",
    "front": "When did World War II begin ?",
    "back": "1939",
    "frontUrl": "https://assets.editorial.aetnd.com/uploads/2009/10/marine-wwii-gettyimages-1371382695.jpg",
    "backUrl": "http://www.archives.gov/research/military/ww2/photos/images/ww2-158.jpg",
    "createdAt": "2026-01-11T02:23:53.000Z"
  }
}
```

### 🔹 Edit a flashcard

**PUT** `/flashcards/:id`

#### Headers 

```
Authorization: Bearer jwt_token
```

**Purpose**: Modify something about the flashcard you gave the id of.

**Necessary authentication type**: authenticated

#### Body (JSON)

```json
{
  "front": "When did World War I begin ?",
  "back": "1914"
}
```

#### Response (JSON)

```json
{
  "message": "Flashcards updated"
}
```

### 🔹 Delete a flashcard

**DELETE** `/flashcards/:id`

#### Headers 

```
Authorization: Bearer jwt_token
```

**Purpose**: Delete the flashcard you gave the id of.

**Necessary authentication type**: authenticated

#### Response (JSON)

```json
{
  "message": "Flashcards deleted"
}
```

### 🔹 Revise a flashcard

**GET** `/flashcards/revise/:flashcardId`

#### Headers 

```
Authorization: Bearer jwt_token
```

**Purpose**: Record a flashcard revision

**Necessary authentication type**: authenticated

#### Response (JSON)

```json
{
  "message": "Revision created",
  "data": [
    {
      "id": "revision_id",
      "flashcardId": "flashcard_id",
      "userId": "user_id",
      "level": 1,
      "lastRevision": "2026-01-11T11:47:24.000Z",
      "nextRevision": "2026-01-12T11:47:24.000Z"
    }
  ]
}
```

---

## 👨‍💻 User management (admin)

### 🔹 List all the users

**GET** `/admin/users`

#### Headers

```
Authorization: Bearer jwt_token
```

**Purpose**: Retrieve all the registered users

**Necessary authentication type**: admin

#### Response (JSON)

```json
[
  {
    "id": "user_id",
    "email": "HugoMaganza@gmail.com",
    "firstname": "Hugo",
    "lastname": "Maganza",
    "password": "$2b$12$sSSGvZ76EI8dxy0g23q7.eCwfwDSCTGGcPSTo6OifGJh9JrCx2fyu",
    "isAdmin": true,
    "createdAt": "2026-01-11T03:14:46.000Z"
  },
  {
    "id": "user_id",
    "email": "clementMoisson@wanadoo.com",
    "firstname": "Clément",
    "lastname": "Moisson",
    "password": "$2b$12$cQjFvIf4rCM9ezemn7AzjesOO8UbMjoDOBQNbaVf5xoj9voaDhPu2",
    "isAdmin": false,
    "createdAt": "2026-01-11T03:10:23.000Z"
  },
  {
    "id": "user_id",
    "email": "julienMaganza@orange.fr",
    "firstname": "Julien",
    "lastname": "Maganza",
    "password": "$2b$12$VX7nV5WqJPGIKn9p9d0inuedfG7gV/KlmZcLsNmNo7A5FoeMVO7DK",
    "isAdmin": true,
    "createdAt": "2026-01-11T03:10:23.000Z"
  }
]
```

### 🔹 Consult a user

**GET** `/admin/user/:id`

#### Headers 

```
Authorization: Bearer jwt_token
```

**Purpose**: Consult informations about the user that you provided the id of.

**Necessary authentication type**: admin

#### Response (JSON)

```json
{
  "id": "user_id",
  "email": "HugoMaganza@gmail.com",
  "firstname": "Hugo",
  "lastname": "Maganza",
  "password": "$2b$12$sSSGvZ76EI8dxy0g23q7.eCwfwDSCTGGcPSTo6OifGJh9JrCx2fyu",
  "isAdmin": true,
  "createdAt": "2026-01-11T03:14:46.000Z"
}
```

### 🔹 Delete a user

**DELETE** `/admin/user/:id`

#### Headers 

```
Authorization: Bearer jwt_token
```

**Purpose**: Delete the user that you provided the id of.

**Necessary authentication type**: admin

#### Response (JSON)

```json
{
  "message": "User deleted successfully"
}
```

---

## 🖼️ Database Schema

<img width="1866" height="752" alt="image" src="https://github.com/user-attachments/assets/eb13abe5-e3f0-4173-82b7-c8b12f0c3d88" />
