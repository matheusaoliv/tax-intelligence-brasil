FROM eclipse-temurin:21-jdk-jammy AS build
RUN apt-get update && apt-get install -y --no-install-recommends git && rm -rf /var/lib/apt/lists/*
WORKDIR /src
RUN git init && git remote add origin https://github.com/ReceitaFederal/calculadora-rtc-simples-nacional.git \
    && git fetch --depth 1 origin c5b0f01c8351c3f0d0795cc617b29d233e9f98df \
    && git checkout --detach FETCH_HEAD
RUN ./mvnw -B clean package -DskipTests

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /src/target/api-simples-nacional.jar ./api-simples-nacional.jar
ENV SPRING_PROFILES_ACTIVE=offline
EXPOSE 8082 9103
ENTRYPOINT ["java", "-Dspring.profiles.active=offline", "-jar", "/app/api-simples-nacional.jar"]
