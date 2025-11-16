# Motherhood Community App - Backend

A Reddit-like community application backend for first-time mothers, built with Spring Boot.

## Features

- ✅ User Registration and Authentication (JWT-based)
- ✅ User Login
- ✅ Post Creation, Update, Delete
- ✅ Get All Posts (with pagination)
- ✅ Get Posts by User
- ✅ Comment on Posts
- ✅ Reply to Comments (Nested Comments - Reddit-style)
- ✅ Update and Delete Comments
- ✅ Article Creation, Update, Delete
- ✅ Get Published Articles (with pagination)
- ✅ Get Articles by Category
- ✅ Get Articles by Author
- ✅ Article View Count Tracking
- ✅ Upvote/Downvote fields (ready for implementation)

## Tech Stack

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security** (JWT Authentication)
- **Spring Data JPA**
- **H2 Database** (Development)
- **PostgreSQL** (Production ready)
- **Maven**

## Project Structure

```
src/main/java/com/motherhood/community/
├── CommunityApplication.java          # Main application class
├── config/
│   └── SecurityConfig.java            # Security configuration
├── controller/
│   ├── AuthController.java            # Authentication endpoints
│   ├── PostController.java            # Post endpoints
│   ├── CommentController.java         # Comment endpoints
│   └── ArticleController.java        # Article endpoints
├── dto/
│   ├── AuthResponse.java              # Authentication response DTO
│   ├── LoginRequest.java              # Login request DTO
│   ├── RegisterRequest.java           # Registration request DTO
│   ├── PostRequest.java               # Post request DTO
│   ├── PostResponse.java              # Post response DTO
│   ├── CommentRequest.java            # Comment request DTO
│   ├── CommentResponse.java           # Comment response DTO
│   ├── ArticleRequest.java            # Article request DTO
│   └── ArticleResponse.java           # Article response DTO
├── entity/
│   ├── User.java                      # User entity
│   ├── Post.java                      # Post entity
│   ├── Comment.java                   # Comment entity
│   └── Article.java                   # Article entity
├── repository/
│   ├── UserRepository.java            # User repository
│   ├── PostRepository.java            # Post repository
│   ├── CommentRepository.java         # Comment repository
│   └── ArticleRepository.java        # Article repository
├── security/
│   └── JwtAuthenticationFilter.java   # JWT authentication filter
├── service/
│   ├── AuthService.java               # Authentication service
│   ├── PostService.java               # Post service
│   ├── CommentService.java            # Comment service
│   ├── ArticleService.java            # Article service
│   └── CustomUserDetailsService.java  # User details service
└── util/
    └── JwtUtil.java                   # JWT utility class
```

## Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6 or higher

### Running the Application

1. Clone the repository
2. Navigate to the project directory
3. Build the project:
   ```bash
   mvn clean install
   ```
4. Run the application:
   ```bash
   mvn spring-boot:run
   ```

The application will start on `http://localhost:8080`

### H2 Console

For development, you can access the H2 database console at:
- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:motherhooddb`
- Username: `sa`
- Password: (leave empty)

## API Endpoints

### Authentication

#### Register a new user
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "userId": 1,
  "username": "johndoe",
  "email": "john@example.com"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "userId": 1,
  "username": "johndoe",
  "email": "john@example.com"
}
```

### Using the JWT Token

For protected endpoints, include the JWT token in the Authorization header:
```http
Authorization: Bearer <your-jwt-token>
```

### Posts

#### Create a new post
```http
POST /api/posts
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "First time mom - need advice",
  "content": "I'm expecting my first child and would love some advice on..."
}
```

**Response:**
```json
{
  "id": 1,
  "title": "First time mom - need advice",
  "content": "I'm expecting my first child and would love some advice on...",
  "authorId": 1,
  "authorUsername": "johndoe",
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00",
  "upvotes": 0,
  "downvotes": 0,
  "commentCount": 0
}
```

#### Get all posts (paginated)
```http
GET /api/posts?page=0&size=10&sortBy=createdAt&sortDir=DESC
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "content": [
    {
      "id": 1,
      "title": "First time mom - need advice",
      "content": "...",
      "authorId": 1,
      "authorUsername": "johndoe",
      "createdAt": "2024-01-15T10:30:00",
      "updatedAt": "2024-01-15T10:30:00",
      "upvotes": 5,
      "downvotes": 0,
      "commentCount": 3
    }
  ],
  "totalElements": 1,
  "totalPages": 1,
  "size": 10,
  "number": 0
}
```

#### Get post by ID
```http
GET /api/posts/{id}
Authorization: Bearer <your-jwt-token>
```

#### Get posts by username
```http
GET /api/posts/user/{username}
Authorization: Bearer <your-jwt-token>
```

**With pagination (optional):**
```http
GET /api/posts/user/{username}?page=0&size=10&sortBy=createdAt&sortDir=DESC
Authorization: Bearer <your-jwt-token>
```

#### Get posts by user ID
```http
GET /api/posts/user/id/{userId}
Authorization: Bearer <your-jwt-token>
```

**With pagination (optional):**
```http
GET /api/posts/user/id/{userId}?page=0&size=10&sortBy=createdAt&sortDir=DESC
Authorization: Bearer <your-jwt-token>
```

#### Get my posts
```http
GET /api/posts/my-posts
Authorization: Bearer <your-jwt-token>
```

**With pagination (optional):**
```http
GET /api/posts/my-posts?page=0&size=10&sortBy=createdAt&sortDir=DESC
Authorization: Bearer <your-jwt-token>
```

#### Update a post
```http
PUT /api/posts/{id}
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "Updated title",
  "content": "Updated content"
}
```

#### Delete a post
```http
DELETE /api/posts/{id}
Authorization: Bearer <your-jwt-token>
```

### Comments

#### Create a comment on a post
```http
POST /api/posts/{postId}/comments
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "content": "This is a great post! Thanks for sharing."
}
```

**Response:**
```json
{
  "id": 1,
  "content": "This is a great post! Thanks for sharing.",
  "authorId": 1,
  "authorUsername": "johndoe",
  "postId": 1,
  "parentCommentId": null,
  "createdAt": "2024-01-15T11:00:00",
  "updatedAt": "2024-01-15T11:00:00",
  "upvotes": 0,
  "downvotes": 0,
  "replyCount": 0,
  "replies": []
}
```

#### Reply to a comment
```http
POST /api/posts/{postId}/comments
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "content": "I completely agree with you!",
  "parentCommentId": 1
}
```

**Response:**
```json
{
  "id": 2,
  "content": "I completely agree with you!",
  "authorId": 2,
  "authorUsername": "janedoe",
  "postId": 1,
  "parentCommentId": 1,
  "createdAt": "2024-01-15T11:05:00",
  "updatedAt": "2024-01-15T11:05:00",
  "upvotes": 0,
  "downvotes": 0,
  "replyCount": 0,
  "replies": []
}
```

#### Get all comments for a post (with nested replies)
```http
GET /api/posts/{postId}/comments
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
[
  {
    "id": 1,
    "content": "This is a great post!",
    "authorId": 1,
    "authorUsername": "johndoe",
    "postId": 1,
    "parentCommentId": null,
    "createdAt": "2024-01-15T11:00:00",
    "updatedAt": "2024-01-15T11:00:00",
    "upvotes": 5,
    "downvotes": 0,
    "replyCount": 2,
    "replies": [
      {
        "id": 2,
        "content": "I completely agree!",
        "authorId": 2,
        "authorUsername": "janedoe",
        "postId": 1,
        "parentCommentId": 1,
        "createdAt": "2024-01-15T11:05:00",
        "updatedAt": "2024-01-15T11:05:00",
        "upvotes": 3,
        "downvotes": 0,
        "replyCount": 0,
        "replies": []
      }
    ]
  }
]
```

#### Get a specific comment
```http
GET /api/posts/{postId}/comments/{commentId}
Authorization: Bearer <your-jwt-token>
```

#### Get replies to a comment
```http
GET /api/posts/{postId}/comments/{commentId}/replies
Authorization: Bearer <your-jwt-token>
```

#### Update a comment
```http
PUT /api/posts/{postId}/comments/{commentId}
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "content": "Updated comment content"
}
```

#### Delete a comment
```http
DELETE /api/posts/{postId}/comments/{commentId}
Authorization: Bearer <your-jwt-token>
```

### Articles

#### Create an article
```http
POST /api/articles
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "10 Essential Tips for First-Time Mothers",
  "content": "Being a first-time mother can be overwhelming...",
  "summary": "A comprehensive guide for new mothers covering essential tips and advice.",
  "category": "Parenting Tips",
  "featuredImageUrl": "https://example.com/image.jpg",
  "isPublished": true
}
```

**Response:**
```json
{
  "id": 1,
  "title": "10 Essential Tips for First-Time Mothers",
  "content": "Being a first-time mother can be overwhelming...",
  "summary": "A comprehensive guide for new mothers covering essential tips and advice.",
  "authorId": 1,
  "authorUsername": "johndoe",
  "category": "Parenting Tips",
  "featuredImageUrl": "https://example.com/image.jpg",
  "viewCount": 0,
  "isPublished": true,
  "createdAt": "2024-01-15T12:00:00",
  "updatedAt": "2024-01-15T12:00:00",
  "publishedAt": "2024-01-15T12:00:00"
}
```

#### Get published articles (public endpoint - no auth required for reading)
```http
GET /api/articles/published?page=0&size=10&sortBy=publishedAt&sortDir=DESC
```

**Response:**
```json
{
  "content": [
    {
      "id": 1,
      "title": "10 Essential Tips for First-Time Mothers",
      "content": "...",
      "summary": "...",
      "authorId": 1,
      "authorUsername": "johndoe",
      "category": "Parenting Tips",
      "featuredImageUrl": "https://example.com/image.jpg",
      "viewCount": 150,
      "isPublished": true,
      "publishedAt": "2024-01-15T12:00:00"
    }
  ],
  "totalElements": 1,
  "totalPages": 1,
  "size": 10,
  "number": 0
}
```

#### Get published articles by category
```http
GET /api/articles/published/category/{category}?page=0&size=10
```

#### Get article by ID (increments view count)
```http
GET /api/articles/{id}?incrementView=true
```

#### Get all articles (including unpublished - requires auth)
```http
GET /api/articles?page=0&size=10&sortBy=createdAt&sortDir=DESC
Authorization: Bearer <your-jwt-token>
```

#### Get articles by author
```http
GET /api/articles/author/{username}?page=0&size=10
Authorization: Bearer <your-jwt-token>
```

#### Get my articles
```http
GET /api/articles/my-articles?page=0&size=10
Authorization: Bearer <your-jwt-token>
```

#### Update an article
```http
PUT /api/articles/{id}
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content...",
  "summary": "Updated summary",
  "category": "New Category",
  "isPublished": true
}
```

#### Delete an article
```http
DELETE /api/articles/{id}
Authorization: Bearer <your-jwt-token>
```

## Database Schema

### Users Table
- `id` (Primary Key)
- `username` (Unique)
- `email` (Unique)
- `password` (Encrypted)
- `first_name`
- `last_name`
- `created_at`
- `updated_at`

### Posts Table
- `id` (Primary Key)
- `title`
- `content`
- `author_id` (Foreign Key to Users)
- `upvotes`
- `downvotes`
- `created_at`
- `updated_at`

### Comments Table
- `id` (Primary Key)
- `content`
- `author_id` (Foreign Key to Users)
- `post_id` (Foreign Key to Posts)
- `parent_comment_id` (Foreign Key to Comments - for replies)
- `upvotes`
- `downvotes`
- `created_at`
- `updated_at`

### Articles Table
- `id` (Primary Key)
- `title`
- `content`
- `summary`
- `author_id` (Foreign Key to Users)
- `category`
- `featured_image_url`
- `view_count`
- `is_published`
- `created_at`
- `updated_at`
- `published_at`

## Configuration

Edit `src/main/resources/application.properties` to configure:
- Server port
- Database connection
- JWT secret and expiration

## Security

- Passwords are encrypted using BCrypt
- JWT tokens are used for authentication
- Protected endpoints require a valid JWT token in the Authorization header

## Next Steps

The following features are ready to be implemented:
- Upvote/Downvote endpoints (voting functionality)
- User profile management
- Search functionality
- Post and comment filtering/sorting

## License

This project is open source and available for use.
