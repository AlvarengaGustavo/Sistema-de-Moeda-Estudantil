package com.moedaestudantil.config;

import com.moedaestudantil.model.Instituicao;
import com.moedaestudantil.model.Professor;
import com.moedaestudantil.repository.InstituicaoRepository;
import com.moedaestudantil.repository.ProfessorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataLoader {

  @Bean
  public CommandLineRunner loadSampleProfessors(ProfessorRepository professorRepository,
      InstituicaoRepository instituicaoRepository,
      PasswordEncoder passwordEncoder) {
    return args -> {
      // Seed institutions if empty
      if (instituicaoRepository.count() == 0) {
        instituicaoRepository.save(new Instituicao("Universidade X"));
        instituicaoRepository.save(new Instituicao("Universidade Y"));
      }

      if (professorRepository.count() == 0) {
        Instituicao instX = instituicaoRepository.findByNome("Universidade X").orElse(null);
        Instituicao instY = instituicaoRepository.findByNome("Universidade Y").orElse(null);
        Professor p1 = new Professor(
            "João da Silva",
            "12345678901",
            "Computação",
            null,
            "joao.silva@universidadex.edu",
            passwordEncoder.encode("senha123"));
        p1.setInstituicao(instX);
        Professor p2 = new Professor(
            "Maria Oliveira",
            "98765432100",
            "Matemática",
            null,
            "maria.oliveira@universidadey.edu",
            passwordEncoder.encode("senha123"));
        p2.setInstituicao(instY);
        professorRepository.save(p1);
        professorRepository.save(p2);
      }
    };
  }
}
