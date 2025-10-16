package com.moedaestudantil.repository;

import com.moedaestudantil.model.EmpresaParceira;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmpresaParceiraRepository extends JpaRepository<EmpresaParceira, Long> {
    Optional<EmpresaParceira> findByEmail(String email);
    Optional<EmpresaParceira> findByCnpj(String cnpj);
}
