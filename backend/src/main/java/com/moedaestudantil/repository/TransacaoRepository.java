package com.moedaestudantil.repository;

import com.moedaestudantil.model.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransacaoRepository extends JpaRepository<Transacao, Long> {
  List<Transacao> findByProfessorIdOrderByDataHoraDesc(Long professorId);

  List<Transacao> findByAlunoIdOrderByDataHoraDesc(Long alunoId);
}
