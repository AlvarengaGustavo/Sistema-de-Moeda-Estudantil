package com.moedaestudantil.repository;

import com.moedaestudantil.model.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AlunoRepository extends JpaRepository<Aluno, Long> {
    Optional<Aluno> findByEmail(String email);
    Optional<Aluno> findByCpf(String cpf);
}
