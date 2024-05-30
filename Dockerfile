# Use an official maven parent image with Java included.
FROM maven:3.8.4-openjdk-11

# Install pandoc.
RUN apt-get update && apt-get install -y pandoc texlive-latex-base texlive-latex-extra

# Set the working directory in the container to /app.
WORKDIR /app

# Copy the pom.xml file into the container at /app.
COPY pom.xml .

# Download all required dependencies into one layer.
RUN mvn dependency:go-offline -B

# Copy the rest of the app's source code from the host to the filesystem.
COPY src ./src

# Build the application.
RUN mvn clean package

# Make the simplewebapp script executable
RUN chmod +x /app/target/bin/simplewebapp

# Make port 8080 available to the world outside this container.
EXPOSE 8080

# Run the application when the container launches.
CMD ["/app/target/bin/simplewebapp"]