FROM eclipse-temurin:21-jdk-jammy AS build
RUN apt-get update && apt-get install -y --no-install-recommends git && rm -rf /var/lib/apt/lists/*
WORKDIR /src
RUN git init && git remote add origin https://github.com/ReceitaFederal/calculadora-rtc-regime-regular.git \
    && git fetch --depth 1 origin 150cccbe414d4a5edea703e4f7a424af5aa222c7 \
    && git checkout --detach FETCH_HEAD
RUN mkdir -p calculadora/db \
    && ./mvnw -B flyway:migrate -Dflyway.configFiles=./flyway/flyway-pro.conf --batch-mode --errors \
    && ./mvnw -B clean package -DskipTests

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /src/target/api-regime-geral.jar ./api-regime-geral.jar
COPY --from=build /src/calculadora/db/calculadora-pro.db ./calculadora/db/calculadora-pro.db
ENV SPRING_PROFILES_ACTIVE=offline
EXPOSE 8080 9101
ENTRYPOINT ["java", "-Dspring.profiles.active=offline", "-jar", "/app/api-regime-geral.jar"]
