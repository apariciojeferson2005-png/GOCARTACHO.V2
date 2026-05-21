package com.gocartacho.gocartacho.security;

import com.gocartacho.gocartacho.model.Usuario;
import com.gocartacho.gocartacho.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 * Implementación personalizada de UserDetailsService de Spring Security.
 * Encargada de cargar los datos de autenticación del usuario desde MongoDB
 * utilizando su correo electrónico.
 */
@Service
@RequiredArgsConstructor
public class DetalleUsuarioServicio implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        // Buscamos al usuario por email o por username
        Usuario usuario = usuarioRepository.findByEmailOrUsername(identifier, identifier)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con el identificador: " + identifier));

        boolean enabled = usuario.getEstado() == null || usuario.getEstado() == com.gocartacho.gocartacho.model.EstadoUsuario.ACTIVO;

        String pwd = usuario.getContrasena() != null ? usuario.getContrasena() : "";
        String roleName = usuario.getRol() != null ? usuario.getRol().name() : "USER";

        return new org.springframework.security.core.userdetails.User(
                usuario.getEmail() != null ? usuario.getEmail() : usuario.getUsername(),
                pwd,
                enabled,
                true, // accountNonExpired
                true, // credentialsNonExpired
                true, // accountNonLocked
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + roleName))
        );
    }
}
