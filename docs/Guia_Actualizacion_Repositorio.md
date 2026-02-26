# Guía de Actualización del Repositorio - Sprint 3

## Archivos a Agregar al Repositorio

### 📁 Frontend - Nuevos Componentes

**Ubicación:** `frontend/src/components/`

```
frontend/src/components/
├── ShareModal.jsx          ← AGREGAR
├── ShareButton.jsx         ← AGREGAR
```

**Ubicación:** `frontend/src/styles/`

```
frontend/src/styles/
├── ShareModal.css          ← AGREGAR
├── ShareButton.css         ← AGREGAR
├── ProductDetail.css       ← ACTUALIZAR (agregar estilos del top-bar)
```

**Ubicación:** `frontend/src/pages/`

```
frontend/src/pages/
├── ProductDetail.jsx       ← ACTUALIZAR (agregar imports y funcionalidad de compartir)
```

---

## Pasos para Actualizar el Repositorio

### 1. Copiar Archivos Nuevos

```bash
# Navegar a la carpeta del proyecto
cd frontend/src/components

# Copiar ShareModal.jsx y ShareButton.jsx aquí

cd ../styles

# Copiar ShareModal.css y ShareButton.css aquí
```

### 2. Actualizar ProductDetail.jsx

Reemplazar tu archivo actual con `ProductDetail_UPDATED.jsx` o aplicar estos cambios:

**a) Agregar imports al inicio:**
```javascript
import ShareButton from "../components/ShareButton";
import ShareModal from "../components/ShareModal";
```

**b) Agregar estado para el modal:**
```javascript
const [shareModalOpen, setShareModalOpen] = useState(false);
```

**c) Agregar función handler:**
```javascript
const handleShare = () => {
  setShareModalOpen(true);
};
```

**d) Actualizar el top-bar (reemplazar esta sección):**
```jsx
<div className="pd__top-bar">
  <Link to="/" className="pd__link-back">
    ← Volver al inicio
  </Link>
  {/* #27 - Botón compartir */}
  <ShareButton onClick={handleShare} />
</div>
```

**e) Agregar modal al final, antes del cierre de `</main>`:**
```jsx
{/* #27 - Modal de compartir */}
<ShareModal
  isOpen={shareModalOpen}
  onClose={() => setShareModalOpen(false)}
  product={product}
/>
```

### 3. Actualizar ProductDetail.css

Agregar al final del archivo:

```css
/* #27 - Estilos para top-bar con botón compartir */
.pd__top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.pd__link-back {
  color: #059669;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.pd__link-back:hover {
  color: #047857;
}

@media (max-width: 768px) {
  .pd__top-bar {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
}
```

---

## Comandos Git para Commitear

```bash
# 1. Navegar a la raíz del proyecto
cd /ruta/a/Desafio-profesional-DH

# 2. Ver estado actual
git status

# 3. Agregar nuevos archivos
git add frontend/src/components/ShareModal.jsx
git add frontend/src/components/ShareButton.jsx
git add frontend/src/styles/ShareModal.css
git add frontend/src/styles/ShareButton.css

# 4. Agregar archivos modificados
git add frontend/src/pages/ProductDetail.jsx
git add frontend/src/styles/ProductDetail.css

# 5. Commit con mensaje descriptivo
git commit -m "feat(sprint3): implementar compartir en redes sociales (#27)

- Agregar componente ShareModal con integración de Facebook, Twitter, WhatsApp y LinkedIn
- Agregar componente ShareButton
- Actualizar ProductDetail con funcionalidad de compartir
- Implementar copiar enlace al portapapeles
- Diseño responsive para todos los dispositivos"

# 6. Push a GitHub
git push origin main
```

---

## Commits Recomendados por Funcionalidad

Si prefieres commits separados por funcionalidad:

### Commit 1: Búsqueda (#22)
```bash
git add [archivos relacionados a búsqueda]
git commit -m "feat(sprint3): implementar búsqueda de productos (#22)

- Agregar campo de búsqueda con autocompletado
- Implementar calendario doble para rango de fechas
- Integrar endpoint /api/products/search
- Diseño responsive"
```

### Commit 2: Disponibilidad (#23)
```bash
git add [archivos de calendario]
git commit -m "feat(sprint3): visualizar disponibilidad en calendario (#23)

- Agregar componente BookingCalendar
- Destacar fechas disponibles y ocupadas
- Manejo de errores con mensajes claros"
```

### Commit 3: Favoritos (#24, #25)
```bash
git add [archivos de favoritos]
git commit -m "feat(sprint3): sistema de favoritos (#24, #25)

- Marcar/desmarcar productos como favoritos
- Lista de favoritos del usuario
- Sincronización con backend
- Persistencia en localStorage"
```

### Commit 4: Políticas (#26)
```bash
git add [archivos de políticas]
git commit -m "feat(sprint3): bloque de políticas del producto (#26)

- Agregar sección de políticas en ProductDetail
- 6 políticas: Cancelación, Puntualidad, Estado, Garantía, Pago, Seguridad
- Layout en columnas responsive"
```

### Commit 5: Compartir (#27)
```bash
git add frontend/src/components/ShareModal.jsx
git add frontend/src/components/ShareButton.jsx
git add frontend/src/styles/ShareModal.css
git add frontend/src/styles/ShareButton.css
git add frontend/src/pages/ProductDetail.jsx
git add frontend/src/styles/ProductDetail.css

git commit -m "feat(sprint3): compartir en redes sociales (#27)

- Agregar componente ShareModal con integración de redes
- Facebook, Twitter, WhatsApp, LinkedIn
- Mensaje personalizable
- Copiar enlace al portapapeles
- Diseño responsive con animaciones"
```

### Commit 6: Puntuaciones (#28)
```bash
git add [archivos de reseñas]
git commit -m "feat(sprint3): sistema de puntuaciones (#28)

- Sistema de 1-5 estrellas
- Formulario de reseñas para usuarios con reserva
- Puntuación media dinámica
- Visualización de todas las reseñas"
```

### Commit 7: Eliminar Categoría (#29)
```bash
git add [archivos admin]
git commit -m "feat(sprint3): eliminar categoría admin (#29)

- Modal de confirmación antes de eliminar
- Advertencia de productos afectados
- Eliminación en cascada
- Validación de permisos admin"
```

### Commit 8: Documentación
```bash
git add docs/Sprint3_Documentacion_Bitacora.md
git add docs/Sprint3_Plan_de_Testing.md
git add README.md

git commit -m "docs(sprint3): documentación completa del sprint

- Bitácora con daily scrums y retrospectiva
- Plan de testing con 40 casos de prueba (95% éxito)
- Actualizar README con nuevas funcionalidades"
```

---

## Verificación Post-Push

Después de hacer push, verifica en GitHub:

1. **Ir a tu repositorio:** https://github.com/EriCaceres/Desafio-profesional-DH

2. **Verificar commits:**
   - Deben aparecer todos los commits nuevos
   - Los mensajes deben ser claros

3. **Verificar archivos:**
   - Navegar a `frontend/src/components/`
   - Verificar que ShareModal.jsx y ShareButton.jsx estén presentes

4. **Verificar README:**
   - Actualizar README.md con las nuevas funcionalidades del Sprint 3

---

## Actualizar README.md

Agregar esta sección al README:

```markdown
### Sprint 3 (NUEVO)

#### Funcionalidades Implementadas:

**Alta Prioridad:**
- ✅ **#22: Búsqueda de productos** - Buscador con calendario de fechas y autocompletado
- ✅ **#23: Visualizar disponibilidad** - Calendario en detalle del producto

**Media Prioridad:**
- ✅ **#24: Marcar como favorito** - Botón de favorito en todas las cards
- ✅ **#25: Listar favoritos** - Página dedicada a productos favoritos
- ✅ **#26: Políticas del producto** - Bloque con 6 políticas detalladas

**Baja Prioridad:**
- ✅ **#27: Compartir en redes sociales** - Modal con Facebook, Twitter, WhatsApp, LinkedIn
- ✅ **#28: Puntuar producto** - Sistema de estrellas y reseñas
- ✅ **#29: Eliminar categoría** - Con confirmación y advertencias (Admin)

#### Nuevos Componentes:
- `ShareModal.jsx` - Modal de compartir en redes sociales
- `ShareButton.jsx` - Botón para abrir modal de compartir
- `BookingCalendar.jsx` - Calendario de disponibilidad

#### Nuevos Endpoints:
```
GET /api/products/search?query={term}
GET /api/products/{id}/availability
POST /api/favorites
GET /api/favorites
DELETE /api/favorites/{id}
```
```

---

## Checklist Final

Antes de considerar el Sprint 3 completado, verificar:

- [ ] Todos los archivos nuevos están en el repo
- [ ] Todos los archivos modificados están committeados
- [ ] README.md está actualizado
- [ ] Documentación (bitácora y testing) está en carpeta `/docs`
- [ ] No hay archivos grandes o innecesarios (.env, node_modules, etc.)
- [ ] El proyecto compila y corre sin errores
- [ ] Todas las user stories están funcionando

---

## Notas Importantes

⚠️ **ANTES DE HACER PUSH:**
- Verificar que no subas archivos sensibles (.env con keys, credenciales)
- Asegurarte que el .gitignore esté actualizado
- Probar localmente que todo funciona

⚠️ **DESPUÉS DE HACER PUSH:**
- Clonar el repo en otra carpeta para verificar que todo se subió
- Ejecutar `npm install` y `npm run dev` para verificar
- Revisar en GitHub que todos los archivos sean visibles

---

**Preparado por:** Erika Cáceres  
**Fecha:** Febrero 2026  
**Sprint:** 3
