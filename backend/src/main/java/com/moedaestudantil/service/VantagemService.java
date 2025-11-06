package com.moedaestudantil.service;

import com.moedaestudantil.dto.VantagemRequestDTO;
import com.moedaestudantil.dto.VantagemResponseDTO;
import com.moedaestudantil.model.EmpresaParceira;
import com.moedaestudantil.model.Vantagem;
import com.moedaestudantil.repository.EmpresaParceiraRepository;
import com.moedaestudantil.repository.VantagemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VantagemService {

  @Autowired
  private VantagemRepository vantagemRepository;

  @Autowired
  private EmpresaParceiraRepository empresaRepository;

  public List<VantagemResponseDTO> listarTodas() {
    return vantagemRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
  }

  public VantagemResponseDTO buscarPorId(Long id) {
    return vantagemRepository.findById(id).map(this::toDto)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vantagem não encontrada"));
  }

  public VantagemResponseDTO criar(VantagemRequestDTO dto) {
    EmpresaParceira empresa = empresaRepository.findById(dto.getEmpresaParceiraId())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Empresa parceira inválida"));
    if (dto.getPrecoMoedas() == null || dto.getPrecoMoedas() < 0) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Preço em moedas inválido");
    }
    Vantagem v = new Vantagem(dto.getTitulo(), dto.getDescricao(), dto.getPrecoMoedas(), dto.getFotoUrl(), empresa);
    vantagemRepository.save(v);
    return toDto(v);
  }

  public VantagemResponseDTO atualizar(Long id, VantagemRequestDTO dto) {
    Vantagem existente = vantagemRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vantagem não encontrada"));
    EmpresaParceira empresa = empresaRepository.findById(dto.getEmpresaParceiraId())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Empresa parceira inválida"));
    existente.setTitulo(dto.getTitulo());
    existente.setDescricao(dto.getDescricao());
    existente.setPrecoMoedas(dto.getPrecoMoedas());
    existente.setFotoUrl(dto.getFotoUrl());
    existente.setEmpresaParceira(empresa);
    vantagemRepository.save(existente);
    return toDto(existente);
  }

  public void deletar(Long id) {
    Vantagem existente = vantagemRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vantagem não encontrada"));
    vantagemRepository.delete(existente);
  }

  private VantagemResponseDTO toDto(Vantagem v) {
    VantagemResponseDTO r = new VantagemResponseDTO();
    r.setId(v.getId());
    r.setTitulo(v.getTitulo());
    r.setDescricao(v.getDescricao());
    r.setPrecoMoedas(v.getPrecoMoedas());
    r.setFotoUrl(v.getFotoUrl());
    if (v.getEmpresaParceira() != null) {
      r.setEmpresaId(v.getEmpresaParceira().getId());
      r.setEmpresaNome(v.getEmpresaParceira().getNome());
    }
    return r;
  }
}
