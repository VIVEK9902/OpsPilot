# ==========================================
# Stage 1: Build the application
# ==========================================
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Copy the pom.xml and source code
COPY pom.xml .
COPY src ./src

# Package the application (skip tests in Docker build, CI handles tests)
RUN mvn clean package -DskipTests

# ==========================================
# Stage 2: Create the runtime image
# ==========================================
FROM eclipse-temurin:21-jre

WORKDIR /app

# Run as non-root user
RUN groupadd -r opspilot && useradd -r -g opspilot opspilot
USER opspilot

# Copy the packaged jar from the builder stage
COPY --from=builder /app/target/opspilot-0.0.1-SNAPSHOT.jar app.jar

# Expose the application port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
