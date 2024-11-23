FROM openjdk:21-oracle
VOLUME /tmp
CMD["mvn","package"]
COPY target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]