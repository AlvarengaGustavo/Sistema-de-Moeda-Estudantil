package com.moedaestudantil.controller;

import com.moedaestudantil.dto.VantagemRequestDTO;
import com.moedaestudantil.dto.VantagemResponseDTO;
import com.moedaestudantil.service.VantagemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/vantagens")
@Validated
public class VantagemController {

  @Autowired
  private VantagemService vantagemService;

  @GetMapping
  public List<VantagemResponseDTO> listar() {
    return vantagemService.listarTodas();
  }

  @GetMapping("/{id}")
  public VantagemResponseDTO buscar(@PathVariable Long id) {
    return vantagemService.buscarPorId(id);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public VantagemResponseDTO criar(@Valid @RequestBody VantagemRequestDTO dto) {
    return vantagemService.criar(dto);
  }

  @PutMapping("/{id}")
  public VantagemResponseDTO atualizar(@PathVariable Long id, @Valid @RequestBody VantagemRequestDTO dto) {
    return vantagemService.atualizar(id, dto);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deletar(@PathVariable Long id) {
    vantagemService.deletar(id);
  }
}
