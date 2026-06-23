package com.saathi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SaathiApplication {
    public static void main(String[] args) {
        SpringApplication.run(SaathiApplication.class, args);
    }
}
