# Getting Started

This is the backend application for the Music Track Metadata project.

---

## Details

- Java 17
- Spring Boot 4
- Spring Data JPA
- Spring Security
- Open Feign
- Lombok
- Spring Doc OpenApi (Swagger)

---

## Before start

Configure on application.properties file the required properties

```
# Data base properties
spring.datasource.url=
spring.datasource.username=
spring.datasource.password=

# Spotify Api Credentials
spotify.api.clientId=
spotify.api.clientSecret=
```

---

## Run

In the project directory, you can run:

### `./gradlew bootRun`

Runs the app.\
You can request on [http://localhost:8080](http://localhost:8080).

---

## Available api routes

- **{HOST}**/user/register   GET
- **{HOST}**/getUser/{username}   POST  Basic Authentication required
- **{HOST}**/musictrack/create/{isrc}   GET   Basic Authentication required
- **{HOST}**/musictrack/getMetadata/{isrc}   GET   Basic Authentication required
- **{HOST}**/musictrack/getCover/{isrc}   GET   Basic Authentication required

Swagger

- **{HOST}**/swagger-ui
