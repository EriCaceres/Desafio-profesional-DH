package com.dgcars.backend.email;

import com.dgcars.backend.booking.Booking;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendBookingConfirmation(Booking booking) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(booking.getUser().getEmail());
            helper.setSubject("✅ Reserva confirmada – " + booking.getProduct().getName());
            helper.setText(buildEmailBody(booking), true); // true = HTML

            mailSender.send(message);
        } catch (Exception e) {
            // Si falla el email no rompemos la reserva, solo logueamos
            System.err.println("Error enviando email de confirmación: " + e.getMessage());
        }
    }

    private String buildEmailBody(Booking booking) {
        String nombre = booking.getUser().getFirstName() + " " + booking.getUser().getLastName();
        String servicio = booking.getProduct().getName();
        String fecha = booking.getDate().toString();
        String horario = booking.getTime() != null ? booking.getTime() : "A confirmar";
        String notas = booking.getNotes() != null && !booking.getNotes().isBlank()
                ? booking.getNotes() : "Ninguna";
        String precio = booking.getProduct().getPriceFrom() != null
                ? "$" + String.format("%,d", booking.getProduct().getPriceFrom()) : "A consultar";

        return """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: #f97316; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">✅ ¡Reserva confirmada!</h1>
                    <p style="color: #fff7ed; margin: 8px 0 0;">ShineLab – Estética Automotor</p>
                </div>
                
                <div style="background: #fff; border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 12px 12px;">
                    <p style="color: #374151; font-size: 16px;">Hola <strong>%s</strong>,</p>
                    <p style="color: #6b7280;">Tu reserva fue registrada exitosamente. Aquí están los detalles:</p>
                    
                    <table style="width: 100%%; border-collapse: collapse; margin: 20px 0;">
                        <tr style="background: #f9fafb;">
                            <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold; color: #374151; width: 40%%;">Servicio</td>
                            <td style="padding: 12px; border: 1px solid #e5e7eb; color: #111;">%s</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Fecha</td>
                            <td style="padding: 12px; border: 1px solid #e5e7eb; color: #111;">%s</td>
                        </tr>
                        <tr style="background: #f9fafb;">
                            <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Horario</td>
                            <td style="padding: 12px; border: 1px solid #e5e7eb; color: #111;">%s</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Precio desde</td>
                            <td style="padding: 12px; border: 1px solid #e5e7eb; color: #111;">%s</td>
                        </tr>
                        <tr style="background: #f9fafb;">
                            <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Notas</td>
                            <td style="padding: 12px; border: 1px solid #e5e7eb; color: #111;">%s</td>
                        </tr>
                    </table>
                    
                    <div style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 16px; margin-top: 16px;">
                        <p style="margin: 0; color: #92400e; font-size: 14px;">
                            📍 <strong>Recordá llegar 10 minutos antes de tu turno.</strong><br>
                            Si necesitás cancelar, hacelo con al menos 24 horas de anticipación.
                        </p>
                    </div>
                    
                    <p style="color: #9ca3af; font-size: 13px; margin-top: 24px; text-align: center;">
                        Este es un email automático de ShineLab. No respondas este mensaje.
                    </p>
                </div>
            </div>
            """.formatted(nombre, servicio, fecha, horario, precio, notas);
    }
}
