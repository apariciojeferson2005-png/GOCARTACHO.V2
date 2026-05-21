package com.gocartacho.gocartacho.config;

import org.bson.types.ObjectId;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;
import org.springframework.lang.NonNull;

import java.util.ArrayList;
import java.util.List;

/**
 * Configura el scan de repositorios MongoDB de forma segura.
 * Se añade un filtro para evitar que intente instanciar repositorios JPA (MySQL)
 * como si fueran de MongoDB, lo cual es una causa común de fallo al inicializar.
 */
@Configuration
@EnableMongoRepositories(
    basePackages = "com.gocartacho.gocartacho.repository",
    includeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = MongoRepository.class)
)
public class BaseDatosMongoConfig {

    @Bean
    public MongoCustomConversions customConversions() {
        List<Converter<?, ?>> converters = new ArrayList<>();
        converters.add(new StringToObjectIdConverter());
        converters.add(new ObjectIdToStringConverter());
        return new MongoCustomConversions(converters);
    }

    public static class StringToObjectIdConverter implements Converter<String, ObjectId> {
        @Override
        public ObjectId convert(@NonNull String source) {
            if (source.isBlank()) return null;
            return new ObjectId(source);
        }
    }

    public static class ObjectIdToStringConverter implements Converter<ObjectId, String> {
        @Override
        public String convert(@NonNull ObjectId source) {
            return source.toHexString();
        }
    }
}