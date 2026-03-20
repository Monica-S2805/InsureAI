package com.insureai;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;


@SpringBootTest
@ActiveProfiles("test")   // ✅ forces Spring to load application-test.properties
class InsureaiApplicationTests {

    @Test
    void contextLoads() {
        // Just checks if Spring context starts
    }
}

