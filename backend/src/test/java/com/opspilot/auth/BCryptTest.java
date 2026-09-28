package com.opspilot.auth;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class BCryptTest {
    @Test
    public void generateHash() {
        System.out.println("HASH_START:" + new BCryptPasswordEncoder().encode("password123") + ":HASH_END");
    }
}
