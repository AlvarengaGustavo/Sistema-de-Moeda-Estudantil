package com.moedaestudantil.controller;

import com.moedaestudantil.dto.EnviarMoedasRequestDTO;
import com.moedaestudantil.dto.ExtratoResponseDTO;
import com.moedaestudantil.dto.ProfessorResponseDTO;
import com.moedaestudantil.service.ProfessorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/professores")
@Validated
public class ProfessorController {

  private final ProfessorService professorService;

  public ProfessorController(ProfessorService professorService) {
    this.professorService = professorService;
  }

  @GetMapping
  public ResponseEntity<List<ProfessorResponseDTO>> listar() {
    return ResponseEntity.ok(professorService.listarProfessores());
  }

  @PostMapping("/{professorId}/enviar-moedas")
  public ResponseEntity<Void> enviarMoedas(@PathVariable Long professorId,
      @Valid @RequestBody EnviarMoedasRequestDTO req) {
    professorService.enviarMoedas(professorId, req);
    return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
  }

  @GetMapping("/{professorId}/extrato")
  public ResponseEntity<ExtratoResponseDTO> extrato(@PathVariable Long professorId) {
    return ResponseEntity.ok(professorService.extratoProfessor(professorId));
  }
}
