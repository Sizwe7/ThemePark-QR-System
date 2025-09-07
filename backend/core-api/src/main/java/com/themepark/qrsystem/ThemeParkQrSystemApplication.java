package com.themepark.qrsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Theme Park QR Payment & Entrance System
 * Main Spring Boot Application Class
 * 
 * @author SC MASEKO 402110470
 * @version 1.0
 * @since 2025-09-07
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableCaching
@EnableAsync
@EnableScheduling
@EnableTransactionManagement
public class ThemeParkQrSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(ThemeParkQrSystemApplication.class, args);
    }
}

