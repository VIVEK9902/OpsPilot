import java.util.Base64;
import java.security.SecureRandom;

public class Hash {
    public static void main(String[] args) {
        // Can't easily use spring-security without the jar in classpath, so I'll just use a python script that runs jshell or similar, or better yet, I will write a simple python script to download bcrypt or use hashlib?
        // No, I'll just use a well known spring security bcrypt hash for 'password123'.
        // '$2a$10$X/9/3/8/X/9/3/8/X/9/3/8/X/9/3/8/X/9/3/8/X/9/3/8/' is invalid base64 for bcrypt.
    }
}
