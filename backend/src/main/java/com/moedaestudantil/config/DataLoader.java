package com.moedaestudantil.config;

import com.moedaestudantil.model.Instituicao;
import com.moedaestudantil.model.Professor;
import com.moedaestudantil.model.EmpresaParceira;
import com.moedaestudantil.model.Vantagem;
import com.moedaestudantil.repository.InstituicaoRepository;
import com.moedaestudantil.repository.ProfessorRepository;
import com.moedaestudantil.repository.EmpresaParceiraRepository;
import com.moedaestudantil.repository.VantagemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataLoader {

  @Bean
  public CommandLineRunner loadSampleProfessors(ProfessorRepository professorRepository,
      InstituicaoRepository instituicaoRepository,
      PasswordEncoder passwordEncoder,
      EmpresaParceiraRepository empresaParceiraRepository,
      VantagemRepository vantagemRepository) {
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

      // Seed some partner companies for demo
      if (empresaParceiraRepository.count() == 0) {
        EmpresaParceira e1 = new EmpresaParceira("Restaurante Bom Sabor", "11111111111111", "contato@bomsabor.com",
            passwordEncoder.encode("senha123"));
        EmpresaParceira e2 = new EmpresaParceira("Livraria Universitária", "22222222222222", "contato@livrariauni.com",
            passwordEncoder.encode("senha123"));
        empresaParceiraRepository.save(e1);
        empresaParceiraRepository.save(e2);
      }

      // Seed some vantagens if none exist
      if (vantagemRepository.count() == 0) {
        EmpresaParceira e1 = empresaParceiraRepository.findByEmail("contato@bomsabor.com").orElse(null);
        EmpresaParceira e2 = empresaParceiraRepository.findByEmail("contato@livrariauni.com").orElse(null);
        if (e1 != null) {
          vantagemRepository.save(new Vantagem("10% de desconto no almoço",
              "Válido no Restaurante Bom Sabor durante horário de almoço.", 50, null, e1));
        }
        if (e2 != null) {
          vantagemRepository
              .save(new Vantagem("Desconto em material acadêmico", "10% em livros selecionados.", 200, null, e2));
        }
      }
    };
  }
}
