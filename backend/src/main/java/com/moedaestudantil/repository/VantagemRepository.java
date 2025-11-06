package com.moedaestudantil.repository;

import com.moedaestudantil.model.Vantagem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VantagemRepository extends JpaRepository<Vantagem, Long> {
  List<Vantagem> findByEmpresaParceiraId(Long empresaId);
}
