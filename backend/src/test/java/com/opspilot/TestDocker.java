package com.opspilot;
import org.testcontainers.DockerClientFactory;
import com.github.dockerjava.api.DockerClient;
import org.slf4j.LoggerFactory;
import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;

public class TestDocker {
    public static void main(String[] args) {
        System.out.println("Starting Docker Client test...");
        Logger root = (Logger)LoggerFactory.getLogger(Logger.ROOT_LOGGER_NAME);
        root.setLevel(Level.DEBUG);
        try {
            System.setProperty("DOCKER_HOST", "tcp://localhost:2375");
            DockerClient client = DockerClientFactory.instance().client();
            System.out.println("Info: " + client.infoCmd().exec());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}