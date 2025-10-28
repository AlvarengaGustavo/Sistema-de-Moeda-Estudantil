package com.moedaestudantil.controller;

import com.moedaestudantil.dto.ExtratoResponseDTO;
import com.moedaestudantil.service.ProfessorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/extratos")
public class ExtratoController {

  private final ProfessorService professorService;

  public ExtratoController(ProfessorService professorService) {
    this.professorService = professorService;
  }

  @GetMapping("/alunos/{alunoId}")
  public ResponseEntity<ExtratoResponseDTO> extratoAluno(@PathVariable Long alunoId) {
    return ResponseEntity.ok(professorService.extratoAluno(alunoId));
  }
}
