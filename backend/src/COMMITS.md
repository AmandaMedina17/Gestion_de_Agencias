# 📝 Commits

Para los commits utilizaremos la convención: `<tipo>[ámbito (opcional)]: <descripción breve>`

## 🏷️ Tipos de Commits que Utilizamos

### **Cambios Relevantes**
- `feat` - Commits que agregan o remueven una nueva funcionalidad
- `fix` - Commits que solucionan un bug o error

### **Mejoras de Código**
- `refactor` - Commits que reescriben/reestructuran el código, sin cambiar el comportamiento de la API

### **Formato y Documentación**
- `style` - Commits que no afectan el significado (espacios, formato, puntos y coma faltantes, etc)
- `docs` - Commits que afectan únicamente a la documentación

### **Configuración y Build**
- `build` - Commits que afectan componentes de build como herramientas de construcción, pipeline de CI, dependencias, versión del proyecto, etc.

---

## 💡 Ejemplos de Uso

```bash
git commit -m "feat: agregar sistema de gestión de artistas"
git commit -m "fix: corregir error en validación de contratos"
git commit -m "docs: actualizar instrucciones de instalación"
git commit -m "refactor: optimizar consultas a la base de datos"
git commit -m "style: aplicar formato Prettier al código"
git commit -m "build: agregar scripts de migración a package.json"