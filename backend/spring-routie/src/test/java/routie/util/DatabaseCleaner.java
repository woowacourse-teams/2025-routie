package routie.util;

import jakarta.annotation.PostConstruct;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Table;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class DatabaseCleaner {

    @PersistenceContext
    private EntityManager entityManager;

    private List<String> tableNames;

    @PostConstruct
    private void init() {
        this.tableNames = entityManager.getMetamodel().getEntities().stream()
                .filter(e -> e.getJavaType().getAnnotation(Entity.class) != null)
                .map(e -> {
                    Table tableAnnotation = e.getJavaType().getAnnotation(Table.class);
                    if (tableAnnotation != null && tableAnnotation.name() != null) {
                        return tableAnnotation.name();
                    }
                    return convertCamelToSnake(e.getName());
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void execute() {
        entityManager.flush();
        entityManager.createNativeQuery("SET REFERENTIAL_INTEGRITY FALSE").executeUpdate();

        for (String tableName : tableNames) {
            entityManager.createNativeQuery("TRUNCATE TABLE " + tableName).executeUpdate();
        }

        entityManager.createNativeQuery("SET REFERENTIAL_INTEGRITY TRUE").executeUpdate();
    }

    private String convertCamelToSnake(String camelCase) {
        if (camelCase == null) {
            return null;
        }
        StringBuilder snakeCase = new StringBuilder();
        snakeCase.append(Character.toLowerCase(camelCase.charAt(0)));

        for (int i = 1; i < camelCase.length(); i++) {
            char c = camelCase.charAt(i);
            if (Character.isUpperCase(c)) {
                snakeCase.append('_');
                snakeCase.append(Character.toLowerCase(c));
            } else {
                snakeCase.append(c);
            }
        }
        return snakeCase.toString();
    }
}
