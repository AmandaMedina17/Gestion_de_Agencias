# 📘 Guía de Migraciones 

## 🧩 Comando para Crear una Migración

Una vez que se modifica o crea una entidad dentro del proyecto (por ejemplo, en `src/entities`), y se agregan las configuraciones, se debe generar la migración para reflejar esos cambios en la base de datos.

```bash
npm run migration:generate -- ./src/migrations/NombreDeLaMigracion
```

📘 **Ejemplo:**
```bash
npm run migration:generate -- ./src/migrations/AddUserTable
```

👉 Este comando:
- Detecta los cambios realizados en las entidades.
- Crea un archivo de migración en la carpeta `src/migrations/`.
- Registra las operaciones necesarias para actualizar el esquema de la base de datos.

---

## ⚙️ Comando para Aplicar una Migración

Para aplicar las migraciones pendientes y actualizar la base de datos al estado más reciente:

```bash
npm run migration:run
```

👉 Este comando:
- Ejecuta todas las migraciones no aplicadas.
- Crea o modifica tablas, columnas y relaciones según lo definido en las entidades y migraciones.

📘 **Cuándo usarlo:**
- Al iniciar el proyecto por primera vez.
- Después de recibir nuevas migraciones mediante `git pull`.
- Cuando se desea sincronizar la base de datos con los cambios recientes del código.

---

## ⏪ Comando para Regresar a una Migración Específica

Si se desea regresar la base de datos a una migración anterior, se puede ejecutar manualmente el comando de actualización a esa migración específica.  
En TypeORM, este proceso puede hacerse revirtiendo migraciones paso a paso con:

```bash
npm run migration:revert
```

⚠️ Este comando **revierte la última migración aplicada**.  
Si se desea regresar a un punto anterior, se debe ejecutar el comando varias veces hasta alcanzar la migración deseada.

📘 **Ejemplo:**
```bash
npm run migration:revert
npm run migration:revert
```

Cada ejecución deshace una migración en orden inverso.

---

## 🔄 Comando para Mostrar el Estado de las Migraciones

Para ver qué migraciones están aplicadas y cuáles están pendientes, puede ejecutar:

```bash
npm run migration:show
```

👉 Este comando ayuda a verificar si la base de datos se encuentra actualizada con respecto al código.

---

## 🧭 Flujo Recomendado de Uso

1. Modificar o agregar entidades en `src/entities/`.
2. Generar una nueva migración:
   ```bash
   npm run migration:generate -- ./src/migrations/NombreDeLaMigracion
   ```
3. Verificar el contenido del archivo generado.
4. Aplicar las migraciones:
   ```bash
   npm run migration:run
   ```
5. Confirmar que los cambios se reflejan en la base de datos.
6. Si algo sale mal, revertir la última migración:
   ```bash
   npm run migration:revert
   ```

