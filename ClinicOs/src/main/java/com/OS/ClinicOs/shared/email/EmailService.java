package com.OS.ClinicOs.shared.email;

import com.OS.ClinicOs.shared.exception.exception_per.AutreException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendSimpleEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (RuntimeException e) {
            System.out.println("Problemme dans l'envoie de l'email : " + e.getMessage());
            throw new AutreException("Erreur lors de l'envoie de l'email a : " + to);
        }
    }

    public void sendHtmlEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            System.out.println("Problemme dans l'envoie de l'email : " + e.getMessage());
            throw new AutreException("Erreur lors de l'envoie de l'email a : " + to);
        }
    }

    public void sendWelcomeEmail(String to, String name) {
        String subject = "Bienvenue sur ClinicOs";
        String htmlBody = "<div style=\"font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #e0e0e0;border-radius:8px;\">"
                + "<h2 style=\"color:#2563eb;\">Bienvenue, " + name + " !</h2>"
                + "<p>Votre compte a ete cree avec succes sur la plateforme <strong>ClinicOs</strong>.</p>"
                + "<p>Nous sommes ravis de vous compter parmi nos utilisateurs.</p>"
                + "<p style=\"color:#6b7280;\">Cordialement,<br/>L'equipe ClinicOs</p>"
                + "</div>";
        sendHtmlEmail(to, subject, htmlBody);
    }

    public void sendAccountCreatedEmail(String to, String name, String email, String generatedPassword) {
        String subject = "Vos identifiants de connexion ClinicOs";
        String htmlBody = "<div style=\"font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #e0e0e0;border-radius:8px;\">"
                + "<h2 style=\"color:#2563eb;\">Bonjour, " + name + " !</h2>"
                + "<p>Un compte <strong>Medecin</strong> a ete cree pour vous sur la plateforme <strong>ClinicOs</strong>.</p>"
                + "<p>Vos identifiants de connexion sont :</p>"
                + "<div style=\"background:#f3f4f6;padding:16px;border-radius:8px;\">"
                + "<p><strong>Email :</strong> " + email + "</p>"
                + "<p><strong>Mot de passe :</strong> " + generatedPassword + "</p>"
                + "</div>"
                + "<p style=\"color:#ef4444;\">Pour des raisons de securite, veuillez changer ce mot de passe apres votre premiere connexion.</p>"
                + "<p style=\"color:#6b7280;\">Cordialement,<br/>L'equipe ClinicOs</p>"
                + "</div>";
        sendHtmlEmail(to, subject, htmlBody);
    }

    public void sendPasswordResetEmail(String to, String name, String resetCode) {
        String subject = "Reinitialisation de votre mot de passe ClinicOs";
        String htmlBody = "<div style=\"font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #e0e0e0;border-radius:8px;\">"
                + "<h2 style=\"color:#2563eb;\">Bonjour, " + name + " !</h2>"
                + "<p>Vous avez demande la reinitialisation de votre mot de passe.</p>"
                + "<p>Votre code de verification est :</p>"
                + "<div style=\"background:#f3f4f6;padding:16px;border-radius:8px;text-align:center;font-size:24px;font-weight:bold;color:#2563eb;\">"
                + resetCode
                + "</div>"
                + "<p style=\"color:#6b7280;\">Si vous n'etes pas a l'origine de cette demande, ignorez cet email.</p>"
                + "<p style=\"color:#6b7280;\">Cordialement,<br/>L'equipe ClinicOs</p>"
                + "</div>";
        sendHtmlEmail(to, subject, htmlBody);
    }

    public void sendAppointmentConfirmationEmail(String to, String patientName, String date, String heure, String medecinName) {
        String subject = "Confirmation de votre rendez-vous ClinicOs";
        String htmlBody = "<div style=\"font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #e0e0e0;border-radius:8px;\">"
                + "<h2 style=\"color:#2563eb;\">Bonjour, " + patientName + " !</h2>"
                + "<p>Votre rendez-vous a bien ete confirme :</p>"
                + "<div style=\"background:#f3f4f6;padding:16px;border-radius:8px;\">"
                + "<p><strong>Date :</strong> " + date + "</p>"
                + "<p><strong>Heure :</strong> " + heure + "</p>"
                + "<p><strong>Medecin :</strong> " + medecinName + "</p>"
                + "</div>"
                + "<p style=\"color:#6b7280;\">Nous vous attendons a l'heure convenue.</p>"
                + "<p style=\"color:#6b7280;\">Cordialement,<br/>L'equipe ClinicOs</p>"
                + "</div>";
        sendHtmlEmail(to, subject, htmlBody);
    }
}
