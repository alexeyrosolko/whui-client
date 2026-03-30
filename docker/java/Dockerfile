FROM gradle:8.5-jdk21 AS backend-build

#ENV JAVA_TOOL_OPTIONS="-XX:UseSVE=0"
WORKDIR /wh

COPY wh/ ./
# гарантированно чистим папку static (если была)
RUN rm -rf ./ui/src/main/resources/static
RUN gradle clean :main:bootJar --no-daemon --stacktrace --info


############################
# 3️⃣ Stage – Runtime
############################
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY --from=backend-build /wh/main/build/libs/main-0.0.1-SNAPSHOT.jar wh.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=swagger-show,openapi", "wh.jar"]

