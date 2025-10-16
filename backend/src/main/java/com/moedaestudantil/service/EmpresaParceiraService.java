package com.moedaestudantil.service;

import com.moedaestudantil.dto.EmpresaParceiraRequestDTO;
import com.moedaestudantil.dto.EmpresaParceiraResponseDTO;
import com.moedaestudantil.model.EmpresaParceira;
import com.moedaestudantil.repository.EmpresaParceiraRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmpresaParceiraService {

    private final EmpresaParceiraRepository empresaRepository;
    private final PasswordEncoder passwordEncoder;

    public EmpresaParceiraService(EmpresaParceiraRepository empresaRepository, PasswordEncoder passwordEncoder) {
        this.empresaRepository = empresaRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public EmpresaParceiraResponseDTO criar(EmpresaParceiraRequestDTO dto) {
        empresaRepository.findByEmail(dto.getEmail()).ifPresent(e -> { throw new DataIntegrityViolationException("Email já cadastrado"); });
        empresaRepository.findByCnpj(dto.getCnpj()).ifPresent(e -> { throw new DataIntegrityViolationException("CNPJ já cadastrado"); });
        // validate CNPJ
        String cnpjDigits = onlyDigits(dto.getCnpj());
        if (!isValidCNPJ(cnpjDigits)) {
            throw new IllegalArgumentException("CNPJ inválido");
        }

        String senhaHash = passwordEncoder.encode(dto.getSenha());
        EmpresaParceira empresa = new EmpresaParceira(dto.getNome(), dto.getCnpj(), dto.getEmail(), senhaHash);
        EmpresaParceira salvo = empresaRepository.save(empresa);
        return toResponseDTO(salvo);
    }

    public List<EmpresaParceiraResponseDTO> buscarTodos() {
        return empresaRepository.findAll().stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    public EmpresaParceiraResponseDTO buscarPorId(Long id) {
        EmpresaParceira e = empresaRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Empresa não encontrada"));
        return toResponseDTO(e);
    }

    public EmpresaParceiraResponseDTO atualizar(Long id, EmpresaParceiraRequestDTO dto) {
        EmpresaParceira existente = empresaRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Empresa não encontrada"));

        if (!existente.getEmail().equals(dto.getEmail())) {
            empresaRepository.findByEmail(dto.getEmail()).ifPresent(en -> { throw new DataIntegrityViolationException("Email já cadastrado"); });
        }
        if (!existente.getCnpj().equals(dto.getCnpj())) {
            empresaRepository.findByCnpj(dto.getCnpj()).ifPresent(en -> { throw new DataIntegrityViolationException("CNPJ já cadastrado"); });
        }

        existente.setNome(dto.getNome());
        existente.setEmail(dto.getEmail());
        if (dto.getSenha() != null && !dto.getSenha().isBlank()) {
            existente.setSenha(passwordEncoder.encode(dto.getSenha()));
        }
        // validate cnpj if changed
        String cnpjDigits = onlyDigits(dto.getCnpj());
        if (!isValidCNPJ(cnpjDigits)) {
            throw new IllegalArgumentException("CNPJ inválido");
        }
        existente.setCnpj(dto.getCnpj());

        EmpresaParceira atualizado = empresaRepository.save(existente);
        return toResponseDTO(atualizado);
    }

    private String onlyDigits(String s) {
        if (s == null) return "";
        return s.replaceAll("\\D", "");
    }

    // basic CNPJ validation (length + checksum algorithm)
    private boolean isValidCNPJ(String cnpj) {
        if (cnpj == null) return false;
        if (cnpj.length() != 14) return false;
        if (cnpj.matches("^(\\d)\\1{13}$")) return false;
        try {
            int[] weights1 = {5,4,3,2,9,8,7,6,5,4,3,2};
            int[] weights2 = {6,5,4,3,2,9,8,7,6,5,4,3,2};
            int sum = 0;
            for (int i = 0; i < 12; i++) sum += Character.getNumericValue(cnpj.charAt(i)) * weights1[i];
            int r = sum % 11;
            int dig1 = (r < 2) ? 0 : 11 - r;
            if (dig1 != Character.getNumericValue(cnpj.charAt(12))) return false;
            sum = 0;
            for (int i = 0; i < 13; i++) sum += Character.getNumericValue(cnpj.charAt(i)) * weights2[i];
            r = sum % 11;
            int dig2 = (r < 2) ? 0 : 11 - r;
            return dig2 == Character.getNumericValue(cnpj.charAt(13));
        } catch (Exception e) {
            return false;
        }
    }

    public void deletar(Long id) {
        if (!empresaRepository.existsById(id)) {
            throw new IllegalArgumentException("Empresa não encontrada");
        }
        empresaRepository.deleteById(id);
    }

    private EmpresaParceiraResponseDTO toResponseDTO(EmpresaParceira e) {
        return new EmpresaParceiraResponseDTO(e.getId(), e.getNome(), e.getCnpj(), e.getEmail());
    }
}
