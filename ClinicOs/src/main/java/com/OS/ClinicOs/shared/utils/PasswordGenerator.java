package com.OS.ClinicOs.shared.utils;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class PasswordGenerator {

    private static final String CHARS_LOWER = "abcdefghijklmnopqrstuvwxyz";
    private static final String CHARS_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String CHARS_DIGITS = "0123456789";
    private static final String CHARS_SPECIAL = "!@#$%^&*";
    private static final String ALL_CHARS = CHARS_LOWER + CHARS_UPPER + CHARS_DIGITS + CHARS_SPECIAL;

    private final SecureRandom secureRandom = new SecureRandom();


    public String generateRandomPassword() {
        return generateRandomPassword(12);
    }

    public String generateRandomPassword(int length) {
        if (length < 4) {
            throw new IllegalArgumentException("La longueur du mot de passe doit etre au minimum de 4 caracteres");
        }

        StringBuilder password = new StringBuilder(length);

        password.append(CHARS_UPPER.charAt(secureRandom.nextInt(CHARS_UPPER.length())));
        password.append(CHARS_LOWER.charAt(secureRandom.nextInt(CHARS_LOWER.length())));
        password.append(CHARS_DIGITS.charAt(secureRandom.nextInt(CHARS_DIGITS.length())));
        password.append(CHARS_SPECIAL.charAt(secureRandom.nextInt(CHARS_SPECIAL.length())));

        for (int i = 4; i < length; i++) {
            password.append(ALL_CHARS.charAt(secureRandom.nextInt(ALL_CHARS.length())));
        }

        char[] chars = password.toString().toCharArray();
        for (int i = chars.length - 1; i > 0; i--) {
            int index = secureRandom.nextInt(i + 1);
            char tmp = chars[index];
            chars[index] = chars[i];
            chars[i] = tmp;
        }

        return new String(chars);
    }
}
