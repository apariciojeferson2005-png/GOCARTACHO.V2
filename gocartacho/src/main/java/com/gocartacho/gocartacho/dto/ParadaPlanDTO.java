package com.gocartacho.gocartacho.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ParadaPlanDTO {

    @NotBlank(message = "El ID del comercio es obligatorio")
    private String comercioId;

    @NotBlank(message = "La recomendación o actividad es obligatoria")
    private String recomendacion;
}
