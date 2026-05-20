package com.gocartacho.gocartacho.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import java.util.List;

@Data
public class CrearPlanDTO {

    @NotBlank(message = "El nombre del plan es obligatorio")
    private String nombrePlan;

    @NotBlank(message = "La descripción del plan es obligatoria")
    private String descripcion;

    @NotEmpty(message = "El plan debe contener al menos una parada")
    private List<ParadaPlanDTO> paradas;
}
