package com.moedaestudantil.service.impl;

import com.moedaestudantil.service.EmailService;
import org.springframework.stereotype.Service;

@Service
public class ConsoleEmailService implements EmailService {
  @Override
  public void enviarEmail(String para, String assunto, String corpo) {
    // Simples implementação para fins de laboratório/demonstração
    System.out.println("==== EMAIL SIMULADO ====");
    System.out.println("Para: " + para);
    System.out.println("Assunto: " + assunto);
    System.out.println("Corpo:\n" + corpo);
    System.out.println("========================");
  }
}
