package com.moedaestudantil.controller;

import com.moedaestudantil.model.Instituicao;
import com.moedaestudantil.repository.InstituicaoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/instituicoes")
public class InstituicaoController {

  private final InstituicaoRepository instituicaoRepository;

  public InstituicaoController(InstituicaoRepository instituicaoRepository) {
    this.instituicaoRepository = instituicaoRepository;
  }

  @GetMapping
  public ResponseEntity<List<Instituicao>> listar() {
    return ResponseEntity.ok(instituicaoRepository.findAll());
  }
}
