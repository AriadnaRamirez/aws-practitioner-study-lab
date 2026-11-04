# Copys de AWS Study Lab

Todo el texto que ve quien usa AWS Study Lab: pantallas, cartas y preguntas de examen. Las pistas del crucigrama salen de la definición de cada carta; el juego además muestra 4 letras de pista.

## Cómo leerlo

- La historia va en español. Cuando un nombre es el del examen, va en inglés y la pieza lo dice.
- `{…}` marca un número, un nombre o una fecha que cambia. Los textos de las pantallas van agrupados por archivo, y la ruta en `código` dice cuál es.
- Los errores siguen una sola fórmula: «No pudimos [lo que intentabas]. Inténtalo de nuevo.»
- Hay 356 cartas y 208 preguntas, cada una con 4 opciones y una sola correcta.

## Contenido

1. Pantallas: Entrada, Navegación, Inicio, Bienvenida, Estudiar, Examen, Minijuegos, Guías, Cuenta, Admin y Otras
2. Cartas, por tema
3. Preguntas de examen, por tema

---

## Pantallas

Cada bloque es un archivo; debajo van sus textos.

### Entrada

**`app/guest/page.tsx`**

- Probar sin cuenta
- Pruébalo sin registro. Crea una cuenta para guardar tu progreso.

**`app/login/layout.tsx`**

- Entrar

**`app/login/page.tsx`**

- {…}Entra de nuevo para seguir.
- {…}Entra y te regresamos a {…}.
- {…}Entra y te regresamos a donde estabas.
- AWS Study Lab
- Contraseña
- Correo o usuario
- Crear cuenta
- Estudia para tu certificación AWS, carta por carta.
- Hola de nuevo. Tus cartas te esperan.
- No pudimos entrar. Inténtalo de nuevo.
- Ocultar contraseña
- Partidas cortas, repaso de lo que más fallas y un podio para motivarte.
- Preparando el inicio de sesión…
- Tu sesión expiró y tu progreso está a salvo.
- Ver contraseña

**`app/logout/page.tsx`**

- Cerrando sesión… ¡hasta pronto!

**`app/register/page.tsx`**

- ¿Ya tienes cuenta?{…}
- Al menos {…} caracteres
- Así te verán en el podio. Sin espacios ni acentos, por ejemplo: lucia_perez.
- Confirmar contraseña
- Correo
- Crea tu cuenta y guarda tu progreso.
- Escribe un correo válido, por ejemplo nombre@correo.com.
- Ir a Inicio
- Las contraseñas no coinciden.
- No pudimos crear tu cuenta. Inténtalo de nuevo.
- Nombre de usuario
- Registrarme
- Sin espacios, acentos ni ñ: solo letras, números y guion bajo (_).
- Tu contraseña aún no cumple los requisitos de la lista.
- Tus rachas, conceptos dominados y lugar en el podio te esperan.
- Un número
- Un símbolo (recomendado)
- Una mayúscula
- Una minúscula
- Usa entre {…} y {…} caracteres.

**`components/guest/guest-trial.tsx`**

- ¡Listo!
- ¡Muy bien! Ya tienes buena base
- ¡Perfecto! Vas listo para más
- ¿Qué servicio o concepto es?
- ¿Te está gustando?
- {…} cartas como las del examen
- {…} Con tu cuenta guardas tu avance, y lo que te cuesta vuelve a salir hasta que lo domines.
- {…} de {…} correctas
- Buen comienzo: aquí equivocarse también enseña
- Crea tu cuenta para guardar este avance y seguir con {…}.
- Crea tu cuenta y sigue estudiando {…}, sin límite.
- Cuenta
- Empezar la prueba
- Esta prueba ya es una cuenta. Entra para seguir estudiando.
- Explicación al instante en cada respuesta
- La correcta es «{…}». {…}
- La respuesta es «{…}».
- los {…} conceptos del examen
- No pudimos abrir la prueba
- No pudimos guardar tu prueba. Inténtalo de nuevo.
- No pudimos iniciar la prueba. Inténtalo de nuevo.
- o crea tu cuenta
- Plan diario hacia la fecha de tu examen
- Preparando tu prueba…
- Progreso de la prueba
- Prueba
- Pruébalo en 2 minutos
- queda 1
- Quedan {…} {…}
- Racha, progreso por tema y podio
- Repaso automático de lo que más fallas
- Responde {…} preguntas del examen AWS Certified Cloud Practitioner y mira cómo se estudia aquí.
- Siguiente
- Sin registro
- Te {…} {…} de{…} {…} pruebas.
- todos los conceptos del examen
- Ver mi resultado
- Ya usaste tus {…} pruebas

**`components/marketing/landing-hero.tsx`**

- Cada respuesta te explica el porqué
- Lo que fallas vuelve a salir hasta que lo domines
- Partidas cortas de cartas con los conceptos del examen
- Prepárate para la certificación AWS Cloud Practitioner
- Sesión cerrada
- Tu cuenta se eliminó. ¡Gracias por estudiar con nosotros!

### Navegación

**`components/shell/app-nav.tsx`**

- {…}% dominado, {…} de {…} conceptos. Ver tu progreso
- Admin
- AWS Study Lab
- Cerrar
- Cerrar menú
- Crear cuenta
- Cuenta
- de racha
- día
- días
- Entrar
- Estudiar
- Examen
- Guías
- Inicio
- Menú
- Minijuegos
- Móvil
- Principal
- Probar
- Racha: {…} {…} estudiando
- Salir
- Saltar al contenido

**`components/shell/breadcrumbs.tsx`**

- Administración
- Banco de examen
- Banderas de función
- Cartas
- Crucigrama
- Guía
- Historial
- Importar / exportar
- Invitados
- Migas de pan
- Página
- Podio
- Sesión
- Temas
- Usuarios

**`components/shell/podium-trophy.tsx`**

- ¿Quién va ganando? Domina conceptos y sube de lugar.
- {…} conceptos dominados
- 1 concepto dominado
- Aún nadie domina conceptos. ¡Sé la primera persona en el podio!
- Cargando el podio…
- El podio no está disponible por ahora.
- Ir a Cuenta
- Jugar para mantenerte arriba
- Jugar para subir
- Libre
- Lugar {…}:
- Medalla de {…}
- No pudimos cargar el podio. Inténtalo de nuevo.
- Oculto
- Top 3
- Tú
- Tu lugar

**`components/shell/require-auth.tsx`**

- Comprobando tu sesión…
- Te llevamos a iniciar sesión…

**`components/shell/site-credits.tsx`**

- Ariadna Ramírez
- Autora ·{…}
- Créditos y aviso
- Generation México
- Material no oficial. No afiliado a AWS ni a Generation México.

**`components/ui/button.tsx`**

- & VariantProps
- Button

**`components/ui/dialog.tsx`**

- Escape
- Tab
- void, panelRef: React.RefObject

**`components/ui/input.tsx`**

- Input

**`components/ui/spinner.tsx`**

- Cargando

### Inicio

**`app/(app)/dashboard/page.tsx`**

- Inicio

**`components/dashboard/dashboard-client.tsx`**

- Así vas con tu certificación.
- Cargando tu inicio…
- Continuar
- Sesión inválida

**`components/dashboard/dashboard-hero.tsx`**

- {…} {…}, el {…}. Cambiar fecha
- Agenda tu examen
- Ari
- Cambiar fecha
- Cargando tu examen
- Elegir fecha
- Falta 1 día
- Faltan {…} días
- Hola, {…}.
- Hoy es tu examen
- No pudimos cargar tu examen.{…}
- No pudimos guardar la fecha. Inténtalo de nuevo.
- para tu examen {…}
- Reintentar
- tú
- Tu examen ya pasó

**`components/dashboard/minigames-widget.tsx`**

- {…} min · {…}
- Minijuegos
- Ver los crucigramas

**`components/dashboard/weak-topics-widget.tsx`**

- Aún no hay temas para mostrar.
- Aún no sabemos cuáles son. Después de tu primera partida verás aquí los temas que más te cuestan.
- Cargando tus temas más débiles…
- Dominas todos los temas. ¡Excelente trabajo!
- Dominio de {…}
- Practicar
- Practicar {…}
- Tus temas más débiles
- Ver tu progreso por tema

### Bienvenida

**`components/onboarding/onboarding-tour.tsx`**

- [data-tour="{…}"]
- Ahora no
- Anterior
- Cerrar recorrido
- Enter
- Lo encuentras en el Menú.
- Paso {…} de {…}
- Saltar
- Siguiente
- Terminar

**`components/onboarding/steps.ts`**

- ¡Hola! Te enseño la app
- ¡Listo! Empieza
- Cada carta tiene 4 opciones. Si fallas, vuelve a salir. Con 3 aciertos seguidos, ya la dominas.
- Cuántos días faltan
- El menú
- Estudiar: cartas y las que más se te dificultan. Examen: contra el reloj. Guías: léelas o bájalas en PDF. Minijuegos: crucigramas.
- Estudias con cartas
- Jugar mi primera partida
- Si ya tienes fecha de examen, ponla aquí. Arriba verás los días que faltan.
- Son unos segundos. Puedes saltarlo y verlo otra vez desde Cuenta.
- Tu avance, arriba
- Tu primera partida son 10 cartas de todos los temas. Aprendes con cada respuesta.
- Ves cuánto dominas, tu racha de días y el podio. Tócalos para ver más.

### Estudiar

**`app/(app)/estudiar/page.tsx`**

- Estudiar

**`components/mas-falladas/mas-falladas-client.tsx`**

- ¡Listo!
- ¿Cuál es?
- ¿Qué es?
- Aciertos
- Así se define.
- Carta nueva
- Elige el nombre
- Enviando respuesta
- No pudimos guardar tu respuesta. Inténtalo de nuevo.
- La correcta es «{…}».
- No pudimos empezar el repaso. Inténtalo de nuevo.
- No pudimos cargar tu lista. Inténtalo de nuevo.
- Otra vez: la fallaste hace un momento
- Partida de {…} cartas terminada
- Partida de cartas
- Partida terminada
- Precisión
- Progreso de la ronda
- Quedan {…} {…}
- Racha {…}
- Refuerzo
- Refuerzo listo
- Ronda de refuerzo · Más falladas
- Siguiente
- Ver resultado
- Volver a la lista

**`components/mas-falladas/weak-insights-panel.tsx`**

- Casi dominadas
- Fallada {…}
- Falladas esta semana
- La confundes
- La más resistente
- Pistas sobre tus fallos
- Practicar tema
- Recupérala
- Recupéralas
- Remátala
- Remátalas
- Se te olvidaron
- Tema más difícil
- Ver carta

**`components/mas-falladas/weak-insights.ts`**

- {…} y {…} más
- carta-{…}-{…}
- hace {…} días

**`components/mas-falladas/weak-item-card.tsx`**

- {…} de {…} aciertos seguidos para dominarla
- Dominada
- Explicación
- Recuerda
- Respuesta correcta
- Se te olvidó
- Último fallo:
- Último fallo: {…}
- Ya la dominas

**`components/mas-falladas/weak-list-view.tsx`**

- ¡No tienes cartas falladas!
- {…} de {…} seguidas
- {…} en total.
- {…} por dominar + {…} que ya dominas, para que no se te olvide.
- {…} por dominar, primero las que más fallas.
- Aquí están las cartas que se te dificultan. Con {…} aciertos seguidos, ya la dominas.
- Aquí llegarán las que domines.
- Aún no hay fallos que repasar
- Camino a dominarlas
- Cargando tus cartas más falladas…
- carta fallada
- cartas falladas
- Cuando una carta se te resista, aparecerá aquí con lo que debes recordar.
- Dominadas
- Empezar refuerzo
- Entra para ver las cartas que más se te dificultan.
- Entrar
- Ir a estudiar
- Juega tu primera partida: las cartas que falles aparecerán aquí para repasarlas.
- Jugar mi primera partida
- Jugar una partida
- Las dominas todas
- Ninguna aquí ahora.
- No pudimos cargar tu lista. Inténtalo de nuevo.
- Preparando el refuerzo
- Recién falladas
- Reintentar
- Ronda de refuerzo
- Si fallas una, vuelve a salir. Puedes salir cuando quieras.
- Sigue con partidas nuevas: lo que falles llegará aquí.
- Toca una carta para ver la respuesta y la explicación.
- Todo al día
- Van bien
- Ver {…} más
- Ver menos

**`components/study/answer-feedback.tsx`**

- ¡Correcto!
- ¡Ya la dominas!
- {…} de {…} aciertos seguidos para dominarlo
- Aún no
- Bien
- Correcto. Ya la dominas.
- Incorrecto
- Incorrecto. La correcta es {…}. {…}
- Queda en tu lista de Más falladas para repasarla.
- seguidos para dominarlo
- Te la volvemos a preguntar en un momento.

**`components/study/customize-session-dialog.tsx`**

- {…} {…} · se eligen {…} al azar.
- Cartas disponibles
- Elegir temas
- Elegir todos
- Elige al menos un tema.
- Elige qué temas entran en tu partida.
- Listo
- Menos de {…}: la partida tendrá solo {…} {…}.
- Quitar todos

**`components/study/estudiar-mode-tabs.tsx`**

- Abriendo el examen…
- Cartas
- Más falladas
- Modo de estudio

**`components/study/flash-deck.tsx`**

- Carta

**`components/study/flash-study-client.tsx`**

- Cargando la siguiente carta…
- Crear cuenta
- Enter
- Entra para estudiar. Si ya estabas dentro, vuelve a entrar.
- Los temas de ese enlace ya no existen. Elige tus temas aquí abajo.
- No pudimos retomar tu partida. Empieza una nueva.
- No pudimos empezar la partida. Inténtalo de nuevo.
- No pudimos guardar tu respuesta. Inténtalo de nuevo.
- Otra partida
- Partida rápida
- Preparando tu partida…
- Progreso de la partida
- Retomando tu partida…
- Siguiente carta…

**`components/study/new-game-card.tsx`**

- {…} al azar{…} {…}
- Continuar partida
- Cuántas cartas
- de todos los conceptos
- de todos los servicios de AWS
- de todos los temas
- Elige qué temas entran en tu partida
- Iniciar partida
- Iniciar partida rápida
- módulo
- módulos
- Nueva partida
- Tienes una partida en curso:{…} {…} ·{…} {…}/{…}
- tipo de servicio
- tipos de servicio
- Todos los temas

**`components/study/session-builder/builder-model.ts`**

- Lo que menos domino
- Solo conceptos
- Solo servicios
- Todo

**`components/study/session-builder/distribution-picker.tsx`**

- Al azar
- La misma cantidad de cada tema.
- Parejo
- Salen más los temas con más cartas.

**`components/study/session-builder/session-builder.tsx`**

- al azar
- Arma tu partida
- Así quedará tu partida
- Atajos de selección
- Cómo se reparten
- Elige al menos un tema
- Elige al menos un tema para empezar.
- Elige cuántas cartas, cómo se reparten y los temas.
- Guardamos esta elección para la próxima.
- Los {…} temas que menos dominas.
- Ningún tema elegido
- Paso {…}:
- Pediste {…}, pero tu selección solo tiene {…}.
- Qué temas entran
- Resumen de tu partida
- Sin temas
- Tu selección tiene {…}, así que la partida será de {…}.

**`components/study/session-builder/topic-option.tsx`**

- {…} de AWS

**`components/study/session-summary.tsx`**

- ¡Muy bien!
- ¡Partida impecable!
- {…}{…} {…} en total
- a la primera
- Acertaste{…}
- Aciertos a la primera
- Así te fue
- Aún sin lugar en el podio. Entras al dominar tu primer concepto: acértalo {…} veces seguidas.
- Buen avance
- Calculando tu lugar…
- concepto dominado
- conceptos dominados
- día
- días
- Dominas una carta con {…} aciertos seguidos, aunque sea en partidas distintas. Cada carta dominada suma un punto en el podio.
- La que fallaste queda en Más falladas.
- Las {…} que fallaste quedan en Más falladas.
- llegan con {…} seguidas
- Mejor racha
- No pudimos cargar el podio. Inténtalo de nuevo.
- Nuevo dominado
- Nuevos dominados
- Racha diaria
- Respondiste {…}{…} {…}, en {…}{…} {…}.
- Respuestas correctas
- Sigue practicando: de los errores se aprende
- Te quedas en el resumen. Vuelve al inicio cuando quieras.
- Tu perfil está oculto del podio · {…}{…} {…}
- Tu posición en el podio
- Volverás al inicio en {…} segundos.
- Volviendo al inicio en {…} s
- y corregiste {…} al volver a intentar

**`components/study/study-skeletons.tsx`**

- Cargando tus temas…

### Examen

**`app/(app)/examen/page.tsx`**

- Examen

**`components/exam/exam-modes-gate.tsx`**

- El examen todavía no está listo. Mientras, practica con las cartas.
- Ir a Estudiar
- Preparando el examen…

**`components/exam/exam-runner.tsx`**

- {…} preguntas · {…}
- 65 preguntas y 90 minutos, como el examen real. También hay tandas más cortas.
- Cuántas preguntas
- Empezar examen
- Entrar
- Enviando examen…
- Enviar examen
- Examen completo · {…} preguntas · {…}
- Ir a pregunta {…}{…}
- Mapa de preguntas
- Marcada para revisar
- Marcar para revisar
- No pudimos empezar el examen. Inténtalo de nuevo.
- No pudimos enviar tu examen. Inténtalo de nuevo.
- No pudimos guardar tu respuesta. Inténtalo de nuevo.
- No pudimos marcar esta pregunta. Inténtalo de nuevo.
- Pregunta {…} de {…} {…} {…} respondidas
- Preparando tu examen…

**`components/exam/exam-summary.tsx`**

- ¡Muy bien! Todas correctas.
- · {…} sin responder
- · correcta
- · tiempo agotado
- · tu respuesta
- {…} h {…} min
- {…} min {…} s
- Fallos y sin responder
- No respondiste esta pregunta.
- Nuevo examen
- Pregunta {…}
- Resultado
- Sin fallos
- Tiempo usado: {…} de{…} {…}

**`components/exam/exam-timer.tsx`**

- Tiempo restante {…}

### Minijuegos

**`app/(app)/minijuegos/crucigrama/page.tsx`**

- Crucigrama · Minijuegos

**`app/(app)/minijuegos/page.tsx`**

- Minijuegos

**`components/minigames/crucigrama-game.tsx`**

- ¡Bien! {…} de {…} palabras.
- ¡Crucigrama completo!
- ¡Lo resolviste solo!
- ¡Perfecto, sin errores!
- · revelada
- {…} · {…} palabras
- {…} {…}, letra {…} de {…}
- {…} {…}, letra {…}: {…}, ya correcta
- {…} letras de pista. Las que aciertas se quedan fijas
- {…} letras no encajan: están marcadas en rojo.
- 1 ayuda
- 1 error
- Crucigrama
- Escribe el nombre, en inglés si así se llama. Sin acentos. Hay 4 letras de pista, y el guion de las dos palabras ya está.
- Guion entre palabras, {…} {…}
- Hasta aquí todo encaja: sigue.
- Horizontal
- Horizontales
- Letra dada, {…} {…}, letra {…}: {…}
- No pudimos armar un crucigrama con este tema. Prueba con otro.
- Ocultar las pistas
- Palabra anterior
- Palabra siguiente
- Repasa las palabras
- Resuelta
- Revelada
- Revelada: {…}.
- Revelar
- Revisar
- Revisar marca en rojo lo que está mal. No te muestra la respuesta.
- Te damos la letra {…}.
- Todavía no has escrito nada en esta palabra.
- Todo encaja.
- Una letra
- Una letra no encaja: está marcada en rojo.
- Ver las {…} pistas
- Vertical
- Verticales

**`components/minigames/game-ui.tsx`**

- {…} min {…} s
- Cambiar tema
- Completado
- Hazlo sin errores para completarlo.
- Jugado
- Jugar otra vez
- No pudimos cargar las cartas
- Preparando el juego…
- Reintentar
- Sin errores. Quedó completado.

**`lib/minigames/categories.ts`**

- Conceptos
- Servicios

**`lib/minigames/crucigrama.ts`**

- {…}, {…} palabras
- {…}, dos palabras
- 1 letra
- casi sin perder datos y volviendo al instante
- pierdes pocos minutos de datos y vuelves en minutos
- puedes perder días de datos y tardar días en volver
- puedes perder horas de datos y tardar horas en volver

**`lib/minigames/index.ts`**

- 8 palabras
- Cualquier tema
- La pista dice qué es. Escribe el nombre. Si son dos palabras, el guion ya está.

### Guías

**`app/(app)/guias/[id]/page.tsx`**

- Guía: {…}

**`app/(app)/guias/page.tsx`**

- Guías

**`components/guides/guide-document-client.tsx`**

- Acciones de la guía
- AWS Study Lab
- Cargando la guía…
- Descargar PDF
- El nombre va a la izquierda. A la derecha, qué es y, cuando aporta algo, para qué sirve. Los nombres son los de la documentación de AWS y el contenido sigue la guía del examen Cloud Practitioner (CLF-C02), versión 1.3 del 29 de octubre de 2026.
- No pudimos cargar la guía. Inténtalo de nuevo.
- Generada el {…}
- Temas
- Temas de la guía
- Todavía no hay conceptos publicados en este tema.
- Volver a Guías

**`components/guides/guides-index-client.tsx`**

- Cargando tus guías…
- Conceptos
- Descargar PDF: {…}
- Léelas para entender el tema o para repasar antes del examen.
- No pudimos cargar las guías. Inténtalo de nuevo.
- Ver guía
- Ver guía: {…}
- Ver guía: {…}, {…}

### Cuenta

**`app/(app)/cuenta/historial/[id]/page.tsx`**

- Detalle de sesión

**`app/(app)/cuenta/page.tsx`**

- Cuenta

**`components/cuenta/cuenta-client.tsx`**

- Cargando tu cuenta…
- Cargando tu historial…
- Historial
- Historial de partidas
- Mi cuenta
- No pudimos cargar tu historial. Inténtalo de nuevo.
- No pudimos cargar tu cuenta. Inténtalo de nuevo.
- Progreso
- Secciones de la cuenta
- Tu primera partida. Tócala para ver cada respuesta.
- Tus partidas aparecerán aquí.
- Tus últimas {…} partidas. Toca una para ver cada respuesta.
- Ver recorrido guiado

**`components/cuenta/exam-card.tsx`**

- ¡Es hoy!
- ¡Mañana!
- {…} días
- Agéndala y verás la cuenta regresiva aquí y en Inicio, con un ritmo sugerido de conceptos por día.
- Agendar fecha
- Aún no tienes fecha
- Cambia la fecha si vas a presentarlo otra vez.
- Cambiar fecha
- Cargando tu examen
- Especialidad
- Menos de una semana. ¡Último empujón!
- Nivel asociado
- Nivel fundamental
- Nivel profesional
- No pudimos cargar tu examen. Inténtalo de nuevo.
- No pudimos guardar la fecha. Inténtalo de nuevo.
- Respira hondo. ¡Mucha suerte!
- Te faltan {…} por dominar: unos {…} al día hasta tu examen.
- Un repaso ligero y a descansar.
- Ya dominas todos los conceptos. Sigue repasando para llegar fresco al examen.
- Ya pasó

**`components/cuenta/history-detail-client.tsx`**

- {…} · {…} cartas · aciertos {…} · {…}
- Cargando el detalle de tu partida…
- Correcto
- Entra para ver cómo te fue.
- Entrar
- Esta partida no tiene respuestas. La dejaste a medias o sigue en curso.
- Incorrecto
- No pudimos abrir esta partida
- No pudimos cargar esta partida. Inténtalo de nuevo.
- Partida
- Tu respuesta:{…}
- Volver al historial

**`components/cuenta/profile-card.tsx`**

- Administración
- Aparecer en el podio
- Cambiar
- Cambiar usuario
- Cancelar
- Correo
- De {…} a {…} caracteres: letras, números y _. Así te verán en el podio.
- Estás oculto: nadie ve tu usuario en el podio.
- Estudias aquí desde
- Guardar usuario
- Listo. Ahora entras con @{…} o tu correo.
- Máximo {…} caracteres.
- Mínimo {…} caracteres.
- No pudimos cambiar tu usuario. Inténtalo de nuevo.
- No pudimos guardar tu preferencia. Inténtalo de nuevo.
- Nuevo usuario
- Otros estudiantes ven tu usuario y cuántos conceptos dominas.
- Rol
- Se detecta de tu dispositivo
- Solo letras, números y _.
- Usuario
- Zona horaria

**`components/cuenta/progress-client.tsx`**

- Cargando tu progreso por tema…
- Cuántos conceptos dominas de cada tema.
- Dominas {…} de {…} conceptos ({…}%). Un concepto queda dominado al acertar su carta 3 veces seguidas.
- No pudimos cargar tu progreso. Inténtalo de nuevo.
- Otros temas
- Progreso por tema
- Todavía no hay temas con contenido publicado.

**`components/cuenta/security-card.tsx`**

- Cambiar contraseña
- Confirmar nueva
- Contraseña actual
- Las contraseñas no coinciden.
- Mínimo {…} caracteres, con mayúscula, minúscula y número.
- No pudimos cambiar tu contraseña. Inténtalo de nuevo.
- Nueva contraseña

**`components/cuenta/session-card.tsx`**

- Cerrar sesión
- Eliminar cuenta
- Eliminar mi cuenta
- Eliminar para siempre
- Escribe tu contraseña para confirmar
- No pudimos eliminar tu cuenta. Inténtalo de nuevo.
- Se borran para siempre tu progreso, historial, racha, fecha de examen y tu lugar en el podio. No se puede deshacer.
- Tu progreso queda guardado para la próxima vez.

**`components/cuenta/session-history.tsx`**

- · {…} cartas
- Aciertos{…}
- Aún no has estudiado.
- Más falladas
- Racha máx.{…}
- Tiempo{…}

### Admin

**`app/admin/banco/page.tsx`**

- ("/admin/topics"), adminGet
- Banco de preguntas
- Preguntas de examen de opción múltiple con cuatro opciones. Las del track AIF dependen de su bandera de función.

**`app/admin/flags/page.tsx`**

- Activa o desactiva partes de la app sin desplegar. Ambas banderas vienen apagadas por defecto.
- Banderas de función

**`app/admin/flash/page.tsx`**

- Cartas flash
- Conceptos con definición, explicación y distractores. Solo las publicadas entran en las sesiones de estudio.

**`app/admin/guests/page.tsx`**

- {…} sesiones en total
- Aún no hay invitados, o la API no responde.
- Convertido
- Convertidos
- Cuenta creada
- Estado
- Invitado
- Invitados
- Por invitado
- Primera visita
- Pruebas sin cuenta desde la landing: sesiones usadas y conversión a registro.
- Sesiones
- Sesiones promedio
- Sin cuenta
- Tasa de conversión

**`app/admin/import/import-panel.tsx`**

- {…} importaciones reales
- Acción
- Actualizados
- Actualizar
- Archivo
- Carta
- Completado
- Contenido a importar
- Contenido pegado
- Creados
- Crear
- Descarga temas, cartas y preguntas actuales.
- El trabajo no devolvió filas.
- Elegir archivo
- Error
- Error al exportar
- Error al importar
- Errores
- Exportar
- Fallido
- Fecha
- Formato
- Historial
- Importar
- Mensaje
- Omitidos
- Omitir
- Pega el contenido o elige un archivo. El formato se detecta al cargarlo.
- Pregunta
- Registros actualizados
- Registros creados
- Resultado de la importación
- Resultado de la simulación
- Simulación
- Sin trabajos todavía.
- Tema
- Tipo
- Trabajos
- Trabajos de importación recientes, incluidas las simulaciones.
- Trabajos fallidos

**`app/admin/import/page.tsx`**

- Contenido en CSV o JSON con upsert por
- Importar / exportar

**`app/admin/layout.tsx`**

- %s · Admin
- Administración
- No se pudo verificar tu sesión de administración. Revisa que la API esté arriba e inténtalo de nuevo.
- Volver al Lab

**`app/admin/loading.tsx`**

- Cargando el panel de administración…

**`app/admin/page.tsx`**

- {…} de {…} invitados crearon cuenta
- % de fallo
- Abandonada
- Aciertos
- Actividad de estudiantes en los últimos {…} días, en hora de Ciudad de México. Las cuentas de administración no cuentan.
- Actividad reciente
- Activos hoy
- Actualizado a las {…}
- Aún no hay suficientes intentos.
- Carta o pregunta
- Cartas y preguntas de examen, últimos 30 días, con al menos 3 intentos. Buenos candidatos para revisar el contenido.
- Con racha viva
- Conceptos dominados · 7 días
- Conversión de invitados
- Cuántos avanzan en cada paso.
- Dominaron al menos un concepto
- Empezaron a estudiar
- En curso
- Estudiante
- Estudiantes
- Estudiantes activos
- Estudiantes activos · 7 días
- Fallos
- hace {…} h
- hace {…} min
- Inicio
- Intentos
- Lo más fallado
- Modo
- No se pudieron cargar las métricas. Revisa que la API esté arriba y que tu sesión de administración siga vigente.
- Nuevos registros · 7 días
- Partidas
- Partidas · 7 días
- Partidas terminadas · 7 días
- Partidas y estudiantes activos
- Por día. Pasa el cursor sobre una barra para ver el detalle.
- Precisión
- Precisión · 7 días
- Registrados
- Respuestas
- Respuestas · 7 días
- Respuestas por día y porcentaje de aciertos.
- Respuestas y precisión
- Resumen
- sin cambio
- Sin datos de la semana previa
- Suspendidos
- Terminada
- Todavía no hay partidas.
- Últimas partidas de estudiantes.
- Ver usuarios
- vs. 7 días previos

**`app/admin/podio/page.tsx`**

- {…} para ver el podio completo.
- Cargando el ranking del podio…
- Conceptos dominados
- Dominados
- Dominios de los últimos 7 días.
- Entra como admin
- Esta semana
- Histórico
- Jugadores en ranking
- Líder
- Lugar
- No pudimos cargar el podio. Inténtalo de nuevo.
- Podio
- Promedio por jugador
- Respecto al líder
- Suma de todo el ranking
- Todavía no hay conceptos dominados en esta ventana.
- Todos los conceptos dominados.
- Usuario
- Ventana del podio

**`app/admin/temas/page.tsx`**

- Taxonomía de los tracks CLF y AIF. Cada tema agrupa cartas flash y preguntas del banco.
- Temas

**`app/admin/usuarios/page.tsx`**

- Actividad de estudio por cuenta, suspensiones, visibilidad en el podio y restablecimiento de contraseñas.
- Usuarios

**`components/admin/admin-metrics.tsx`**

- Archivada
- Borrador
- hace {…} días
- hace 1 día
- hace un momento
- Nunca
- Publicada

**`components/admin/admin-nav.tsx`**

- Admin
- Banco de examen
- Cartas
- Contenido
- Lab
- Métricas
- Panel de administración
- Salir
- Sistema

**`components/admin/flags-panel.tsx`**

- Activa
- Activas
- Apagada
- Apagadas
- Apagado = el menú no muestra Examen y la API rechaza esas sesiones. Estudiar sigue con Cartas y Más falladas.
- Bandera de función
- Cargando las banderas de funciones…
- Cuando está apagado, los listados públicos ocultan temas, flash y banco con trackId=AIF.
- Error al cargar
- Examen
- Modificado por
- No hay banderas. Ejecuta
- No pudimos guardar. Inténtalo de nuevo.
- npm run db:migrate
- npm run db:seed
- Track AWS + IA (AIF)
- Último cambio

**`components/admin/knowledge-crud.tsx`**

- ¿Borrar esta carta flash?
- Acciones
- Concepto
- Crear carta
- Definición
- Distractores (separados por coma)
- Error al actualizar
- Error al borrar
- Error al crear
- Explicación
- Filtrar cartas
- Filtrar por nombre o definición…
- Mostrando {…} de {…}
- Ninguna carta coincide con el filtro.
- Nombre
- Nueva carta
- Pasar a borrador
- Publicadas
- Publicar
- Se usan las tres variantes de pregunta.
- Todavía no hay cartas.
- Track AIF

**`components/admin/overview-panels.tsx`**

- {…} sin errores al menos una vez
- Apagado
- Aprobados
- AWS Certified
- Banco
- Borradores
- Calificación promedio
- Cartas publicadas
- Dominios acumulados
- El modo Examen está apagado, así que todavía no hay simulacros.
- en {…} días
- Estudiantes que han terminado cada juego. No cuentan para el progreso ni el podio.
- Estudiantes que ya agendaron su certificación.
- Estudio y Examen están ocultos para los estudiantes.{…}
- Fechas de examen
- Lo publicado es lo que ven los estudiantes.
- mañana
- Minijuegos
- Modo Examen, últimos {…} días. Aprobado: {…}% o más, como el 700/1000 del examen real.
- Modos de estudio
- Nadie ha hecho un simulacro en este periodo.
- Nadie lo ha hecho sin errores.
- Nadie tiene un examen por delante.
- Ningún estudiante ha terminado un minijuego todavía.
- Oculto
- Preguntas de examen
- Promedio por estudiante
- Próximos
- Simulacros de examen
- sin usar
- Terminadas
- Terminados
- Últimos 7 días. Terminadas = partidas que llegaron al resumen.
- Visible

**`components/admin/questions-crud.tsx`**

- ¿Borrar pregunta?
- {…} preguntas · mostrando {…}
- Correcta: opción {…}
- Crear pregunta
- Enunciado
- Filtrar por enunciado…
- Filtrar preguntas
- Mostrando {…} de {…}. Usa el filtro para acotar.
- Ninguna pregunta coincide con el filtro.
- Nueva pregunta
- Opción {…}
- Opción {…} es la correcta
- Opción múltiple: marca la respuesta correcta.
- Opciones
- Preguntas
- Todavía no hay preguntas.

**`components/admin/topics-crud.tsx`**

- Crear tema
- Error al guardar
- Nombre del tema
- Nuevo tema
- Orden
- Se agrega al final del orden indicado.
- Servicio
- Servicios / conceptos
- Todavía no hay temas.
- Track
- Track CLF

**`components/admin/users-panel.tsx`**

- ¿Generar contraseña temporal para @{…}?
- {…} cuentas en total
- Activo
- Activos 7 días
- Buscar por usuario o correo…
- Buscar usuarios
- Error al restablecer
- Error al suspender
- Estudiaron en la última semana
- Mostrar en podio
- Ningún usuario coincide con “{…}”.
- Nunca han estudiado
- Ocultar del podio
- Oculto del podio
- Ordenar por
- Racha
- Reactivar
- Registro
- Rol
- Sin actividad
- Sin usuarios o la API no está disponible.
- Suspender
- Suspendido
- Última actividad

### Otras

**`app/layout.tsx`**

- %s · AWS Study Lab
- AWS Study Lab
- Prepárate para AWS Cloud Practitioner con cartas, estudio y examen.

**`app/not-found-actions.tsx`**

- Entrar
- Ir a Inicio
- Ir al inicio
- Página principal

**`app/not-found.tsx`**

- Esa dirección no corresponde a ninguna pantalla de AWS Study Lab.
- Esta página no existe
- Página no encontrada

**`components/brand/mascot.tsx`**

- Mascota de {…} con libro AWS
- Mascota de {…} con medalla de bronce
- Mascota de {…} con medalla de plata
- Mascota de {…} con servidor
- Mascota de {…} con trofeo de campeón
- Mascota de {…} de seguridad
- Mascota de {…} en cohete AWS
- Mascota de {…} en la laptop
- Mascota de {…} saludando

**`components/exam-date/exam-date-dialog.tsx`**

- ¿Quitar este examen de tu agenda?
- Agrega tu examen
- Agrega un examen
- Agregar
- Cambiar examen
- Elige la certificación que vas a presentar.
- Elige un día.
- faltan {…} días
- Fecha de tu examen
- fue ayer
- fue hace {…} días
- Listo
- mañana
- Mes anterior
- Mes siguiente
- miércoles
- Quitar examen
- sábado
- Sí, quitar

**`lib/admin-content-api.ts`**

- Error {…}

**`lib/api.ts`**

- Algo falló de nuestro lado. Inténtalo de nuevo en un momento.
- No pudimos conectarnos. Revisa tu conexión e inténtalo de nuevo.
- Sesión
- Tu sesión expiró. Vuelve a entrar para seguir.

**`lib/content-api.ts`**

- Almacenamiento
- Almacenamiento de objetos durable.
- Cómputo redimensionable (VMs) en la nube.
- Conceptos de la nube
- EC2 = Elastic Compute Cloud.
- S3 = Simple Storage Service.
- Servicios de cómputo

**`lib/flags-api.ts`**

- No se pudieron cargar flags ({…})

**`lib/format-study.ts`**

- En curso

**`lib/podium-standing.ts`**

- 1 concepto
- Domina {…} más para pasar a @{…}.
- Entras al podio al dominar tu primer concepto: acierta la misma carta {…} veces seguidas, aunque sea en partidas distintas.
- Tu perfil está oculto del podio. Puedes mostrarlo desde Cuenta.
- Vas en el lugar {…}.
- Vas en primer lugar, {…} arriba de @{…}.
- Vas en primer lugar, empatado con @{…}.
- Vas en primer lugar.

**`lib/route-labels.ts`**

- Administración
- Cuenta
- Estudiar
- Examen
- Guías
- Inicio
- Minijuegos
- tu historial
- tu progreso

**`lib/study-api.ts`**

- Necesitas iniciar sesión para estudiar

**`lib/study-categories.ts`**

- Amenazas, controles, cifrado, recuperación
- Archivos, discos para una instancia y copias que sacas de línea
- Arquitectura
- Automatizar, usar la terminal y encontrar qué falló
- Bases de datos
- Bases relacionales, NoSQL y cómo moverlas
- Comandos, permisos, procesos, logs
- Cómo se diseña una solución fiable, segura y al costo correcto
- Cómo viajan los datos: capas, puertos, direcciones y nombres
- Cómputo
- Cómputo, datos, redes, seguridad y cómo operarlos
- Conceptos
- Conceptos de arquitectura de AWS
- Conceptos de Linux
- Conceptos de operaciones del sistema
- Conceptos de redes
- Conceptos de seguridad
- Conceptos por módulo de estudio
- Gestión y monitoreo
- La nube
- Linux
- Métricas, plantillas de infraestructura y cuánto estás gastando
- Modelos, precios, regiones, responsabilidad
- Nube, Linux, redes, seguridad, operaciones y arquitectura
- Operaciones
- Quién entra, claves, ataques y cómo te enteras
- Redes
- Redes y entrega
- Seguridad
- Servicios
- Servicios de almacenamiento
- Servicios de AWS
- Servicios de bases de datos
- Servicios de gestión y monitoreo
- Servicios de redes y entrega
- Servicios de seguridad
- Servidores virtuales, funciones sin servidor y cómo pagarlos
- Todos los conceptos
- Todos los servicios
- Todos los temas
- Tu red privada, la salida a internet y la entrega de contenido
- Tu selección · {…} temas

**`lib/study-guides.ts`**

- AWS Study Lab - {…}
- No pudimos cargar los conceptos. Inténtalo de nuevo.
- Unknown study category {…}

**`lib/time-zone-label.ts`**

- Bogotá
- Buenos Aires
- Cancún
- Ciudad de México
- Los Ángeles
- Mérida
- Nueva York
- São Paulo
## Cartas

En la carta se lee la definición y se responde con el nombre. En el crucigrama, la pista es esa misma definición.

### Servicios de cómputo

#### EC2

> Servicio que crea servidores virtuales (instancias) en la nube; eliges CPU, memoria, disco y sistema operativo.

> EC2 significa “Elastic Compute Cloud”. Pagas por el tiempo que la instancia está encendida.

Otras opciones de la carta:

- Servicio que ejecuta funciones de código sin administrar servidores; solo corre cuando ocurre un evento.
- Servicio que ejecuta y administra contenedores Docker.
- Imagen con el sistema operativo y el software desde la que se lanza una instancia; funciona como la ISO de instalación.

#### AMI

> Imagen con el sistema operativo y el software desde la que se lanza una instancia; funciona como la ISO de instalación.

> AMI significa “Amazon Machine Image”.

Otras opciones de la carta:

- Servicio que crea servidores virtuales (instancias) en la nube; eliges CPU, memoria, disco y sistema operativo.
- Script con instrucciones de configuración que una instancia EC2 ejecuta al arrancar por primera vez.
- Volumen de almacenamiento en bloques que se conecta a una instancia EC2 como su disco.

#### Lambda

> Servicio que ejecuta funciones de código sin administrar servidores; solo corre cuando ocurre un evento.

Otras opciones de la carta:

- Servicio que crea servidores virtuales (instancias) en la nube; eliges CPU, memoria, disco y sistema operativo.
- Servicio que ejecuta y administra contenedores Docker.
- Forma de pagar una instancia por hora de uso, sin compromiso ni pago por adelantado.

#### ECS

> Servicio que ejecuta y administra contenedores Docker.

> ECS significa “Elastic Container Service”.

Otras opciones de la carta:

- Servicio que ejecuta funciones de código sin administrar servidores; solo corre cuando ocurre un evento.
- Servicio que crea servidores virtuales (instancias) en la nube; eliges CPU, memoria, disco y sistema operativo.
- Forma de pagar una instancia por hora de uso, sin compromiso ni pago por adelantado.

#### On-Demand

> Forma de pagar una instancia por hora de uso, sin compromiso ni pago por adelantado.

> El nombre va en inglés. 1 hora de uso, 1 hora de pago.

Otras opciones de la carta:

- Instancia con compromiso de uso de 1 o 3 años, a cambio de un descuento de hasta 72 % frente a On-Demand.
- Instancia que usa capacidad sobrante de AWS con hasta 90 % de descuento; AWS puede recuperarla con 2 minutos de aviso.
- Familia de instancias equilibrada en CPU y memoria, para servidores web y entornos de desarrollo (letras t y m).

#### Reserved

> Instancia con compromiso de uso de 1 o 3 años, a cambio de un descuento de hasta 72 % frente a On-Demand.

> El nombre va en inglés. Conviene cuando el uso es estable y predecible.

Otras opciones de la carta:

- Forma de pagar una instancia por hora de uso, sin compromiso ni pago por adelantado.
- Instancia que usa capacidad sobrante de AWS con hasta 90 % de descuento; AWS puede recuperarla con 2 minutos de aviso.
- Familia de instancias equilibrada en CPU y memoria, para servidores web y entornos de desarrollo (letras t y m).

#### Spot

> Instancia que usa capacidad sobrante de AWS con hasta 90 % de descuento; AWS puede recuperarla con 2 minutos de aviso.

> Solo sirve para trabajos que toleran interrupciones.

Otras opciones de la carta:

- Forma de pagar una instancia por hora de uso, sin compromiso ni pago por adelantado.
- Instancia con compromiso de uso de 1 o 3 años, a cambio de un descuento de hasta 72 % frente a On-Demand.
- Familia de instancias equilibrada en CPU y memoria, para servidores web y entornos de desarrollo (letras t y m).

#### Propósito general

> Familia de instancias equilibrada en CPU y memoria, para servidores web y entornos de desarrollo (letras t y m).

Otras opciones de la carta:

- Familia de instancias con procesadores potentes, para servidores de video, juegos y machine learning (letra c).
- Familia de instancias con mucha RAM, pensada para bases de datos (letras r y x).
- Familia de instancias con discos locales rápidos, para cargas con mucho acceso a disco (letras i y d).

#### Optimizada para cómputo

> Familia de instancias con procesadores potentes, para servidores de video, juegos y machine learning (letra c).

Otras opciones de la carta:

- Familia de instancias con procesadores gráficos (GPU), para gráficos y deep learning (letras p y g).
- Familia de instancias equilibrada en CPU y memoria, para servidores web y entornos de desarrollo (letras t y m).
- Familia de instancias con mucha RAM, pensada para bases de datos (letras r y x).

#### Optimizada para memoria

> Familia de instancias con mucha RAM, pensada para bases de datos (letras r y x).

Otras opciones de la carta:

- Familia de instancias con discos locales rápidos, para cargas con mucho acceso a disco (letras i y d).
- Familia de instancias con procesadores potentes, para servidores de video, juegos y machine learning (letra c).
- Familia de instancias equilibrada en CPU y memoria, para servidores web y entornos de desarrollo (letras t y m).

#### Cómputo acelerado

> Familia de instancias con procesadores gráficos (GPU), para gráficos y deep learning (letras p y g).

Otras opciones de la carta:

- Familia de instancias con procesadores potentes, para servidores de video, juegos y machine learning (letra c).
- Familia de instancias con mucha RAM, pensada para bases de datos (letras r y x).
- Familia de instancias con discos locales rápidos, para cargas con mucho acceso a disco (letras i y d).

#### Optimizada para almacenamiento

> Familia de instancias con discos locales rápidos, para cargas con mucho acceso a disco (letras i y d).

Otras opciones de la carta:

- Familia de instancias con mucha RAM, pensada para bases de datos (letras r y x).
- Familia de instancias equilibrada en CPU y memoria, para servidores web y entornos de desarrollo (letras t y m).
- Familia de instancias con procesadores gráficos (GPU), para gráficos y deep learning (letras p y g).

#### Nomenclatura

> Forma de leer un tipo de instancia como t3.micro: la letra es la familia (t), el número la generación (3) y lo último el tamaño (micro).

Otras opciones de la carta:

- Familia de instancias equilibrada en CPU y memoria, para servidores web y entornos de desarrollo (letras t y m).
- Imagen con el sistema operativo y el software desde la que se lanza una instancia; funciona como la ISO de instalación.
- Servicio que crea servidores virtuales (instancias) en la nube; eliges CPU, memoria, disco y sistema operativo.

### Servicios de almacenamiento

#### S3

> Servicio de almacenamiento de objetos (archivos, videos, respaldos) guardados en buckets; es escalable y tiene durabilidad de 11 nueves.

> S3 significa “Simple Storage Service”.

Otras opciones de la carta:

- Volumen de almacenamiento en bloques que se conecta a una instancia EC2 como su disco.
- Sistema de archivos compartido que varias instancias EC2 pueden montar a la vez.
- Contenedor donde S3 guarda los objetos; su nombre debe ser único en todo el mundo y cada cuenta empieza con 100, ampliables a 1000.

#### EBS

> Volumen de almacenamiento en bloques que se conecta a una instancia EC2 como su disco.

> EBS significa “Elastic Block Store”.

Otras opciones de la carta:

- Sistema de archivos compartido que varias instancias EC2 pueden montar a la vez.
- Servicio de almacenamiento de objetos (archivos, videos, respaldos) guardados en buckets; es escalable y tiene durabilidad de 11 nueves.
- Contenedor donde S3 guarda los objetos; su nombre debe ser único en todo el mundo y cada cuenta empieza con 100, ampliables a 1000.

#### EFS

> Sistema de archivos compartido que varias instancias EC2 pueden montar a la vez.

> EFS significa “Elastic File System”.

Otras opciones de la carta:

- Volumen de almacenamiento en bloques que se conecta a una instancia EC2 como su disco.
- Servicio de almacenamiento de objetos (archivos, videos, respaldos) guardados en buckets; es escalable y tiene durabilidad de 11 nueves.
- Contenedor donde S3 guarda los objetos; su nombre debe ser único en todo el mundo y cada cuenta empieza con 100, ampliables a 1000.

#### Bucket

> Contenedor donde S3 guarda los objetos; su nombre debe ser único en todo el mundo y cada cuenta empieza con 100, ampliables a 1000.

Otras opciones de la carta:

- Servicio de almacenamiento de objetos (archivos, videos, respaldos) guardados en buckets; es escalable y tiene durabilidad de 11 nueves.
- Volumen de almacenamiento en bloques que se conecta a una instancia EC2 como su disco.
- Probabilidad de que un objeto guardado no se pierda; en S3 es de 99.999999999 % (11 nueves).

#### Durabilidad

> Probabilidad de que un objeto guardado no se pierda; en S3 es de 99.999999999 % (11 nueves).

Otras opciones de la carta:

- Tener acceso ininterrumpido a los sistemas y datos cuando se necesitan.
- Clase de S3 de acceso poco frecuente que guarda los datos en una sola Availability Zone; es más barata, pero los datos se pierden si esa zona falla.
- Clase de S3 para datos de acceso frecuente, con la menor latencia y el mayor costo de almacenamiento.

#### S3 Standard

> Clase de S3 para datos de acceso frecuente, con la menor latencia y el mayor costo de almacenamiento.

Otras opciones de la carta:

- Clase de S3 para datos de acceso poco frecuente que deben estar disponibles al instante; guardar cuesta menos, pero recuperar tiene cargo.
- Clase de S3 que mueve los objetos automáticamente entre niveles de acceso frecuente e infrecuente según cómo se usan.
- Clase de S3 de acceso poco frecuente que guarda los datos en una sola Availability Zone; es más barata, pero los datos se pierden si esa zona falla.

#### S3 Standard-IA

> Clase de S3 para datos de acceso poco frecuente que deben estar disponibles al instante; guardar cuesta menos, pero recuperar tiene cargo.

> S3 Standard-IA significa “Standard-Infrequent Access”.

Otras opciones de la carta:

- Clase de S3 de acceso poco frecuente que guarda los datos en una sola Availability Zone; es más barata, pero los datos se pierden si esa zona falla.
- Clase de S3 para datos de acceso frecuente, con la menor latencia y el mayor costo de almacenamiento.
- Clase de archivo de bajo costo para datos que casi no se consultan; recuperar un archivo tarda de minutos a horas.

#### S3 One Zone-IA

> Clase de S3 de acceso poco frecuente que guarda los datos en una sola Availability Zone; es más barata, pero los datos se pierden si esa zona falla.

Otras opciones de la carta:

- Clase de S3 para datos de acceso poco frecuente que deben estar disponibles al instante; guardar cuesta menos, pero recuperar tiene cargo.
- Clase de S3 para datos de acceso frecuente, con la menor latencia y el mayor costo de almacenamiento.
- La clase más barata de S3, para conservar datos durante años (hasta unos 10); recuperar un archivo tarda hasta 12 horas.

#### S3 Intelligent-Tiering

> Clase de S3 que mueve los objetos automáticamente entre niveles de acceso frecuente e infrecuente según cómo se usan.

Otras opciones de la carta:

- Clase de S3 para datos de acceso frecuente, con la menor latencia y el mayor costo de almacenamiento.
- Clase de S3 para datos de acceso poco frecuente que deben estar disponibles al instante; guardar cuesta menos, pero recuperar tiene cargo.
- Clase de archivo de bajo costo para datos que casi no se consultan; recuperar un archivo tarda de minutos a horas.

#### S3 Glacier Flexible Retrieval

> Clase de archivo de bajo costo para datos que casi no se consultan; recuperar un archivo tarda de minutos a horas.

Otras opciones de la carta:

- La clase más barata de S3, para conservar datos durante años (hasta unos 10); recuperar un archivo tarda hasta 12 horas.
- Clase de S3 para datos de acceso poco frecuente que deben estar disponibles al instante; guardar cuesta menos, pero recuperar tiene cargo.
- Clase de S3 que mueve los objetos automáticamente entre niveles de acceso frecuente e infrecuente según cómo se usan.

#### S3 Glacier Deep Archive

> La clase más barata de S3, para conservar datos durante años (hasta unos 10); recuperar un archivo tarda hasta 12 horas.

Otras opciones de la carta:

- Clase de archivo de bajo costo para datos que casi no se consultan; recuperar un archivo tarda de minutos a horas.
- Clase de S3 de acceso poco frecuente que guarda los datos en una sola Availability Zone; es más barata, pero los datos se pierden si esa zona falla.
- Clase de S3 para datos de acceso poco frecuente que deben estar disponibles al instante; guardar cuesta menos, pero recuperar tiene cargo.

#### Snowcone

> Dispositivo físico pequeño de la familia Snow para transportar datos a AWS (de 8 TB a 14 TB).

Otras opciones de la carta:

- Dispositivo físico de la familia Snow para mover grandes volúmenes de datos a AWS (hasta 80 TB).
- Servicio que transfiere datos por la red entre tus servidores y servicios de AWS como S3.
- Servicio de almacenamiento de objetos (archivos, videos, respaldos) guardados en buckets; es escalable y tiene durabilidad de 11 nueves.

#### Snowball

> Dispositivo físico de la familia Snow para mover grandes volúmenes de datos a AWS (hasta 80 TB).

Otras opciones de la carta:

- Dispositivo físico pequeño de la familia Snow para transportar datos a AWS (de 8 TB a 14 TB).
- Servicio que transfiere datos por la red entre tus servidores y servicios de AWS como S3.
- Servicio de almacenamiento de objetos (archivos, videos, respaldos) guardados en buckets; es escalable y tiene durabilidad de 11 nueves.

#### DataSync

> Servicio que transfiere datos por la red entre tus servidores y servicios de AWS como S3.

Otras opciones de la carta:

- Dispositivo físico de la familia Snow para mover grandes volúmenes de datos a AWS (hasta 80 TB).
- Servicio que migra bases de datos hacia AWS.
- Dispositivo físico pequeño de la familia Snow para transportar datos a AWS (de 8 TB a 14 TB).

### Servicios de bases de datos

#### RDS

> Servicio administrado de bases de datos relacionales: tablas con relaciones que se consultan con SQL.

> RDS significa “Relational Database Service”.

Otras opciones de la carta:

- Servicio administrado de bases de datos no relacionales (NoSQL) de clave-valor.
- Servicio que migra bases de datos hacia AWS.
- Servicio de almacenamiento de objetos (archivos, videos, respaldos) guardados en buckets; es escalable y tiene durabilidad de 11 nueves.

#### DynamoDB

> Servicio administrado de bases de datos no relacionales (NoSQL) de clave-valor.

Otras opciones de la carta:

- Servicio administrado de bases de datos relacionales: tablas con relaciones que se consultan con SQL.
- Servicio que migra bases de datos hacia AWS.
- Servicio de almacenamiento de objetos (archivos, videos, respaldos) guardados en buckets; es escalable y tiene durabilidad de 11 nueves.

#### DMS

> Servicio que migra bases de datos hacia AWS.

> DMS significa “Database Migration Service”.

Otras opciones de la carta:

- Servicio que transfiere datos por la red entre tus servidores y servicios de AWS como S3.
- Servicio administrado de bases de datos relacionales: tablas con relaciones que se consultan con SQL.
- Servicio administrado de bases de datos no relacionales (NoSQL) de clave-valor.

### Servicios de redes y entrega

#### VPC

> Red virtual privada y lógicamente aislada dentro de una región, que puede abarcar varias zonas de disponibilidad.

> VPC significa “Virtual Private Cloud”. Equivale al centro de datos de la infraestructura tradicional; su bloque CIDR va de /16 (65 536 IP) a /28 (16 IP).

Otras opciones de la carta:

- División de una red en segmentos más pequeños; en AWS cada una vive en una sola Availability Zone.
- Conjunto de reglas que indica a dónde se envía el tráfico de las subredes; equivale al enrutador físico.
- Componente que permite el tráfico en ambos sentidos entre una VPC e internet; equivale al módem.

#### CloudFront

> Red de entrega de contenido (CDN) que guarda copias del contenido en ubicaciones de borde, cerca de los usuarios.

Otras opciones de la carta:

- Servicio de DNS de AWS: traduce nombres de dominio a direcciones IP y dirige el tráfico.
- Punto de presencia de la red de AWS que CloudFront usa para entregar contenido cerca de los usuarios.
- Subred cuya tabla de rutas envía el tráfico de internet al Internet Gateway.

#### Route 53

> Servicio de DNS de AWS: traduce nombres de dominio a direcciones IP y dirige el tráfico.

Otras opciones de la carta:

- Red de entrega de contenido (CDN) que guarda copias del contenido en ubicaciones de borde, cerca de los usuarios.
- Sistema que traduce nombres de dominio, como www.amazon.com, a direcciones IP.
- Subred cuya tabla de rutas envía el tráfico de internet al Internet Gateway.

#### Public subnet

> Subred cuya tabla de rutas envía el tráfico de internet al Internet Gateway.

> El nombre va en inglés.

Otras opciones de la carta:

- Subred sin ruta hacia un Internet Gateway, así que no tiene salida directa a internet.
- Componente que permite el tráfico en ambos sentidos entre una VPC e internet; equivale al módem.
- Permite que los recursos de una subred privada salgan a internet (por ejemplo, para actualizarse) sin aceptar conexiones entrantes.

#### Private subnet

> Subred sin ruta hacia un Internet Gateway, así que no tiene salida directa a internet.

> El nombre va en inglés. Ahí se colocan, por ejemplo, las bases de datos.

Otras opciones de la carta:

- Subred cuya tabla de rutas envía el tráfico de internet al Internet Gateway.
- Permite que los recursos de una subred privada salgan a internet (por ejemplo, para actualizarse) sin aceptar conexiones entrantes.
- Componente que permite el tráfico en ambos sentidos entre una VPC e internet; equivale al módem.

#### Internet Gateway

> Componente que permite el tráfico en ambos sentidos entre una VPC e internet; equivale al módem.

> Se abrevia IGW.

Otras opciones de la carta:

- Permite que los recursos de una subred privada salgan a internet (por ejemplo, para actualizarse) sin aceptar conexiones entrantes.
- Conjunto de reglas que indica a dónde se envía el tráfico de las subredes; equivale al enrutador físico.
- Firewall virtual a nivel de instancia y con estado: solo admite reglas de permiso y la respuesta a un tráfico permitido se autoriza sola.

#### NAT Gateway

> Permite que los recursos de una subred privada salgan a internet (por ejemplo, para actualizarse) sin aceptar conexiones entrantes.

> Equivale al servidor NAT de la infraestructura tradicional.

Otras opciones de la carta:

- Componente que permite el tráfico en ambos sentidos entre una VPC e internet; equivale al módem.
- Conjunto de reglas que indica a dónde se envía el tráfico de las subredes; equivale al enrutador físico.
- Firewall virtual a nivel de instancia y con estado: solo admite reglas de permiso y la respuesta a un tráfico permitido se autoriza sola.

#### Tabla de rutas

> Conjunto de reglas que indica a dónde se envía el tráfico de las subredes; equivale al enrutador físico.

> En inglés, route table.

Otras opciones de la carta:

- Componente que permite el tráfico en ambos sentidos entre una VPC e internet; equivale al módem.
- Firewall a nivel de subred y sin estado: admite reglas de permiso y de denegación, evaluadas en orden de menor a mayor número.
- Firewall virtual a nivel de instancia y con estado: solo admite reglas de permiso y la respuesta a un tráfico permitido se autoriza sola.

#### Security Group

> Firewall virtual a nivel de instancia y con estado: solo admite reglas de permiso y la respuesta a un tráfico permitido se autoriza sola.

> Por defecto bloquea todo lo entrante y permite todo lo saliente.

Otras opciones de la carta:

- Firewall a nivel de subred y sin estado: admite reglas de permiso y de denegación, evaluadas en orden de menor a mayor número.
- Firewall que filtra el tráfico HTTP/HTTPS de tus aplicaciones web y bloquea ataques como inyección SQL y XSS.
- Las 5 direcciones de cada subred que AWS no deja usar: red (.0), enrutador (.1), DNS (.2), uso futuro (.3) y difusión (la última).

#### Network ACL

> Firewall a nivel de subred y sin estado: admite reglas de permiso y de denegación, evaluadas en orden de menor a mayor número.

> Por defecto permite todo el tráfico; el de entrada y el de salida se configuran por separado.

Otras opciones de la carta:

- Firewall virtual a nivel de instancia y con estado: solo admite reglas de permiso y la respuesta a un tráfico permitido se autoriza sola.
- Conjunto de reglas que indica a dónde se envía el tráfico de las subredes; equivale al enrutador físico.
- Las 5 direcciones de cada subred que AWS no deja usar: red (.0), enrutador (.1), DNS (.2), uso futuro (.3) y difusión (la última).

#### IP reservadas de subred

> Las 5 direcciones de cada subred que AWS no deja usar: red (.0), enrutador (.1), DNS (.2), uso futuro (.3) y difusión (la última).

Otras opciones de la carta:

- Notación con barra (/16, /28) que indica el tamaño de una red y permite dividirla en subredes; /16 son 65 536 IP y /28 son 16.
- Última dirección de un rango, que envía un mensaje a todos los equipos de la red.
- Servicio para conectar y administrar millones de dispositivos del internet de las cosas.

#### IoT Core

> Servicio para conectar y administrar millones de dispositivos del internet de las cosas.

Otras opciones de la carta:

- Servicio de escritorios virtuales en la nube.
- Red virtual privada y lógicamente aislada dentro de una región, que puede abarcar varias zonas de disponibilidad.
- Red de entrega de contenido (CDN) que guarda copias del contenido en ubicaciones de borde, cerca de los usuarios.

#### WorkSpaces

> Servicio de escritorios virtuales en la nube.

Otras opciones de la carta:

- Servicio para conectar y administrar millones de dispositivos del internet de las cosas.
- Servicio que crea servidores virtuales (instancias) en la nube; eliges CPU, memoria, disco y sistema operativo.
- Red virtual privada y lógicamente aislada dentro de una región, que puede abarcar varias zonas de disponibilidad.

### Servicios de seguridad

#### IAM

> Servicio global que controla quién puede entrar a tu cuenta (autenticación) y qué puede hacer (autorización).

> IAM significa “Identity and Access Management”.

Otras opciones de la carta:

- Servicio para agrupar y administrar varias cuentas de AWS desde una cuenta central.
- Servicio para crear y controlar las claves de cifrado de tus datos.
- Servicio que registra las llamadas a la API de tu cuenta: quién hizo qué, cuándo y desde dónde.

#### Root user

> Dueño de la cuenta, con permisos ilimitados; se protege con MFA, no se le crean access keys y solo se usa para tareas administrativas.

> El nombre va en inglés.

Otras opciones de la carta:

- Identidad de una persona o servicio que solo hace lo que sus permisos le permiten.
- Identidad con permisos que se asume de forma temporal; entrega credenciales temporales y no pertenece a una persona.
- Colección de usuarios; los permisos se asignan al grupo y todos sus miembros los reciben.

#### Usuario IAM

> Identidad de una persona o servicio que solo hace lo que sus permisos le permiten.

Otras opciones de la carta:

- Dueño de la cuenta, con permisos ilimitados; se protege con MFA, no se le crean access keys y solo se usa para tareas administrativas.
- Identidad con permisos que se asume de forma temporal; entrega credenciales temporales y no pertenece a una persona.
- Colección de usuarios; los permisos se asignan al grupo y todos sus miembros los reciben.

#### Grupo IAM

> Colección de usuarios; los permisos se asignan al grupo y todos sus miembros los reciben.

Otras opciones de la carta:

- Identidad con permisos que se asume de forma temporal; entrega credenciales temporales y no pertenece a una persona.
- Identidad de una persona o servicio que solo hace lo que sus permisos le permiten.
- Documento JSON con reglas (Version, Statement, Effect, Action, Resource, Condition) que permiten o niegan acciones.

#### Rol IAM

> Identidad con permisos que se asume de forma temporal; entrega credenciales temporales y no pertenece a una persona.

Otras opciones de la carta:

- Identidad de una persona o servicio que solo hace lo que sus permisos le permiten.
- Colección de usuarios; los permisos se asignan al grupo y todos sus miembros los reciben.
- Dueño de la cuenta, con permisos ilimitados; se protege con MFA, no se le crean access keys y solo se usa para tareas administrativas.

#### Política IAM

> Documento JSON con reglas (Version, Statement, Effect, Action, Resource, Condition) que permiten o niegan acciones.

> La Version es "2012-10-17" y Resource se indica con un ARN.

Otras opciones de la carta:

- Política de Organizations que fija el máximo de permisos de las cuentas; está por encima de IAM.
- Identidad con permisos que se asume de forma temporal; entrega credenciales temporales y no pertenece a una persona.
- Colección de usuarios; los permisos se asignan al grupo y todos sus miembros los reciben.

#### Lógica de evaluación

> Cómo decide IAM: todo está negado por defecto, un Allow explícito lo permite y un Deny explícito siempre gana.

Otras opciones de la carta:

- Dar solo los permisos indispensables para una tarea, durante un tiempo definido.
- Documento JSON con reglas (Version, Statement, Effect, Action, Resource, Condition) que permiten o niegan acciones.
- Política que se adjunta a un usuario, grupo o rol y define qué puede hacer esa identidad.

#### Política basada en identidad

> Política que se adjunta a un usuario, grupo o rol y define qué puede hacer esa identidad.

Otras opciones de la carta:

- Política que se adjunta a un recurso, como un bucket, y define quién puede acceder a él.
- Política de Organizations que fija el máximo de permisos de las cuentas; está por encima de IAM.
- Par Access Key ID y Secret Access Key que autentica a un usuario en la CLI o en los SDK.

#### Política basada en recursos

> Política que se adjunta a un recurso, como un bucket, y define quién puede acceder a él.

Otras opciones de la carta:

- Política que se adjunta a un usuario, grupo o rol y define qué puede hacer esa identidad.
- Política de Organizations que fija el máximo de permisos de las cuentas; está por encima de IAM.
- Par Access Key ID y Secret Access Key que autentica a un usuario en la CLI o en los SDK.

#### Access keys

> Par Access Key ID y Secret Access Key que autentica a un usuario en la CLI o en los SDK.

> El nombre va en inglés. Al root user no se le crean.

Otras opciones de la carta:

- Usuario y contraseña para entrar a la Consola de administración web.
- Identidad con permisos que se asume de forma temporal; entrega credenciales temporales y no pertenece a una persona.
- Servicio para crear y controlar las claves de cifrado de tus datos.

#### Contraseña de consola

> Usuario y contraseña para entrar a la Consola de administración web.

Otras opciones de la carta:

- Par Access Key ID y Secret Access Key que autentica a un usuario en la CLI o en los SDK.
- Capa extra en el inicio de sesión que combina factores: algo que sabes (PIN), algo que tienes (app autenticadora) o algo que eres (huella).
- Servicio para crear y controlar las claves de cifrado de tus datos.

#### KMS

> Servicio para crear y controlar las claves de cifrado de tus datos.

> KMS significa “Key Management Service”.

Otras opciones de la carta:

- Módulo de seguridad de hardware (HSM) dedicado en la nube para generar y guardar tus claves.
- Servicio para guardar, rotar y recuperar credenciales, como contraseñas de bases de datos.
- Servicio que emite y administra certificados SSL/TLS.

#### Secrets Manager

> Servicio para guardar, rotar y recuperar credenciales, como contraseñas de bases de datos.

Otras opciones de la carta:

- Servicio para crear y controlar las claves de cifrado de tus datos.
- Función de Systems Manager que guarda configuraciones y secretos, cifrados con KMS.
- Servicio que emite y administra certificados SSL/TLS.

#### ACM

> Servicio que emite y administra certificados SSL/TLS.

> ACM significa “AWS Certificate Manager”.

Otras opciones de la carta:

- Módulo de seguridad de hardware (HSM) dedicado en la nube para generar y guardar tus claves.
- Servicio para crear y controlar las claves de cifrado de tus datos.
- Servicio de protección contra ataques DDoS; Standard viene incluido y Advanced agrega protección avanzada.

#### CloudHSM

> Módulo de seguridad de hardware (HSM) dedicado en la nube para generar y guardar tus claves.

Otras opciones de la carta:

- Servicio para crear y controlar las claves de cifrado de tus datos.
- Servicio que emite y administra certificados SSL/TLS.
- Servicio de protección contra ataques DDoS; Standard viene incluido y Advanced agrega protección avanzada.

#### Shield

> Servicio de protección contra ataques DDoS; Standard viene incluido y Advanced agrega protección avanzada.

Otras opciones de la carta:

- Firewall que filtra el tráfico HTTP/HTTPS de tus aplicaciones web y bloquea ataques como inyección SQL y XSS.
- Servicio de detección inteligente de amenazas que supervisa la actividad de tu cuenta con machine learning.
- Servicio que revisa tus instancias EC2 en busca de vulnerabilidades de seguridad.

#### WAF

> Firewall que filtra el tráfico HTTP/HTTPS de tus aplicaciones web y bloquea ataques como inyección SQL y XSS.

> WAF significa “Web Application Firewall”.

Otras opciones de la carta:

- Servicio de protección contra ataques DDoS; Standard viene incluido y Advanced agrega protección avanzada.
- Firewall virtual a nivel de instancia y con estado: solo admite reglas de permiso y la respuesta a un tráfico permitido se autoriza sola.
- Servicio de detección inteligente de amenazas que supervisa la actividad de tu cuenta con machine learning.

#### GuardDuty

> Servicio de detección inteligente de amenazas que supervisa la actividad de tu cuenta con machine learning.

Otras opciones de la carta:

- Servicio que revisa tus instancias EC2 en busca de vulnerabilidades de seguridad.
- Panel central que reúne los hallazgos de seguridad de servicios como GuardDuty e Inspector.
- Servicio global que controla quién puede entrar a tu cuenta (autenticación) y qué puede hacer (autorización).

#### Inspector

> Servicio que revisa tus instancias EC2 en busca de vulnerabilidades de seguridad.

Otras opciones de la carta:

- Servicio de detección inteligente de amenazas que supervisa la actividad de tu cuenta con machine learning.
- Asesor que revisa tu cuenta en tiempo real y recomienda buenas prácticas de costo, seguridad y rendimiento.
- Panel central que reúne los hallazgos de seguridad de servicios como GuardDuty e Inspector.

#### Security Hub

> Panel central que reúne los hallazgos de seguridad de servicios como GuardDuty e Inspector.

Otras opciones de la carta:

- Servicio de detección inteligente de amenazas que supervisa la actividad de tu cuenta con machine learning.
- Servicio que revisa tus instancias EC2 en busca de vulnerabilidades de seguridad.
- Servicio global que controla quién puede entrar a tu cuenta (autenticación) y qué puede hacer (autorización).

### Servicios de gestión y monitoreo

#### CloudWatch

> Servicio de monitoreo que recopila métricas y registros en tiempo real (CPU, memoria) y dispara alarmas.

Otras opciones de la carta:

- Servicio que registra las llamadas a la API de tu cuenta: quién hizo qué, cuándo y desde dónde.
- Servicio de mensajería que envía notificaciones, como las alarmas de CloudWatch.
- Portal donde descargas los informes de auditoría y cumplimiento de AWS, como los SOC o PCI.

#### CloudTrail

> Servicio que registra las llamadas a la API de tu cuenta: quién hizo qué, cuándo y desde dónde.

Otras opciones de la carta:

- Servicio de monitoreo que recopila métricas y registros en tiempo real (CPU, memoria) y dispara alarmas.
- Portal donde descargas los informes de auditoría y cumplimiento de AWS, como los SOC o PCI.
- Servicio de mensajería que envía notificaciones, como las alarmas de CloudWatch.

#### SNS

> Servicio de mensajería que envía notificaciones, como las alarmas de CloudWatch.

> SNS significa “Simple Notification Service”.

Otras opciones de la carta:

- Servicio de monitoreo que recopila métricas y registros en tiempo real (CPU, memoria) y dispara alarmas.
- Servicio que registra las llamadas a la API de tu cuenta: quién hizo qué, cuándo y desde dónde.
- Portal donde descargas los informes de auditoría y cumplimiento de AWS, como los SOC o PCI.

#### Artifact

> Portal donde descargas los informes de auditoría y cumplimiento de AWS, como los SOC o PCI.

Otras opciones de la carta:

- Asesor que revisa tu cuenta en tiempo real y recomienda buenas prácticas de costo, seguridad y rendimiento.
- Servicio que registra las llamadas a la API de tu cuenta: quién hizo qué, cuándo y desde dónde.
- Herramienta para administrar los servicios de AWS con comandos desde la terminal.

#### AWS CLI

> Herramienta para administrar los servicios de AWS con comandos desde la terminal.

> AWS CLI significa “Command Line Interface”.

Otras opciones de la carta:

- Portal web para administrar los servicios de AWS con clics.
- Librerías para usar los servicios de AWS desde el código de una aplicación (.NET, Ruby, Go y otros lenguajes).
- Servicio para agrupar y administrar varias cuentas de AWS desde una cuenta central.

#### Management Console

> Portal web para administrar los servicios de AWS con clics.

> El nombre va en inglés.

Otras opciones de la carta:

- Herramienta para administrar los servicios de AWS con comandos desde la terminal.
- Librerías para usar los servicios de AWS desde el código de una aplicación (.NET, Ruby, Go y otros lenguajes).
- Servicio para agrupar y administrar varias cuentas de AWS desde una cuenta central.

#### SDK

> Librerías para usar los servicios de AWS desde el código de una aplicación (.NET, Ruby, Go y otros lenguajes).

> SDK significa “Software Development Kit”.

Otras opciones de la carta:

- Herramienta para administrar los servicios de AWS con comandos desde la terminal.
- Portal web para administrar los servicios de AWS con clics.
- Servicio para agrupar y administrar varias cuentas de AWS desde una cuenta central.

#### Organizations

> Servicio para agrupar y administrar varias cuentas de AWS desde una cuenta central.

Otras opciones de la carta:

- Política de Organizations que fija el máximo de permisos de las cuentas; está por encima de IAM.
- Servicio global que controla quién puede entrar a tu cuenta (autenticación) y qué puede hacer (autorización).
- Asesor que revisa tu cuenta en tiempo real y recomienda buenas prácticas de costo, seguridad y rendimiento.

#### SCP

> Política de Organizations que fija el máximo de permisos de las cuentas; está por encima de IAM.

> SCP significa “Service Control Policy”.

Otras opciones de la carta:

- Documento JSON con reglas (Version, Statement, Effect, Action, Resource, Condition) que permiten o niegan acciones.
- Política que se adjunta a un usuario, grupo o rol y define qué puede hacer esa identidad.
- Asesor que revisa tu cuenta en tiempo real y recomienda buenas prácticas de costo, seguridad y rendimiento.

#### Trusted Advisor

> Asesor que revisa tu cuenta en tiempo real y recomienda buenas prácticas de costo, seguridad y rendimiento.

Otras opciones de la carta:

- Herramienta para ver y analizar tus costos de AWS a lo largo del tiempo.
- Servicio que revisa tus instancias EC2 en busca de vulnerabilidades de seguridad.
- Servicio para definir presupuestos y recibir alertas cuando el gasto se acerca al límite o lo supera.

#### Cost Explorer

> Herramienta para ver y analizar tus costos de AWS a lo largo del tiempo.

Otras opciones de la carta:

- Servicio para definir presupuestos y recibir alertas cuando el gasto se acerca al límite o lo supera.
- Herramienta pública y gratuita para estimar cuánto costará una arquitectura antes de crearla.
- Consola central para inspeccionar y operar tu infraestructura: inventario, automatización, parámetros y sesiones remotas.

#### Budgets

> Servicio para definir presupuestos y recibir alertas cuando el gasto se acerca al límite o lo supera.

Otras opciones de la carta:

- Herramienta para ver y analizar tus costos de AWS a lo largo del tiempo.
- Herramienta pública y gratuita para estimar cuánto costará una arquitectura antes de crearla.
- Consola central para inspeccionar y operar tu infraestructura: inventario, automatización, parámetros y sesiones remotas.

#### Pricing Calculator

> Herramienta pública y gratuita para estimar cuánto costará una arquitectura antes de crearla.

Otras opciones de la carta:

- Servicio para definir presupuestos y recibir alertas cuando el gasto se acerca al límite o lo supera.
- Herramienta para ver y analizar tus costos de AWS a lo largo del tiempo.
- Consola central para inspeccionar y operar tu infraestructura: inventario, automatización, parámetros y sesiones remotas.

#### Systems Manager

> Consola central para inspeccionar y operar tu infraestructura: inventario, automatización, parámetros y sesiones remotas.

> Se abrevia SSM.

Otras opciones de la carta:

- Servicio de infraestructura como código: lee una plantilla JSON o YAML y crea, configura y conecta los recursos en una pila.
- Asesor que revisa tu cuenta en tiempo real y recomienda buenas prácticas de costo, seguridad y rendimiento.
- Función de Systems Manager que guarda configuraciones y secretos, cifrados con KMS.

#### Parameter Store

> Función de Systems Manager que guarda configuraciones y secretos, cifrados con KMS.

Otras opciones de la carta:

- Servicio para guardar, rotar y recuperar credenciales, como contraseñas de bases de datos.
- Función de Systems Manager que abre una terminal en tus instancias sin abrir el puerto SSH ni manejar llaves.
- Servicio de infraestructura como código: lee una plantilla JSON o YAML y crea, configura y conecta los recursos en una pila.

#### Session Manager

> Función de Systems Manager que abre una terminal en tus instancias sin abrir el puerto SSH ni manejar llaves.

Otras opciones de la carta:

- Protocolo cifrado para conectarse de forma remota a la terminal de una instancia.
- Función de Systems Manager que guarda configuraciones y secretos, cifrados con KMS.
- Servicio de infraestructura como código: lee una plantilla JSON o YAML y crea, configura y conecta los recursos en una pila.

#### CloudFormation

> Servicio de infraestructura como código: lee una plantilla JSON o YAML y crea, configura y conecta los recursos en una pila.

Otras opciones de la carta:

- Servicio que automatiza la configuración de los servidores.
- Consola central para inspeccionar y operar tu infraestructura: inventario, automatización, parámetros y sesiones remotas.
- Servicio de monitoreo que recopila métricas y registros en tiempo real (CPU, memoria) y dispara alarmas.

#### OpsWorks

> Servicio que automatiza la configuración de los servidores.

Otras opciones de la carta:

- Servicio de infraestructura como código: lee una plantilla JSON o YAML y crea, configura y conecta los recursos en una pila.
- Consola central para inspeccionar y operar tu infraestructura: inventario, automatización, parámetros y sesiones remotas.
- Servicio de monitoreo que recopila métricas y registros en tiempo real (CPU, memoria) y dispara alarmas.

### Conceptos de la nube

#### Computación en la nube

> Entrega On-Demand de potencia de cómputo, almacenamiento y otros recursos por internet, pagando solo por lo que usas.

Otras opciones de la carta:

- Técnica que divide un equipo físico en varias máquinas virtuales.
- Modelo de implementación en el que la infraestructura es de la propia empresa (on-premises).
- Equipo que responde a las peticiones de los clientes.

#### Servidor

> Equipo que responde a las peticiones de los clientes.

Otras opciones de la carta:

- Dispositivo con una IP fija porque ofrece algo que otros necesitan, como una impresora.
- Cualquier dispositivo conectado a la red que envía o recibe información.
- Técnica que divide un equipo físico en varias máquinas virtuales.

#### Virtualización

> Técnica que divide un equipo físico en varias máquinas virtuales.

Otras opciones de la carta:

- Entrega On-Demand de potencia de cómputo, almacenamiento y otros recursos por internet, pagando solo por lo que usas.
- Equipo que responde a las peticiones de los clientes.
- Demora entre que haces una petición y el servidor la recibe.

#### Latencia

> Demora entre que haces una petición y el servidor la recibe.

Otras opciones de la carta:

- Cantidad de datos que la red puede transferir en un tiempo dado.
- Gasto de capital: inversión anticipada en activos físicos, como comprar servidores, más su mantenimiento.
- Gasto operativo variable: pagas solo por lo que consumes.

#### Ancho de banda

> Cantidad de datos que la red puede transferir en un tiempo dado.

Otras opciones de la carta:

- Demora entre que haces una petición y el servidor la recibe.
- Gasto de capital: inversión anticipada en activos físicos, como comprar servidores, más su mantenimiento.
- Gasto operativo variable: pagas solo por lo que consumes.

#### CapEx

> Gasto de capital: inversión anticipada en activos físicos, como comprar servidores, más su mantenimiento.

> CapEx significa “Capital Expenditure”.

Otras opciones de la carta:

- Gasto operativo variable: pagas solo por lo que consumes.
- Principio de precios de AWS: pagas menos si te comprometes a usar un recurso durante 1 o 3 años.
- Modelo de implementación en el que la infraestructura es del proveedor, como AWS.

#### OpEx

> Gasto operativo variable: pagas solo por lo que consumes.

> OpEx significa “Operational Expenditure”. Pasar de CapEx a OpEx es una de las ventajas de la nube.

Otras opciones de la carta:

- Gasto de capital: inversión anticipada en activos físicos, como comprar servidores, más su mantenimiento.
- Principio de precios de AWS: pagas menos si te comprometes a usar un recurso durante 1 o 3 años.
- Modelo de implementación en el que la infraestructura es del proveedor, como AWS.

#### Nube pública

> Modelo de implementación en el que la infraestructura es del proveedor, como AWS.

Otras opciones de la carta:

- Modelo de implementación en el que la infraestructura es de la propia empresa (on-premises).
- Modelo de implementación que combina infraestructura pública y privada.
- Modelo de servicio con el mayor control: administras la red, el sistema operativo y la configuración sobre la infraestructura del proveedor.

#### Nube privada

> Modelo de implementación en el que la infraestructura es de la propia empresa (on-premises).

Otras opciones de la carta:

- Modelo de implementación en el que la infraestructura es del proveedor, como AWS.
- Modelo de implementación que combina infraestructura pública y privada.
- Modelo de servicio con el mayor control: administras la red, el sistema operativo y la configuración sobre la infraestructura del proveedor.

#### Nube híbrida

> Modelo de implementación que combina infraestructura pública y privada.

Otras opciones de la carta:

- Modelo de implementación en el que la infraestructura es del proveedor, como AWS.
- Modelo de implementación en el que la infraestructura es de la propia empresa (on-premises).
- Modelo de servicio con el mayor control: administras la red, el sistema operativo y la configuración sobre la infraestructura del proveedor.

#### IaaS

> Modelo de servicio con el mayor control: administras la red, el sistema operativo y la configuración sobre la infraestructura del proveedor.

> IaaS significa “Infraestructura como servicio”. EC2 es un ejemplo.

Otras opciones de la carta:

- Modelo de servicio en el que solo controlas tus datos y aplicaciones; el proveedor administra la plataforma.
- Modelo de servicio en el que el usuario final solo usa el software terminado.
- Principio de precios de AWS: pagas solo por lo que usas, sin contratos largos.

#### PaaS

> Modelo de servicio en el que solo controlas tus datos y aplicaciones; el proveedor administra la plataforma.

> PaaS significa “Plataforma como servicio”.

Otras opciones de la carta:

- Modelo de servicio con el mayor control: administras la red, el sistema operativo y la configuración sobre la infraestructura del proveedor.
- Modelo de servicio en el que el usuario final solo usa el software terminado.
- Principio de precios de AWS: pagas solo por lo que usas, sin contratos largos.

#### SaaS

> Modelo de servicio en el que el usuario final solo usa el software terminado.

> SaaS significa “Software como servicio”.

Otras opciones de la carta:

- Modelo de servicio en el que solo controlas tus datos y aplicaciones; el proveedor administra la plataforma.
- Modelo de servicio con el mayor control: administras la red, el sistema operativo y la configuración sobre la infraestructura del proveedor.
- Principio de precios de AWS: pagas solo por lo que usas, sin contratos largos.

#### Pay-as-you-go

> Principio de precios de AWS: pagas solo por lo que usas, sin contratos largos.

> El nombre va en inglés.

Otras opciones de la carta:

- Principio de precios de AWS: pagas menos si te comprometes a usar un recurso durante 1 o 3 años.
- Gasto de capital: inversión anticipada en activos físicos, como comprar servidores, más su mantenimiento.
- Datos que entran a AWS desde internet; no tienen costo.

#### Pagar menos al reservar

> Principio de precios de AWS: pagas menos si te comprometes a usar un recurso durante 1 o 3 años.

> En inglés, pay less by making a commitment.

Otras opciones de la carta:

- Principio de precios de AWS: pagas solo por lo que usas, sin contratos largos.
- Gasto operativo variable: pagas solo por lo que consumes.
- Datos que entran a AWS desde internet; no tienen costo.

#### Transferencia entrante

> Datos que entran a AWS desde internet; no tienen costo.

Otras opciones de la carta:

- Datos que salen de AWS hacia internet; se cobran por gigabyte.
- Ubicación física en el mundo con varias Availability Zones; se elige por cumplimiento legal, latencia y servicios disponibles.
- Uno o más centros de datos aislados dentro de una Region; cada Region tiene al menos 3 para tolerar fallos.

#### Transferencia saliente

> Datos que salen de AWS hacia internet; se cobran por gigabyte.

> Entre servicios de la misma región es gratis o de muy bajo costo.

Otras opciones de la carta:

- Datos que entran a AWS desde internet; no tienen costo.
- Ubicación física en el mundo con varias Availability Zones; se elige por cumplimiento legal, latencia y servicios disponibles.
- Uno o más centros de datos aislados dentro de una Region; cada Region tiene al menos 3 para tolerar fallos.

#### Region

> Ubicación física en el mundo con varias Availability Zones; se elige por cumplimiento legal, latencia y servicios disponibles.

> El nombre va en inglés. Es un límite geopolítico: los servicios y precios varían entre Regions.

Otras opciones de la carta:

- Uno o más centros de datos aislados dentro de una Region; cada Region tiene al menos 3 para tolerar fallos.
- Punto de presencia de la red de AWS que CloudFront usa para entregar contenido cerca de los usuarios.
- Reparto de la seguridad: AWS protege la nube (lo físico, el mantenimiento y la virtualización) y el cliente protege lo que pone en ella (datos, cifrado y accesos).

#### Availability Zone

> Uno o más centros de datos aislados dentro de una Region; cada Region tiene al menos 3 para tolerar fallos.

> El nombre va en inglés. Se abrevia AZ.

Otras opciones de la carta:

- Ubicación física en el mundo con varias Availability Zones; se elige por cumplimiento legal, latencia y servicios disponibles.
- Punto de presencia de la red de AWS que CloudFront usa para entregar contenido cerca de los usuarios.
- Reparto de la seguridad: AWS protege la nube (lo físico, el mantenimiento y la virtualización) y el cliente protege lo que pone en ella (datos, cifrado y accesos).

#### Edge location

> Punto de presencia de la red de AWS que CloudFront usa para entregar contenido cerca de los usuarios.

> En español, ubicación de borde o punto de presencia.

Otras opciones de la carta:

- Uno o más centros de datos aislados dentro de una Region; cada Region tiene al menos 3 para tolerar fallos.
- Ubicación física en el mundo con varias Availability Zones; se elige por cumplimiento legal, latencia y servicios disponibles.
- Reparto de la seguridad: AWS protege la nube (lo físico, el mantenimiento y la virtualización) y el cliente protege lo que pone en ella (datos, cifrado y accesos).

#### Shared responsibility model

> Reparto de la seguridad: AWS protege la nube (lo físico, el mantenimiento y la virtualización) y el cliente protege lo que pone en ella (datos, cifrado y accesos).

> El nombre va en inglés.

Otras opciones de la carta:

- La parte que le toca a AWS: instalaciones físicas, hardware, mantenimiento, energía, climatización y virtualización.
- La parte que le toca al cliente: sus datos, el cifrado, los accesos, la configuración de su red y sus sistemas, y su código.
- Controles que aplican a AWS y al cliente, cada uno en su capa: gestión de parches, gestión de configuración y formación.

#### Seguridad DE la nube

> La parte que le toca a AWS: instalaciones físicas, hardware, mantenimiento, energía, climatización y virtualización.

Otras opciones de la carta:

- La parte que le toca al cliente: sus datos, el cifrado, los accesos, la configuración de su red y sus sistemas, y su código.
- Controles que el cliente recibe completos de AWS, como la seguridad física de los edificios.
- Controles que aplican a AWS y al cliente, cada uno en su capa: gestión de parches, gestión de configuración y formación.

#### Seguridad EN la nube

> La parte que le toca al cliente: sus datos, el cifrado, los accesos, la configuración de su red y sus sistemas, y su código.

Otras opciones de la carta:

- La parte que le toca a AWS: instalaciones físicas, hardware, mantenimiento, energía, climatización y virtualización.
- Controles que dependen solo del cliente, como decidir quién tiene permisos sobre sus datos.
- Controles que el cliente recibe completos de AWS, como la seguridad física de los edificios.

#### Controles heredados

> Controles que el cliente recibe completos de AWS, como la seguridad física de los edificios.

Otras opciones de la carta:

- Controles que aplican a AWS y al cliente, cada uno en su capa: gestión de parches, gestión de configuración y formación.
- Controles que dependen solo del cliente, como decidir quién tiene permisos sobre sus datos.
- Componente que hace los cálculos lógicos y matemáticos y coordina los datos; en la analogía de la cocina, es el cocinero.

#### Controles compartidos

> Controles que aplican a AWS y al cliente, cada uno en su capa: gestión de parches, gestión de configuración y formación.

> Ejemplo: AWS parchea su infraestructura y tú parcheas el sistema operativo de tus instancias.

Otras opciones de la carta:

- Controles que el cliente recibe completos de AWS, como la seguridad física de los edificios.
- Controles que dependen solo del cliente, como decidir quién tiene permisos sobre sus datos.
- Componente que hace los cálculos lógicos y matemáticos y coordina los datos; en la analogía de la cocina, es el cocinero.

#### Controles del cliente

> Controles que dependen solo del cliente, como decidir quién tiene permisos sobre sus datos.

> En tus apuntes: controles específicos del cliente.

Otras opciones de la carta:

- Controles que aplican a AWS y al cliente, cada uno en su capa: gestión de parches, gestión de configuración y formación.
- Controles que el cliente recibe completos de AWS, como la seguridad física de los edificios.
- Componente que hace los cálculos lógicos y matemáticos y coordina los datos; en la analogía de la cocina, es el cocinero.

#### CPU

> Componente que hace los cálculos lógicos y matemáticos y coordina los datos; en la analogía de la cocina, es el cocinero.

Otras opciones de la carta:

- Memoria que da acceso rápido a los datos en uso; en la analogía de la cocina, es la mesa.
- Disco (HDD o SSD) que conserva los datos aunque el equipo se apague; en la analogía de la cocina, es el refrigerador.
- Tarjeta de red de un equipo, con un identificador único (MAC); en la analogía de la cocina, es el proveedor de alimentos.

#### RAM

> Memoria que da acceso rápido a los datos en uso; en la analogía de la cocina, es la mesa.

Otras opciones de la carta:

- Componente que hace los cálculos lógicos y matemáticos y coordina los datos; en la analogía de la cocina, es el cocinero.
- Disco (HDD o SSD) que conserva los datos aunque el equipo se apague; en la analogía de la cocina, es el refrigerador.
- Tarjeta de red de un equipo, con un identificador único (MAC); en la analogía de la cocina, es el proveedor de alimentos.

#### Almacenamiento persistente

> Disco (HDD o SSD) que conserva los datos aunque el equipo se apague; en la analogía de la cocina, es el refrigerador.

Otras opciones de la carta:

- Memoria que da acceso rápido a los datos en uso; en la analogía de la cocina, es la mesa.
- Componente que hace los cálculos lógicos y matemáticos y coordina los datos; en la analogía de la cocina, es el cocinero.
- Tarjeta de red de un equipo, con un identificador único (MAC); en la analogía de la cocina, es el proveedor de alimentos.

#### Product Owner

> Rol que define los requisitos del proyecto.

Otras opciones de la carta:

- Rol que guía al equipo para que logre los objetivos y requisitos del proyecto.
- Rol que diseña la infraestructura.
- Rol que diseña y escribe el código.

#### Scrum Master

> Rol que guía al equipo para que logre los objetivos y requisitos del proyecto.

Otras opciones de la carta:

- Rol que define los requisitos del proyecto.
- Rol que hace pruebas y verifica que el programa funciona.
- Rol encargado de la infraestructura donde corre el software en AWS.

#### Desarrollador

> Rol que diseña y escribe el código.

Otras opciones de la carta:

- Rol encargado de la infraestructura donde corre el software en AWS.
- Rol que hace pruebas y verifica que el programa funciona.
- Rol que diseña la infraestructura.

#### DevOps

> Rol encargado de la infraestructura donde corre el software en AWS.

Otras opciones de la carta:

- Rol que diseña la infraestructura.
- Rol que diseña y escribe el código.
- Operaciones de sistemas: garantizar que los sistemas sigan funcionando, como el intendente de un edificio.

#### QA

> Rol que hace pruebas y verifica que el programa funciona.

Otras opciones de la carta:

- Rol que diseña y escribe el código.
- Rol que guía al equipo para que logre los objetivos y requisitos del proyecto.
- Rol que define los requisitos del proyecto.

#### Arquitecto de nube

> Rol que diseña la infraestructura.

Otras opciones de la carta:

- Rol encargado de la infraestructura donde corre el software en AWS.
- Rol que define los requisitos del proyecto.
- Rol que diseña y escribe el código.

### Conceptos de Linux

#### Kernel

> Corazón del sistema operativo, con privilegios máximos para controlar el hardware.

Otras opciones de la carta:

- Intérprete que recibe y ejecuta los comandos que escribes en la consola; bash es el más común en GNU/Linux.
- Programa que se ejecuta en segundo plano, como sshd.
- Sistema Linux completo: el kernel más un conjunto de software, como Ubuntu, Red Hat, Debian o Amazon Linux.

#### Daemon

> Programa que se ejecuta en segundo plano, como sshd.

> En español, demonio. Una aplicación, en cambio, corre en primer plano.

Otras opciones de la carta:

- Número que identifica a cada proceso.
- Corazón del sistema operativo, con privilegios máximos para controlar el hardware.
- Programador de tareas repetitivas.

#### Distribución

> Sistema Linux completo: el kernel más un conjunto de software, como Ubuntu, Red Hat, Debian o Amazon Linux.

> Se abrevia distro.

Otras opciones de la carta:

- Corazón del sistema operativo, con privilegios máximos para controlar el hardware.
- Intérprete que recibe y ejecuta los comandos que escribes en la consola; bash es el más común en GNU/Linux.
- Distribución de Linux optimizada por AWS para sus instancias EC2.

#### Amazon Linux

> Distribución de Linux optimizada por AWS para sus instancias EC2.

Otras opciones de la carta:

- Sistema Linux completo: el kernel más un conjunto de software, como Ubuntu, Red Hat, Debian o Amazon Linux.
- Imagen con el sistema operativo y el software desde la que se lanza una instancia; funciona como la ISO de instalación.
- Intérprete que recibe y ejecuta los comandos que escribes en la consola; bash es el más común en GNU/Linux.

#### Shell

> Intérprete que recibe y ejecuta los comandos que escribes en la consola; bash es el más común en GNU/Linux.

> Tipos: sh (Bourne Shell, Unix), bash (Bourne-Again Shell, GNU) y ksh (Korn Shell).

Otras opciones de la carta:

- Corazón del sistema operativo, con privilegios máximos para controlar el hardware.
- Interfaz de texto (la consola) para controlar el sistema escribiendo comandos.
- Interfaz gráfica para usar el sistema con ventanas y clics.

#### Línea de comandos

> Interfaz de texto (la consola) para controlar el sistema escribiendo comandos.

> Se abrevia CLI (Command Line Interface).

Otras opciones de la carta:

- Interfaz gráfica para usar el sistema con ventanas y clics.
- Intérprete que recibe y ejecuta los comandos que escribes en la consola; bash es el más común en GNU/Linux.
- Texto antes del cursor, como user@hostname ~ $, que muestra el usuario, la máquina, la carpeta actual y el tipo de usuario ($ estándar, # root).

#### GUI

> Interfaz gráfica para usar el sistema con ventanas y clics.

> GUI significa “Graphical User Interface”.

Otras opciones de la carta:

- Interfaz de texto (la consola) para controlar el sistema escribiendo comandos.
- Intérprete que recibe y ejecuta los comandos que escribes en la consola; bash es el más común en GNU/Linux.
- Texto antes del cursor, como user@hostname ~ $, que muestra el usuario, la máquina, la carpeta actual y el tipo de usuario ($ estándar, # root).

#### Prompt

> Texto antes del cursor, como user@hostname ~ $, que muestra el usuario, la máquina, la carpeta actual y el tipo de usuario ($ estándar, # root).

Otras opciones de la carta:

- Intérprete que recibe y ejecuta los comandos que escribes en la consola; bash es el más común en GNU/Linux.
- Interfaz de texto (la consola) para controlar el sistema escribiendo comandos.
- Usuario de Linux con permisos ilimitados sobre el sistema.

#### Usuario root

> Usuario de Linux con permisos ilimitados sobre el sistema.

> Un usuario estándar solo tiene los permisos que root le otorga.

Otras opciones de la carta:

- Comando que ejecuta otro comando con privilegios de root.
- Comando para cambiar de usuario, por ejemplo de un usuario estándar a root.
- Dueño de la cuenta, con permisos ilimitados; se protege con MFA, no se le crean access keys y solo se usa para tareas administrativas.

#### sudo

> Comando que ejecuta otro comando con privilegios de root.

Otras opciones de la carta:

- Comando para cambiar de usuario, por ejemplo de un usuario estándar a root.
- Comando que cambia el dueño de un archivo; requiere ser root.
- Comando para cambiar la contraseña de un usuario.

#### su

> Comando para cambiar de usuario, por ejemplo de un usuario estándar a root.

Otras opciones de la carta:

- Comando que ejecuta otro comando con privilegios de root.
- Comando que modifica un usuario, por ejemplo para agregarlo a un grupo.
- Comando para cambiar la contraseña de un usuario.

#### passwd

> Comando para cambiar la contraseña de un usuario.

Otras opciones de la carta:

- Comando que modifica un usuario, por ejemplo para agregarlo a un grupo.
- Comando para cambiar de usuario, por ejemplo de un usuario estándar a root.
- Lectura (r), escritura (w) y ejecución (x), definidos para el dueño, el grupo y los demás.

#### usermod

> Comando que modifica un usuario, por ejemplo para agregarlo a un grupo.

Otras opciones de la carta:

- Comando que cambia el dueño de un archivo; requiere ser root.
- Comando para cambiar la contraseña de un usuario.
- Lectura (r), escritura (w) y ejecución (x), definidos para el dueño, el grupo y los demás.

#### Permisos rwx

> Lectura (r), escritura (w) y ejecución (x), definidos para el dueño, el grupo y los demás.

> ls -l los muestra; el primer carácter indica archivo (-), directorio (d) o enlace (l).

Otras opciones de la carta:

- Forma numérica de los permisos: r vale 4, w vale 2 y x vale 1; por ejemplo, rwxr-xr-- es 754.
- Comando que cambia los permisos de un archivo.
- Comando que cambia el dueño de un archivo; requiere ser root.

#### Notación octal

> Forma numérica de los permisos: r vale 4, w vale 2 y x vale 1; por ejemplo, rwxr-xr-- es 754.

Otras opciones de la carta:

- Lectura (r), escritura (w) y ejecución (x), definidos para el dueño, el grupo y los demás.
- Comando que cambia los permisos de un archivo.
- Comando que cambia el dueño de un archivo; requiere ser root.

#### chmod

> Comando que cambia los permisos de un archivo.

> Ejemplo: chmod 754 archivo.

Otras opciones de la carta:

- Comando que cambia el dueño de un archivo; requiere ser root.
- Comando que modifica un usuario, por ejemplo para agregarlo a un grupo.
- Comando que muestra el manual de otro comando.

#### chown

> Comando que cambia el dueño de un archivo; requiere ser root.

Otras opciones de la carta:

- Comando que cambia los permisos de un archivo.
- Comando que modifica un usuario, por ejemplo para agregarlo a un grupo.
- Comando que muestra el manual de otro comando.

#### man

> Comando que muestra el manual de otro comando.

Otras opciones de la carta:

- Comando que busca archivos según condiciones, como su nombre o su tamaño.
- Comando que imprime en la consola el contenido de un archivo.
- Comando que crea un archivo vacío.

#### cat

> Comando que imprime en la consola el contenido de un archivo.

Otras opciones de la carta:

- Comando que muestra las primeras líneas de un archivo.
- Comando que crea un archivo vacío.
- Comando que muestra la ruta de la carpeta en la que estás.

#### touch

> Comando que crea un archivo vacío.

> Para crear carpetas se usa mkdir.

Otras opciones de la carta:

- Comando que imprime en la consola el contenido de un archivo.
- Comando que muestra la ruta de la carpeta en la que estás.
- Directorio con los archivos de configuración del sistema.

#### pwd

> Comando que muestra la ruta de la carpeta en la que estás.

> Para moverte entre carpetas se usa cd.

Otras opciones de la carta:

- Comando que crea un archivo vacío.
- Comando que imprime en la consola el contenido de un archivo.
- Directorio con los archivos de configuración del sistema.

#### /etc

> Directorio con los archivos de configuración del sistema.

Otras opciones de la carta:

- Directorio donde se guardan los registros (logs).
- Directorio con las carpetas y archivos de los usuarios.
- Directorio virtual con información del kernel y de los procesos en tiempo real.

#### /var/log

> Directorio donde se guardan los registros (logs).

Otras opciones de la carta:

- Directorio con los archivos de configuración del sistema.
- Directorio virtual con información del kernel y de los procesos en tiempo real.
- Directorio con las carpetas y archivos de los usuarios.

#### /home

> Directorio con las carpetas y archivos de los usuarios.

Otras opciones de la carta:

- Directorio con los archivos de configuración del sistema.
- Directorio con los archivos que representan dispositivos, como los discos.
- Directorio donde se guardan los registros (logs).

#### /proc

> Directorio virtual con información del kernel y de los procesos en tiempo real.

Otras opciones de la carta:

- Directorio con los archivos que representan dispositivos, como los discos.
- Directorio donde se guardan los registros (logs).
- Directorio con los archivos de configuración del sistema.

#### /dev

> Directorio con los archivos que representan dispositivos, como los discos.

Otras opciones de la carta:

- Directorio virtual con información del kernel y de los procesos en tiempo real.
- Directorio con los archivos de configuración del sistema.
- Directorio con las carpetas y archivos de los usuarios.

#### find

> Comando que busca archivos según condiciones, como su nombre o su tamaño.

> Ejemplo: find / -name "*.log" busca desde la raíz todos los archivos .log.

Otras opciones de la carta:

- Comando que compara dos archivos y muestra sus diferencias.
- Comando que muestra el manual de otro comando.
- Comando que empaqueta varios archivos en uno y los extrae: -cvf crea el paquete y -xf lo extrae.

#### tar

> Comando que empaqueta varios archivos en uno y los extrae: -cvf crea el paquete y -xf lo extrae.

Otras opciones de la carta:

- Comando que calcula una suma de verificación para comprobar que un archivo está completo y sin cambios.
- Comando que compara dos archivos y muestra sus diferencias.
- Editor de texto de terminal con modo comando (activo por defecto) y modo inserción (se entra con i y se sale con Esc).

#### cksum

> Comando que calcula una suma de verificación para comprobar que un archivo está completo y sin cambios.

Otras opciones de la carta:

- Comando que compara dos archivos y muestra sus diferencias.
- Comando que empaqueta varios archivos en uno y los extrae: -cvf crea el paquete y -xf lo extrae.
- Editor de texto de terminal con modo comando (activo por defecto) y modo inserción (se entra con i y se sale con Esc).

#### diff

> Comando que compara dos archivos y muestra sus diferencias.

Otras opciones de la carta:

- Comando que calcula una suma de verificación para comprobar que un archivo está completo y sin cambios.
- Comando que busca archivos según condiciones, como su nombre o su tamaño.
- Editor de texto de terminal con modo comando (activo por defecto) y modo inserción (se entra con i y se sale con Esc).

#### Vim

> Editor de texto de terminal con modo comando (activo por defecto) y modo inserción (se entra con i y se sale con Esc).

Otras opciones de la carta:

- Editor de texto de terminal sencillo, sin modos.
- Número que identifica a cada proceso.
- Creación de un subproceso (proceso hijo) a partir de otro proceso.

#### Nano

> Editor de texto de terminal sencillo, sin modos.

> Gedit, en cambio, es un editor con interfaz gráfica.

Otras opciones de la carta:

- Editor de texto de terminal con modo comando (activo por defecto) y modo inserción (se entra con i y se sale con Esc).
- Número que identifica a cada proceso.
- Creación de un subproceso (proceso hijo) a partir de otro proceso.

#### PID

> Número que identifica a cada proceso.

> PID significa “Process ID”.

Otras opciones de la carta:

- Creación de un subproceso (proceso hijo) a partir de otro proceso.
- Programa que se ejecuta en segundo plano, como sshd.
- Proceso que ya terminó pero sigue en la tabla de procesos porque su proceso padre no ha recogido su estado.

#### fork

> Creación de un subproceso (proceso hijo) a partir de otro proceso.

Otras opciones de la carta:

- Número que identifica a cada proceso.
- Proceso que ya terminó pero sigue en la tabla de procesos porque su proceso padre no ha recogido su estado.
- Comando que lista los procesos que se están ejecutando.

#### Proceso zombie

> Proceso que ya terminó pero sigue en la tabla de procesos porque su proceso padre no ha recogido su estado.

> Estados de un proceso: start, ready, running, waiting, stopped y zombie.

Otras opciones de la carta:

- Programa que se ejecuta en segundo plano, como sshd.
- Creación de un subproceso (proceso hijo) a partir de otro proceso.
- Comando que lista los procesos que se están ejecutando.

#### ps

> Comando que lista los procesos que se están ejecutando.

> ps -ef muestra todos con su usuario, pstree los muestra por jerarquía y pidof da el PID de un programa, como pidof sshd.

Otras opciones de la carta:

- Comando que muestra en tiempo real los procesos ordenados por consumo de recursos.
- Comando que detiene un proceso usando su PID.
- Programador de tareas repetitivas.

#### top

> Comando que muestra en tiempo real los procesos ordenados por consumo de recursos.

Otras opciones de la carta:

- Comando que lista los procesos que se están ejecutando.
- Comando que muestra el consumo de memoria RAM.
- Comando que detiene un proceso usando su PID.

#### kill

> Comando que detiene un proceso usando su PID.

Otras opciones de la carta:

- Comando que lista los procesos que se están ejecutando.
- Comando que consulta el estado de un servicio y lo inicia, detiene, reinicia o habilita al arrancar.
- Programador de tareas repetitivas.

#### cron

> Programador de tareas repetitivas.

Otras opciones de la carta:

- Comando que programa una tarea para ejecutarse una sola vez.
- Programa que se ejecuta en segundo plano, como sshd.
- Comando que consulta el estado de un servicio y lo inicia, detiene, reinicia o habilita al arrancar.

#### at

> Comando que programa una tarea para ejecutarse una sola vez.

Otras opciones de la carta:

- Programador de tareas repetitivas.
- Comando que consulta el estado de un servicio y lo inicia, detiene, reinicia o habilita al arrancar.
- Administrador de paquetes de Amazon Linux: instala, actualiza y elimina software.

#### systemctl

> Comando que consulta el estado de un servicio y lo inicia, detiene, reinicia o habilita al arrancar.

Otras opciones de la carta:

- Comando que detiene un proceso usando su PID.
- Programador de tareas repetitivas.
- Administrador de paquetes de Amazon Linux: instala, actualiza y elimina software.

#### yum

> Administrador de paquetes de Amazon Linux: instala, actualiza y elimina software.

Otras opciones de la carta:

- Comando que descarga archivos de la web y puede reanudar descargas interrumpidas, útil con conexiones inestables.
- Comando que transfiere datos a o desde una URL; se usa para descargar y para probar APIs.
- Comando que muestra el espacio usado y libre de los discos.

#### wget

> Comando que descarga archivos de la web y puede reanudar descargas interrumpidas, útil con conexiones inestables.

Otras opciones de la carta:

- Comando que transfiere datos a o desde una URL; se usa para descargar y para probar APIs.
- Administrador de paquetes de Amazon Linux: instala, actualiza y elimina software.
- Comando que muestra el espacio usado y libre de los discos.

#### curl

> Comando que transfiere datos a o desde una URL; se usa para descargar y para probar APIs.

Otras opciones de la carta:

- Comando que descarga archivos de la web y puede reanudar descargas interrumpidas, útil con conexiones inestables.
- Administrador de paquetes de Amazon Linux: instala, actualiza y elimina software.
- Comando que muestra el espacio usado y libre de los discos.

#### df

> Comando que muestra el espacio usado y libre de los discos.

> Con -h lo muestra en unidades legibles (GB, MB).

Otras opciones de la carta:

- Comando que muestra cuánto ocupa un archivo o directorio.
- Comando que muestra el consumo de memoria RAM.
- Escala de 0 (Emergency: el sistema dejó de funcionar) a 7 (Debug: rastreo de datos) que clasifica los mensajes de los logs.

#### du

> Comando que muestra cuánto ocupa un archivo o directorio.

> Ejemplo: du -sh /var.

Otras opciones de la carta:

- Comando que muestra el espacio usado y libre de los discos.
- Comando que muestra el consumo de memoria RAM.
- Escala de 0 (Emergency: el sistema dejó de funcionar) a 7 (Debug: rastreo de datos) que clasifica los mensajes de los logs.

#### free

> Comando que muestra el consumo de memoria RAM.

> lscpu muestra la arquitectura de la CPU y vmstat el uso de memoria virtual.

Otras opciones de la carta:

- Comando que muestra el espacio usado y libre de los discos.
- Comando que muestra en tiempo real los procesos ordenados por consumo de recursos.
- Escala de 0 (Emergency: el sistema dejó de funcionar) a 7 (Debug: rastreo de datos) que clasifica los mensajes de los logs.

#### Niveles de severidad

> Escala de 0 (Emergency: el sistema dejó de funcionar) a 7 (Debug: rastreo de datos) que clasifica los mensajes de los logs.

> En orden: Emergency, Alert, Critical, Error, Warn, Notice, Info y Debug.

Otras opciones de la carta:

- Directorio donde se guardan los registros (logs).
- Comando que muestra las últimas líneas de un archivo.
- Comando que muestra las primeras líneas de un archivo.

#### head

> Comando que muestra las primeras líneas de un archivo.

Otras opciones de la carta:

- Comando que muestra las últimas líneas de un archivo.
- Comando que imprime en la consola el contenido de un archivo.
- Primera línea de un script, como #!/bin/bash, que indica con qué intérprete se ejecuta.

#### tail

> Comando que muestra las últimas líneas de un archivo.

Otras opciones de la carta:

- Comando que muestra las primeras líneas de un archivo.
- Comando que imprime en la consola el contenido de un archivo.
- Primera línea de un script, como #!/bin/bash, que indica con qué intérprete se ejecuta.

#### Shebang

> Primera línea de un script, como #!/bin/bash, que indica con qué intérprete se ejecuta.

Otras opciones de la carta:

- Intérprete que recibe y ejecuta los comandos que escribes en la consola; bash es el más común en GNU/Linux.
- Texto antes del cursor, como user@hostname ~ $, que muestra el usuario, la máquina, la carpeta actual y el tipo de usuario ($ estándar, # root).
- Protocolo cifrado para conectarse de forma remota a la terminal de una instancia.

#### SSH

> Protocolo cifrado para conectarse de forma remota a la terminal de una instancia.

Otras opciones de la carta:

- Función de Systems Manager que abre una terminal en tus instancias sin abrir el puerto SSH ni manejar llaves.
- Comando que abre una conexión a una IP y un puerto para comprobar si acepta conexiones.
- Script con instrucciones de configuración que una instancia EC2 ejecuta al arrancar por primera vez.

#### User data

> Script con instrucciones de configuración que una instancia EC2 ejecuta al arrancar por primera vez.

Otras opciones de la carta:

- Imagen con el sistema operativo y el software desde la que se lanza una instancia; funciona como la ISO de instalación.
- Primera línea de un script, como #!/bin/bash, que indica con qué intérprete se ejecuta.
- Ley de EE. UU. que regula el tratamiento de datos de salud.

#### HIPAA

> Ley de EE. UU. que regula el tratamiento de datos de salud.

Otras opciones de la carta:

- Estándar de seguridad para tratar datos de tarjetas de crédito.
- Informes de auditoría sobre los controles internos de seguridad, disponibilidad y confidencialidad de una organización.
- Corazón del sistema operativo, con privilegios máximos para controlar el hardware.

#### PCI-DSS

> Estándar de seguridad para tratar datos de tarjetas de crédito.

Otras opciones de la carta:

- Ley de EE. UU. que regula el tratamiento de datos de salud.
- Informes de auditoría sobre los controles internos de seguridad, disponibilidad y confidencialidad de una organización.
- Corazón del sistema operativo, con privilegios máximos para controlar el hardware.

### Conceptos de redes

#### Red

> Infraestructura de caminos físicos o virtuales para compartir información entre dispositivos.

Otras opciones de la carta:

- Cualquier dispositivo conectado a la red que envía o recibe información.
- Red que conecta equipos en un espacio pequeño, como una casa o una oficina.
- Dispositivo con una IP fija porque ofrece algo que otros necesitan, como una impresora.

#### Nodo

> Cualquier dispositivo conectado a la red que envía o recibe información.

Otras opciones de la carta:

- Dispositivo con una IP fija porque ofrece algo que otros necesitan, como una impresora.
- Equipo que responde a las peticiones de los clientes.
- Tarjeta de red de un equipo, con un identificador único (MAC); en la analogía de la cocina, es el proveedor de alimentos.

#### Host

> Dispositivo con una IP fija porque ofrece algo que otros necesitan, como una impresora.

Otras opciones de la carta:

- Cualquier dispositivo conectado a la red que envía o recibe información.
- Equipo que responde a las peticiones de los clientes.
- Tarjeta de red de un equipo, con un identificador único (MAC); en la analogía de la cocina, es el proveedor de alimentos.

#### NIC

> Tarjeta de red de un equipo, con un identificador único (MAC); en la analogía de la cocina, es el proveedor de alimentos.

> NIC significa “Network Interface Card”.

Otras opciones de la carta:

- Identificador físico único de la tarjeta de red, que se usa dentro de la red local (capa 2).
- Dispositivo que dirige la información de un equipo a otro dentro de la red local.
- Dispositivo que convierte señales digitales en analógicas y viceversa para dar acceso a internet.

#### Dirección MAC

> Identificador físico único de la tarjeta de red, que se usa dentro de la red local (capa 2).

Otras opciones de la carta:

- Identificador numérico asignado a un dispositivo para comunicarse en una red (capa 3).
- Número que identifica un servicio dentro de un equipo, como 80 para HTTP o 22 para SSH.
- Medio de transmisión por el que viajan pulsos de luz.

#### Dirección IP

> Identificador numérico asignado a un dispositivo para comunicarse en una red (capa 3).

Otras opciones de la carta:

- Identificador físico único de la tarjeta de red, que se usa dentro de la red local (capa 2).
- Número que identifica un servicio dentro de un equipo, como 80 para HTTP o 22 para SSH.
- Medio de transmisión por el que viajan pulsos de luz.

#### Fibra óptica

> Medio de transmisión por el que viajan pulsos de luz.

Otras opciones de la carta:

- Cable de cobre (Ethernet) por el que viajan impulsos eléctricos.
- Cable con un conductor central cubierto por capas de aislante y malla.
- Dispositivo que dirige la información de un equipo a otro dentro de la red local.

#### Par trenzado

> Cable de cobre (Ethernet) por el que viajan impulsos eléctricos.

Otras opciones de la carta:

- Cable con un conductor central cubierto por capas de aislante y malla.
- Medio de transmisión por el que viajan pulsos de luz.
- Dispositivo que dirige la información de un equipo a otro dentro de la red local.

#### Cable coaxial

> Cable con un conductor central cubierto por capas de aislante y malla.

Otras opciones de la carta:

- Cable de cobre (Ethernet) por el que viajan impulsos eléctricos.
- Medio de transmisión por el que viajan pulsos de luz.
- Dispositivo que dirige la información de un equipo a otro dentro de la red local.

#### Switch

> Dispositivo que dirige la información de un equipo a otro dentro de la red local.

> En español, conmutador. En AWS su equivalente es la subred.

Otras opciones de la carta:

- Dispositivo que interconecta redes y decide el mejor camino para enviar la información.
- Dispositivo que convierte señales digitales en analógicas y viceversa para dar acceso a internet.
- Disposición real del cableado y de los equipos de una red.

#### Router

> Dispositivo que interconecta redes y decide el mejor camino para enviar la información.

> En español, enrutador. En AWS su equivalente es la tabla de rutas.

Otras opciones de la carta:

- Dispositivo que dirige la información de un equipo a otro dentro de la red local.
- Dispositivo que convierte señales digitales en analógicas y viceversa para dar acceso a internet.
- Disposición real del cableado y de los equipos de una red.

#### Módem

> Dispositivo que convierte señales digitales en analógicas y viceversa para dar acceso a internet.

> En AWS su equivalente es el Internet Gateway.

Otras opciones de la carta:

- Dispositivo que interconecta redes y decide el mejor camino para enviar la información.
- Dispositivo que dirige la información de un equipo a otro dentro de la red local.
- Disposición real del cableado y de los equipos de una red.

#### Topología física

> Disposición real del cableado y de los equipos de una red.

Otras opciones de la carta:

- Forma en que viajan los datos por la red, sin importar cómo está el cableado.
- Topología en la que todos los equipos se conectan a un solo cable.
- Topología en la que todos los equipos se conectan a un nodo central.

#### Topología lógica

> Forma en que viajan los datos por la red, sin importar cómo está el cableado.

Otras opciones de la carta:

- Disposición real del cableado y de los equipos de una red.
- Topología en la que todos los equipos se conectan a un nodo central.
- Topología en la que todos los equipos se conectan a un solo cable.

#### Topología de bus

> Topología en la que todos los equipos se conectan a un solo cable.

Otras opciones de la carta:

- Topología en la que todos los equipos se conectan a un nodo central.
- Disposición real del cableado y de los equipos de una red.
- Red que conecta equipos en un espacio pequeño, como una casa o una oficina.

#### Topología de estrella

> Topología en la que todos los equipos se conectan a un nodo central.

> La topología híbrida combina bus y estrella.

Otras opciones de la carta:

- Topología en la que todos los equipos se conectan a un solo cable.
- Forma en que viajan los datos por la red, sin importar cómo está el cableado.
- Red que conecta equipos en un espacio pequeño, como una casa o una oficina.

#### LAN

> Red que conecta equipos en un espacio pequeño, como una casa o una oficina.

> LAN significa “Red de Área Local”.

Otras opciones de la carta:

- Red a gran escala que conecta varias redes LAN.
- Infraestructura de caminos físicos o virtuales para compartir información entre dispositivos.
- Modelo en el que un cliente consulta a un servidor central para obtener información.

#### WAN

> Red a gran escala que conecta varias redes LAN.

> WAN significa “Red de Área Amplia”.

Otras opciones de la carta:

- Red que conecta equipos en un espacio pequeño, como una casa o una oficina.
- Infraestructura de caminos físicos o virtuales para compartir información entre dispositivos.
- Modelo en el que un cliente consulta a un servidor central para obtener información.

#### Cliente-servidor

> Modelo en el que un cliente consulta a un servidor central para obtener información.

Otras opciones de la carta:

- Modelo en el que la información está distribuida entre equipos que actúan a la vez como clientes y servidores.
- Marco de referencia de 7 capas que describe cómo viajan los datos en una red.
- Capa 1 del modelo OSI: convierte los bits en señales (eléctricas o de luz) y viceversa.

#### P2P

> Modelo en el que la información está distribuida entre equipos que actúan a la vez como clientes y servidores.

> P2P significa “Peer-to-Peer”.

Otras opciones de la carta:

- Modelo en el que un cliente consulta a un servidor central para obtener información.
- Marco de referencia de 7 capas que describe cómo viajan los datos en una red.
- Capa 1 del modelo OSI: convierte los bits en señales (eléctricas o de luz) y viceversa.

#### Modelo OSI

> Marco de referencia de 7 capas que describe cómo viajan los datos en una red.

> OSI significa Open System Interconnection.

Otras opciones de la carta:

- Inicio de una conexión TCP con tres mensajes: SYN, SYN/ACK y ACK.
- Protocolo orientado a la conexión, fiable y ordenado: confirma la entrega de los datos; su encabezado es de 20 bytes.
- Capa 1 del modelo OSI: convierte los bits en señales (eléctricas o de luz) y viceversa.

#### Capa física

> Capa 1 del modelo OSI: convierte los bits en señales (eléctricas o de luz) y viceversa.

Otras opciones de la carta:

- Capa 2 del modelo OSI: conecta equipos de la misma red mediante direcciones MAC; ahí trabajan las tarjetas de red y los switches.
- Capa 3 del modelo OSI: direcciona y enruta los paquetes con direcciones IP (IPv4, IPv6).
- Capa 4 del modelo OSI: define cómo se envían los datos, en segmentos (TCP) o datagramas (UDP).

#### Capa de enlace

> Capa 2 del modelo OSI: conecta equipos de la misma red mediante direcciones MAC; ahí trabajan las tarjetas de red y los switches.

Otras opciones de la carta:

- Capa 3 del modelo OSI: direcciona y enruta los paquetes con direcciones IP (IPv4, IPv6).
- Capa 1 del modelo OSI: convierte los bits en señales (eléctricas o de luz) y viceversa.
- Capa 4 del modelo OSI: define cómo se envían los datos, en segmentos (TCP) o datagramas (UDP).

#### Capa de red

> Capa 3 del modelo OSI: direcciona y enruta los paquetes con direcciones IP (IPv4, IPv6).

Otras opciones de la carta:

- Capa 2 del modelo OSI: conecta equipos de la misma red mediante direcciones MAC; ahí trabajan las tarjetas de red y los switches.
- Capa 4 del modelo OSI: define cómo se envían los datos, en segmentos (TCP) o datagramas (UDP).
- Capa 5 del modelo OSI: establece y controla la conexión entre dos dispositivos.

#### Capa de transporte

> Capa 4 del modelo OSI: define cómo se envían los datos, en segmentos (TCP) o datagramas (UDP).

Otras opciones de la carta:

- Capa 3 del modelo OSI: direcciona y enruta los paquetes con direcciones IP (IPv4, IPv6).
- Capa 5 del modelo OSI: establece y controla la conexión entre dos dispositivos.
- Capa 6 del modelo OSI: da formato a los datos y los cifra (TLS/SSL).

#### Capa de sesión

> Capa 5 del modelo OSI: establece y controla la conexión entre dos dispositivos.

Otras opciones de la carta:

- Capa 4 del modelo OSI: define cómo se envían los datos, en segmentos (TCP) o datagramas (UDP).
- Capa 6 del modelo OSI: da formato a los datos y los cifra (TLS/SSL).
- Capa 7 del modelo OSI: la interfaz con las aplicaciones, con protocolos como HTTP, HTTPS, SSH y DNS.

#### Capa de presentación

> Capa 6 del modelo OSI: da formato a los datos y los cifra (TLS/SSL).

Otras opciones de la carta:

- Capa 5 del modelo OSI: establece y controla la conexión entre dos dispositivos.
- Capa 7 del modelo OSI: la interfaz con las aplicaciones, con protocolos como HTTP, HTTPS, SSH y DNS.
- Protocolo orientado a la conexión, fiable y ordenado: confirma la entrega de los datos; su encabezado es de 20 bytes.

#### Capa de aplicación

> Capa 7 del modelo OSI: la interfaz con las aplicaciones, con protocolos como HTTP, HTTPS, SSH y DNS.

Otras opciones de la carta:

- Capa 6 del modelo OSI: da formato a los datos y los cifra (TLS/SSL).
- Capa 4 del modelo OSI: define cómo se envían los datos, en segmentos (TCP) o datagramas (UDP).
- Protocolo orientado a la conexión, fiable y ordenado: confirma la entrega de los datos; su encabezado es de 20 bytes.

#### TCP

> Protocolo orientado a la conexión, fiable y ordenado: confirma la entrega de los datos; su encabezado es de 20 bytes.

> TCP significa “Protocolo de Control de Transmisión”.

Otras opciones de la carta:

- Protocolo sin conexión y muy rápido que envía mensajes sin verificar su entrega; su encabezado es de 8 bytes.
- Inicio de una conexión TCP con tres mensajes: SYN, SYN/ACK y ACK.
- Dirección de un recurso web formada por el protocolo (https://), el dominio y la ruta con sus parámetros.

#### UDP

> Protocolo sin conexión y muy rápido que envía mensajes sin verificar su entrega; su encabezado es de 8 bytes.

> UDP significa “Protocolo de Datagramas de Usuario”.

Otras opciones de la carta:

- Protocolo orientado a la conexión, fiable y ordenado: confirma la entrega de los datos; su encabezado es de 20 bytes.
- Protocolo de capa 3 que reporta errores de transmisión; lo usan herramientas como ping.
- Inicio de una conexión TCP con tres mensajes: SYN, SYN/ACK y ACK.

#### Enlace de tres vías

> Inicio de una conexión TCP con tres mensajes: SYN, SYN/ACK y ACK.

Otras opciones de la carta:

- Protocolo sin conexión y muy rápido que envía mensajes sin verificar su entrega; su encabezado es de 8 bytes.
- Sucesor de SSL que cifra la comunicación cliente-servidor en tránsito, como en HTTPS.
- Dirección de un recurso web formada por el protocolo (https://), el dominio y la ruta con sus parámetros.

#### URL

> Dirección de un recurso web formada por el protocolo (https://), el dominio y la ruta con sus parámetros.

> URL significa “Localizador Uniforme de Recursos”.

Otras opciones de la carta:

- Sistema que traduce nombres de dominio, como www.amazon.com, a direcciones IP.
- Identificador numérico asignado a un dispositivo para comunicarse en una red (capa 3).
- Protocolo criptográfico original para cifrar el tráfico; hoy es obsoleto.

#### SSL

> Protocolo criptográfico original para cifrar el tráfico; hoy es obsoleto.

> SSL significa “Secure Sockets Layer”.

Otras opciones de la carta:

- Sucesor de SSL que cifra la comunicación cliente-servidor en tránsito, como en HTTPS.
- Inicio de una conexión TCP con tres mensajes: SYN, SYN/ACK y ACK.
- Sistema que traduce nombres de dominio, como www.amazon.com, a direcciones IP.

#### TLS

> Sucesor de SSL que cifra la comunicación cliente-servidor en tránsito, como en HTTPS.

> TLS significa “Transport Layer Security”.

Otras opciones de la carta:

- Protocolo criptográfico original para cifrar el tráfico; hoy es obsoleto.
- Inicio de una conexión TCP con tres mensajes: SYN, SYN/ACK y ACK.
- Sistema que traduce nombres de dominio, como www.amazon.com, a direcciones IP.

#### DNS

> Sistema que traduce nombres de dominio, como www.amazon.com, a direcciones IP.

> DNS significa “Sistema de Nombres de Dominio”.

Otras opciones de la carta:

- Protocolo que asigna direcciones IP a los dispositivos de forma automática.
- Dirección de un recurso web formada por el protocolo (https://), el dominio y la ruta con sus parámetros.
- Protocolo de capa 3 que reporta errores de transmisión; lo usan herramientas como ping.

#### DHCP

> Protocolo que asigna direcciones IP a los dispositivos de forma automática.

> DHCP significa “Protocolo de Configuración Dinámica de Host”.

Otras opciones de la carta:

- Sistema que traduce nombres de dominio, como www.amazon.com, a direcciones IP.
- IP del router por la que salen los equipos hacia otras redes (por ejemplo, 10.0.0.1).
- Protocolo de capa 3 que reporta errores de transmisión; lo usan herramientas como ping.

#### ICMP

> Protocolo de capa 3 que reporta errores de transmisión; lo usan herramientas como ping.

> ICMP significa “Protocolo de Mensajes de Control de Internet”.

Otras opciones de la carta:

- Protocolo sin conexión y muy rápido que envía mensajes sin verificar su entrega; su encabezado es de 8 bytes.
- Protocolo que asigna direcciones IP a los dispositivos de forma automática.
- Comando que muestra el camino (los saltos) de un nodo a otro.

#### traceroute

> Comando que muestra el camino (los saltos) de un nodo a otro.

Otras opciones de la carta:

- Comando que combina ping y ruta: muestra cada salto hasta el destino y la pérdida de paquetes en cada uno.
- Comando que consulta el DNS para comprobar a qué IP apunta un dominio.
- Comando que envía paquetes personalizados (por ejemplo, SYN) para evaluar puertos y firewalls.

#### mtr

> Comando que combina ping y ruta: muestra cada salto hasta el destino y la pérdida de paquetes en cada uno.

Otras opciones de la carta:

- Comando que muestra el camino (los saltos) de un nodo a otro.
- Comando que envía paquetes personalizados (por ejemplo, SYN) para evaluar puertos y firewalls.
- Comando que consulta el DNS para comprobar a qué IP apunta un dominio.

#### nslookup

> Comando que consulta el DNS para comprobar a qué IP apunta un dominio.

Otras opciones de la carta:

- Comando que muestra el camino (los saltos) de un nodo a otro.
- Comando que abre una conexión a una IP y un puerto para comprobar si acepta conexiones.
- Comando que envía paquetes personalizados (por ejemplo, SYN) para evaluar puertos y firewalls.

#### hping3

> Comando que envía paquetes personalizados (por ejemplo, SYN) para evaluar puertos y firewalls.

Otras opciones de la carta:

- Comando que abre una conexión a una IP y un puerto para comprobar si acepta conexiones.
- Comando que combina ping y ruta: muestra cada salto hasta el destino y la pérdida de paquetes en cada uno.
- Número que identifica un servicio dentro de un equipo, como 80 para HTTP o 22 para SSH.

#### telnet

> Comando que abre una conexión a una IP y un puerto para comprobar si acepta conexiones.

Otras opciones de la carta:

- Comando que envía paquetes personalizados (por ejemplo, SYN) para evaluar puertos y firewalls.
- Comando que consulta el DNS para comprobar a qué IP apunta un dominio.
- Número que identifica un servicio dentro de un equipo, como 80 para HTTP o 22 para SSH.

#### Puerto

> Número que identifica un servicio dentro de un equipo, como 80 para HTTP o 22 para SSH.

Otras opciones de la carta:

- Identificador numérico asignado a un dispositivo para comunicarse en una red (capa 3).
- Identificador físico único de la tarjeta de red, que se usa dentro de la red local (capa 2).
- Dirección de 32 bits escrita en 4 bloques de 8 bits (de 0 a 255), como 10.0.0.1.

#### IPv4

> Dirección de 32 bits escrita en 4 bloques de 8 bits (de 0 a 255), como 10.0.0.1.

Otras opciones de la carta:

- Dirección de 128 bits escrita en 8 campos de 4 dígitos hexadecimales.
- Notación con barra (/16, /28) que indica el tamaño de una red y permite dividirla en subredes; /16 son 65 536 IP y /28 son 16.
- Dirección visible en internet que asigna el proveedor de internet.

#### IPv6

> Dirección de 128 bits escrita en 8 campos de 4 dígitos hexadecimales.

Otras opciones de la carta:

- Dirección de 32 bits escrita en 4 bloques de 8 bits (de 0 a 255), como 10.0.0.1.
- Identificador físico único de la tarjeta de red, que se usa dentro de la red local (capa 2).
- Dirección visible en internet que asigna el proveedor de internet.

#### IP pública

> Dirección visible en internet que asigna el proveedor de internet.

Otras opciones de la carta:

- Dirección de la red interna, aislada de internet, que asigna tu DHCP.
- La dirección 127.0.0.1, que apunta al propio equipo para hacer pruebas.
- Primera dirección de un rango, que identifica a la red (por ejemplo, 10.0.0.0).

#### IP privada

> Dirección de la red interna, aislada de internet, que asigna tu DHCP.

Otras opciones de la carta:

- Dirección visible en internet que asigna el proveedor de internet.
- La dirección 127.0.0.1, que apunta al propio equipo para hacer pruebas.
- Primera dirección de un rango, que identifica a la red (por ejemplo, 10.0.0.0).

#### Dirección de red

> Primera dirección de un rango, que identifica a la red (por ejemplo, 10.0.0.0).

Otras opciones de la carta:

- IP del router por la que salen los equipos hacia otras redes (por ejemplo, 10.0.0.1).
- Última dirección de un rango, que envía un mensaje a todos los equipos de la red.
- Clasificación tradicional por el primer octeto: A (1–126), B (128–191), C (192–223), D para multicast y E para experimentos.

#### Puerta de enlace predeterminada

> IP del router por la que salen los equipos hacia otras redes (por ejemplo, 10.0.0.1).

Otras opciones de la carta:

- Primera dirección de un rango, que identifica a la red (por ejemplo, 10.0.0.0).
- Última dirección de un rango, que envía un mensaje a todos los equipos de la red.
- Clasificación tradicional por el primer octeto: A (1–126), B (128–191), C (192–223), D para multicast y E para experimentos.

#### Dirección de difusión

> Última dirección de un rango, que envía un mensaje a todos los equipos de la red.

> También se llama dirección de broadcast o de transmisión.

Otras opciones de la carta:

- Primera dirección de un rango, que identifica a la red (por ejemplo, 10.0.0.0).
- IP del router por la que salen los equipos hacia otras redes (por ejemplo, 10.0.0.1).
- Clasificación tradicional por el primer octeto: A (1–126), B (128–191), C (192–223), D para multicast y E para experimentos.

#### Clases de IP

> Clasificación tradicional por el primer octeto: A (1–126), B (128–191), C (192–223), D para multicast y E para experimentos.

Otras opciones de la carta:

- Notación con barra (/16, /28) que indica el tamaño de una red y permite dividirla en subredes; /16 son 65 536 IP y /28 son 16.
- Dirección de 32 bits escrita en 4 bloques de 8 bits (de 0 a 255), como 10.0.0.1.
- La dirección 127.0.0.1, que apunta al propio equipo para hacer pruebas.

#### Loopback

> La dirección 127.0.0.1, que apunta al propio equipo para hacer pruebas.

Otras opciones de la carta:

- Dirección de la red interna, aislada de internet, que asigna tu DHCP.
- IP del router por la que salen los equipos hacia otras redes (por ejemplo, 10.0.0.1).
- Notación con barra (/16, /28) que indica el tamaño de una red y permite dividirla en subredes; /16 son 65 536 IP y /28 son 16.

#### CIDR

> Notación con barra (/16, /28) que indica el tamaño de una red y permite dividirla en subredes; /16 son 65 536 IP y /28 son 16.

> CIDR significa “Classless Inter-Domain Routing”.

Otras opciones de la carta:

- División de una red en segmentos más pequeños; en AWS cada una vive en una sola Availability Zone.
- Clasificación tradicional por el primer octeto: A (1–126), B (128–191), C (192–223), D para multicast y E para experimentos.
- Infraestructura de caminos físicos o virtuales para compartir información entre dispositivos.

#### Subred

> División de una red en segmentos más pequeños; en AWS cada una vive en una sola Availability Zone.

Otras opciones de la carta:

- Notación con barra (/16, /28) que indica el tamaño de una red y permite dividirla en subredes; /16 son 65 536 IP y /28 son 16.
- Red virtual privada y lógicamente aislada dentro de una región, que puede abarcar varias zonas de disponibilidad.
- Infraestructura de caminos físicos o virtuales para compartir información entre dispositivos.

### Conceptos de seguridad

#### Tríada CIA

> Los tres objetivos de la seguridad: confidencialidad, integridad y disponibilidad.

Otras opciones de la carta:

- Ciclo de vida de la seguridad: prevención, detección, análisis y respuesta, porque la seguridad no es estática.
- Que solo las personas autorizadas puedan ver la información, como el dueño de una caja fuerte.
- Que los datos no sean modificados, dañados ni borrados sin autorización.

#### Confidencialidad

> Que solo las personas autorizadas puedan ver la información, como el dueño de una caja fuerte.

Otras opciones de la carta:

- Que los datos no sean modificados, dañados ni borrados sin autorización.
- Tener acceso ininterrumpido a los sistemas y datos cuando se necesitan.
- Programa que busca infiltrarse en un sistema o dañarlo sin consentimiento.

#### Integridad

> Que los datos no sean modificados, dañados ni borrados sin autorización.

Otras opciones de la carta:

- Que solo las personas autorizadas puedan ver la información, como el dueño de una caja fuerte.
- Tener acceso ininterrumpido a los sistemas y datos cuando se necesitan.
- Programa que busca infiltrarse en un sistema o dañarlo sin consentimiento.

#### Disponibilidad

> Tener acceso ininterrumpido a los sistemas y datos cuando se necesitan.

Otras opciones de la carta:

- Que los datos no sean modificados, dañados ni borrados sin autorización.
- Que solo las personas autorizadas puedan ver la información, como el dueño de una caja fuerte.
- Programa que busca infiltrarse en un sistema o dañarlo sin consentimiento.

#### Malware

> Programa que busca infiltrarse en un sistema o dañarlo sin consentimiento.

Otras opciones de la carta:

- Ataque que intenta adivinar una contraseña probando de forma automatizada todas las combinaciones posibles.
- Ataque en el que alguien se coloca entre dos partes e intercepta su comunicación.
- Ataque desde muchos equipos que satura los recursos de un servidor (procesador, memoria) para dejarlo fuera de servicio.

#### Fuerza bruta

> Ataque que intenta adivinar una contraseña probando de forma automatizada todas las combinaciones posibles.

Otras opciones de la carta:

- Ataque desde muchos equipos que satura los recursos de un servidor (procesador, memoria) para dejarlo fuera de servicio.
- Ataque en el que alguien se coloca entre dos partes e intercepta su comunicación.
- Barrera tangible que protege la infraestructura, como cerraduras o guardias.

#### DDoS

> Ataque desde muchos equipos que satura los recursos de un servidor (procesador, memoria) para dejarlo fuera de servicio.

> DDoS significa “Distributed Denial of Service”. En AWS lo mitiga Shield.

Otras opciones de la carta:

- Ataque que intenta adivinar una contraseña probando de forma automatizada todas las combinaciones posibles.
- Ataque en el que alguien se coloca entre dos partes e intercepta su comunicación.
- Barrera tangible que protege la infraestructura, como cerraduras o guardias.

#### MITM

> Ataque en el que alguien se coloca entre dos partes e intercepta su comunicación.

> MITM significa “Man-in-the-Middle”.

Otras opciones de la carta:

- Ataque desde muchos equipos que satura los recursos de un servidor (procesador, memoria) para dejarlo fuera de servicio.
- Ataque que intenta adivinar una contraseña probando de forma automatizada todas las combinaciones posibles.
- Barrera tangible que protege la infraestructura, como cerraduras o guardias.

#### Control físico

> Barrera tangible que protege la infraestructura, como cerraduras o guardias.

Otras opciones de la carta:

- Políticas, normas y procedimientos de seguridad.
- Mecanismo tecnológico de protección, como un firewall o un algoritmo de cifrado.
- Control que evita que ocurra un incidente de seguridad.

#### Control administrativo

> Políticas, normas y procedimientos de seguridad.

Otras opciones de la carta:

- Mecanismo tecnológico de protección, como un firewall o un algoritmo de cifrado.
- Barrera tangible que protege la infraestructura, como cerraduras o guardias.
- Control que evita que ocurra un incidente de seguridad.

#### Control técnico

> Mecanismo tecnológico de protección, como un firewall o un algoritmo de cifrado.

Otras opciones de la carta:

- Barrera tangible que protege la infraestructura, como cerraduras o guardias.
- Políticas, normas y procedimientos de seguridad.
- Control que evita que ocurra un incidente de seguridad.

#### Control preventivo

> Control que evita que ocurra un incidente de seguridad.

Otras opciones de la carta:

- Control que identifica cuándo ocurrió un incidente: qué, cuándo, dónde y por qué.
- Control que repara el daño después de un incidente.
- Control alternativo cuando el principal no es posible; implica aceptar cierto nivel de riesgo.

#### Control detectivo

> Control que identifica cuándo ocurrió un incidente: qué, cuándo, dónde y por qué.

Otras opciones de la carta:

- Control que evita que ocurra un incidente de seguridad.
- Control que repara el daño después de un incidente.
- Control alternativo cuando el principal no es posible; implica aceptar cierto nivel de riesgo.

#### Control correctivo

> Control que repara el daño después de un incidente.

Otras opciones de la carta:

- Control alternativo cuando el principal no es posible; implica aceptar cierto nivel de riesgo.
- Control que identifica cuándo ocurrió un incidente: qué, cuándo, dónde y por qué.
- Control que evita que ocurra un incidente de seguridad.

#### Control compensatorio

> Control alternativo cuando el principal no es posible; implica aceptar cierto nivel de riesgo.

Otras opciones de la carta:

- Control que repara el daño después de un incidente.
- Control que evita que ocurra un incidente de seguridad.
- Control que identifica cuándo ocurrió un incidente: qué, cuándo, dónde y por qué.

#### Ciclo PDAR

> Ciclo de vida de la seguridad: prevención, detección, análisis y respuesta, porque la seguridad no es estática.

Otras opciones de la carta:

- Los tres objetivos de la seguridad: confidencialidad, integridad y disponibilidad.
- Integrar la seguridad en cada fase del desarrollo de software: requisitos y diseño, desarrollo, pruebas, y despliegue y mantenimiento.
- Malware que se replica en otros equipos y necesita que una persona lo ejecute.

#### Virus

> Malware que se replica en otros equipos y necesita que una persona lo ejecute.

Otras opciones de la carta:

- Malware que se propaga solo, explotando vulnerabilidades, hasta saturar el sistema.
- Malware disfrazado de programa legítimo.
- Malware que cifra la información para pedir un rescate.

#### Gusano

> Malware que se propaga solo, explotando vulnerabilidades, hasta saturar el sistema.

Otras opciones de la carta:

- Malware que se replica en otros equipos y necesita que una persona lo ejecute.
- Malware disfrazado de programa legítimo.
- Malware que cifra la información para pedir un rescate.

#### Troyano

> Malware disfrazado de programa legítimo.

Otras opciones de la carta:

- Malware que se replica en otros equipos y necesita que una persona lo ejecute.
- Malware que se instala a nivel del kernel para ocultar procesos y mantener el control.
- Malware que cifra la información para pedir un rescate.

#### Ransomware

> Malware que cifra la información para pedir un rescate.

Otras opciones de la carta:

- Malware que espía al usuario y recopila su información sin que lo sepa.
- Malware disfrazado de programa legítimo.
- Malware que se instala a nivel del kernel para ocultar procesos y mantener el control.

#### Spyware

> Malware que espía al usuario y recopila su información sin que lo sepa.

Otras opciones de la carta:

- Malware que cifra la información para pedir un rescate.
- Malware que se instala a nivel del kernel para ocultar procesos y mantener el control.
- Política que explica de manera formal y legal las reglas y restricciones de uso de los sistemas.

#### Rootkit

> Malware que se instala a nivel del kernel para ocultar procesos y mantener el control.

Otras opciones de la carta:

- Malware disfrazado de programa legítimo.
- Malware que espía al usuario y recopila su información sin que lo sepa.
- Política que explica de manera formal y legal las reglas y restricciones de uso de los sistemas.

#### AUP

> Política que explica de manera formal y legal las reglas y restricciones de uso de los sistemas.

> AUP significa “Acceptable Use Policy”. En español, política de uso aceptable; ataca los fallos de la psicología humana.

Otras opciones de la carta:

- Configuración mínima y estándar de seguridad que deben cumplir los sistemas.
- Políticas, normas y procedimientos de seguridad.
- Integrar la seguridad en cada fase del desarrollo de software: requisitos y diseño, desarrollo, pruebas, y despliegue y mantenimiento.

#### SDLC seguro

> Integrar la seguridad en cada fase del desarrollo de software: requisitos y diseño, desarrollo, pruebas, y despliegue y mantenimiento.

> SDLC significa Software Development Life Cycle.

Otras opciones de la carta:

- Ciclo de vida de la seguridad: prevención, detección, análisis y respuesta, porque la seguridad no es estática.
- Reducir la superficie de ataque de un sistema quitando lo innecesario y cerrando accesos.
- Ataque que mete código en los campos de texto de una aplicación para que la base de datos lo ejecute.

#### Inyección SQL

> Ataque que mete código en los campos de texto de una aplicación para que la base de datos lo ejecute.

> En AWS, WAF ayuda a bloquearla.

Otras opciones de la carta:

- Ataque que inyecta scripts que se ejecutan en el navegador de otros usuarios cuando la página muestra sus datos.
- Ataque que cambia la ruta de la URL para acceder a archivos fuera de lo permitido.
- Ataque que escribe más datos de los que caben en un espacio de memoria.

#### XSS

> Ataque que inyecta scripts que se ejecutan en el navegador de otros usuarios cuando la página muestra sus datos.

> XSS significa “Cross-Site Scripting”.

Otras opciones de la carta:

- Ataque que mete código en los campos de texto de una aplicación para que la base de datos lo ejecute.
- Ataque que escribe más datos de los que caben en un espacio de memoria.
- Ataque que cambia la ruta de la URL para acceder a archivos fuera de lo permitido.

#### Desbordamiento de búfer

> Ataque que escribe más datos de los que caben en un espacio de memoria.

Otras opciones de la carta:

- Ataque que mete código en los campos de texto de una aplicación para que la base de datos lo ejecute.
- Ataque que cambia la ruta de la URL para acceder a archivos fuera de lo permitido.
- Sistema que detecta ataques y genera alarmas.

#### Salto de directorios

> Ataque que cambia la ruta de la URL para acceder a archivos fuera de lo permitido.

Otras opciones de la carta:

- Ataque que inyecta scripts que se ejecutan en el navegador de otros usuarios cuando la página muestra sus datos.
- Ataque que mete código en los campos de texto de una aplicación para que la base de datos lo ejecute.
- Sistema que detecta ataques y genera alarmas.

#### IDS

> Sistema que detecta ataques y genera alarmas.

> IDS significa “Intrusion Detection System”.

Otras opciones de la carta:

- Sistema de detección de intrusos de red: analiza el tráfico de la red.
- Sistema de detección de intrusos de host: supervisa un equipo, por ejemplo los cambios en sus archivos.
- Comprobar quién es alguien: ¿quién eres?

#### NIDS

> Sistema de detección de intrusos de red: analiza el tráfico de la red.

Otras opciones de la carta:

- Sistema de detección de intrusos de host: supervisa un equipo, por ejemplo los cambios en sus archivos.
- Sistema que detecta ataques y genera alarmas.
- Comprobar quién es alguien: ¿quién eres?

#### HIDS

> Sistema de detección de intrusos de host: supervisa un equipo, por ejemplo los cambios en sus archivos.

Otras opciones de la carta:

- Sistema de detección de intrusos de red: analiza el tráfico de la red.
- Sistema que detecta ataques y genera alarmas.
- Comprobar quién es alguien: ¿quién eres?

#### Autenticación

> Comprobar quién es alguien: ¿quién eres?

Otras opciones de la carta:

- Determinar qué permisos tiene alguien: ¿qué puedes hacer?
- Capa extra en el inicio de sesión que combina factores: algo que sabes (PIN), algo que tienes (app autenticadora) o algo que eres (huella).
- Dar solo los permisos indispensables para una tarea, durante un tiempo definido.

#### Autorización

> Determinar qué permisos tiene alguien: ¿qué puedes hacer?

Otras opciones de la carta:

- Comprobar quién es alguien: ¿quién eres?
- Dar solo los permisos indispensables para una tarea, durante un tiempo definido.
- Capa extra en el inicio de sesión que combina factores: algo que sabes (PIN), algo que tienes (app autenticadora) o algo que eres (huella).

#### MFA

> Capa extra en el inicio de sesión que combina factores: algo que sabes (PIN), algo que tienes (app autenticadora) o algo que eres (huella).

> MFA significa “Multi-Factor Authentication”. El nombre va en inglés. Es la primera protección del root user.

Otras opciones de la carta:

- Comprobar quién es alguien: ¿quién eres?
- Dar solo los permisos indispensables para una tarea, durante un tiempo definido.
- Control de acceso en el que los permisos se asignan a roles.

#### Least privilege

> Dar solo los permisos indispensables para una tarea, durante un tiempo definido.

> El nombre va en inglés.

Otras opciones de la carta:

- Control de acceso en el que los permisos se asignan a roles.
- Determinar qué permisos tiene alguien: ¿qué puedes hacer?
- Control de acceso en el que el dueño del recurso decide quién entra.

#### RBAC

> Control de acceso en el que los permisos se asignan a roles.

> RBAC significa “Role-Based Access Control”.

Otras opciones de la carta:

- Control de acceso en el que el dueño del recurso decide quién entra.
- Dar solo los permisos indispensables para una tarea, durante un tiempo definido.
- Reducir la superficie de ataque de un sistema quitando lo innecesario y cerrando accesos.

#### DAC

> Control de acceso en el que el dueño del recurso decide quién entra.

> DAC significa “Discretionary Access Control”.

Otras opciones de la carta:

- Control de acceso en el que los permisos se asignan a roles.
- Dar solo los permisos indispensables para una tarea, durante un tiempo definido.
- Reducir la superficie de ataque de un sistema quitando lo innecesario y cerrando accesos.

#### Hardening

> Reducir la superficie de ataque de un sistema quitando lo innecesario y cerrando accesos.

> Ejemplo: en un servidor web solo se abren los puertos de HTTP y HTTPS.

Otras opciones de la carta:

- Configuración mínima y estándar de seguridad que deben cumplir los sistemas.
- Proceso para probar y aplicar de forma ordenada las actualizaciones de seguridad.
- Segmento de red que expone servicios públicos de forma controlada, separado de la red interna.

#### Línea base

> Configuración mínima y estándar de seguridad que deben cumplir los sistemas.

Otras opciones de la carta:

- Reducir la superficie de ataque de un sistema quitando lo innecesario y cerrando accesos.
- Política que explica de manera formal y legal las reglas y restricciones de uso de los sistemas.
- Proceso para probar y aplicar de forma ordenada las actualizaciones de seguridad.

#### Ciclo de vida de parches

> Proceso para probar y aplicar de forma ordenada las actualizaciones de seguridad.

Otras opciones de la carta:

- Reducir la superficie de ataque de un sistema quitando lo innecesario y cerrando accesos.
- Configuración mínima y estándar de seguridad que deben cumplir los sistemas.
- Segmento de red que expone servicios públicos de forma controlada, separado de la red interna.

#### DMZ

> Segmento de red que expone servicios públicos de forma controlada, separado de la red interna.

> DMZ significa “Zona desmilitarizada”.

Otras opciones de la carta:

- Subred sin ruta hacia un Internet Gateway, así que no tiene salida directa a internet.
- Reducir la superficie de ataque de un sistema quitando lo innecesario y cerrando accesos.
- Datos guardados en disco; se protegen con cifrado simétrico.

#### Datos en reposo

> Datos guardados en disco; se protegen con cifrado simétrico.

Otras opciones de la carta:

- Datos que viajan por la red; se protegen con TLS/SSL.
- Datos que se están procesando en la memoria RAM.
- Cifrado con una misma clave compartida para cifrar y descifrar; es rápido, pero hay que enviar la clave de forma segura (AES).

#### Datos en tránsito

> Datos que viajan por la red; se protegen con TLS/SSL.

Otras opciones de la carta:

- Datos guardados en disco; se protegen con cifrado simétrico.
- Datos que se están procesando en la memoria RAM.
- Cifrado con una misma clave compartida para cifrar y descifrar; es rápido, pero hay que enviar la clave de forma segura (AES).

#### Datos en uso

> Datos que se están procesando en la memoria RAM.

Otras opciones de la carta:

- Datos guardados en disco; se protegen con cifrado simétrico.
- Datos que viajan por la red; se protegen con TLS/SSL.
- Cifrado con una misma clave compartida para cifrar y descifrar; es rápido, pero hay que enviar la clave de forma segura (AES).

#### Cifrado simétrico

> Cifrado con una misma clave compartida para cifrar y descifrar; es rápido, pero hay que enviar la clave de forma segura (AES).

Otras opciones de la carta:

- Cifrado con una clave pública, que se comparte, para cifrar y una clave privada, que no se comparte, para descifrar (RSA, ECC).
- Combinación en la que el cifrado asimétrico intercambia la clave y el simétrico cifra los datos, como hace TLS.
- Sistema de certificados digitales y entidades que vinculan cada clave pública con su dueño.

#### Cifrado asimétrico

> Cifrado con una clave pública, que se comparte, para cifrar y una clave privada, que no se comparte, para descifrar (RSA, ECC).

Otras opciones de la carta:

- Cifrado con una misma clave compartida para cifrar y descifrar; es rápido, pero hay que enviar la clave de forma segura (AES).
- Combinación en la que el cifrado asimétrico intercambia la clave y el simétrico cifra los datos, como hace TLS.
- Sistema de certificados digitales y entidades que vinculan cada clave pública con su dueño.

#### Cifrado híbrido

> Combinación en la que el cifrado asimétrico intercambia la clave y el simétrico cifra los datos, como hace TLS.

Otras opciones de la carta:

- Cifrado con una misma clave compartida para cifrar y descifrar; es rápido, pero hay que enviar la clave de forma segura (AES).
- Cifrado con una clave pública, que se comparte, para cifrar y una clave privada, que no se comparte, para descifrar (RSA, ECC).
- Sistema de certificados digitales y entidades que vinculan cada clave pública con su dueño.

#### PKI

> Sistema de certificados digitales y entidades que vinculan cada clave pública con su dueño.

> PKI significa “Public Key Infrastructure”.

Otras opciones de la carta:

- Tercero de confianza que emite y firma los certificados digitales.
- Estándar de certificado digital que vincula una clave pública con su dueño.
- Entidad que verifica la identidad real de quien pide un certificado antes de que se emita.

#### CA

> Tercero de confianza que emite y firma los certificados digitales.

> CA significa “Certificate Authority”. En español, entidad de certificación.

Otras opciones de la carta:

- Entidad que verifica la identidad real de quien pide un certificado antes de que se emita.
- Solicitud con tu clave pública que envías para obtener un certificado firmado.
- Estándar de certificado digital que vincula una clave pública con su dueño.

#### RA

> Entidad que verifica la identidad real de quien pide un certificado antes de que se emita.

> RA significa “Registration Authority”. En español, autoridad de registro.

Otras opciones de la carta:

- Tercero de confianza que emite y firma los certificados digitales.
- Solicitud con tu clave pública que envías para obtener un certificado firmado.
- Estándar de certificado digital que vincula una clave pública con su dueño.

#### X.509

> Estándar de certificado digital que vincula una clave pública con su dueño.

Otras opciones de la carta:

- Sistema de certificados digitales y entidades que vinculan cada clave pública con su dueño.
- Solicitud con tu clave pública que envías para obtener un certificado firmado.
- Lista de certificados anulados antes de su vencimiento.

#### CRL

> Lista de certificados anulados antes de su vencimiento.

> CRL significa “Certificate Revocation List”.

Otras opciones de la carta:

- Protocolo para consultar en línea si un certificado sigue siendo válido.
- Solicitud con tu clave pública que envías para obtener un certificado firmado.
- Plan para mantener el negocio funcionando durante y después de un desastre.

#### OCSP

> Protocolo para consultar en línea si un certificado sigue siendo válido.

> OCSP significa “Online Certificate Status Protocol”.

Otras opciones de la carta:

- Lista de certificados anulados antes de su vencimiento.
- Solicitud con tu clave pública que envías para obtener un certificado firmado.
- Plan para mantener el negocio funcionando durante y después de un desastre.

#### CSR

> Solicitud con tu clave pública que envías para obtener un certificado firmado.

> CSR significa “Certificate Signing Request”.

Otras opciones de la carta:

- Lista de certificados anulados antes de su vencimiento.
- Estándar de certificado digital que vincula una clave pública con su dueño.
- Plan para mantener el negocio funcionando durante y después de un desastre.

#### BCP

> Plan para mantener el negocio funcionando durante y después de un desastre.

> BCP significa “Business Continuity Plan”.

Otras opciones de la carta:

- Plan para recuperar lo que se dañó después de un desastre.
- Tiempo máximo de inactividad aceptable hasta restablecer el servicio.
- Cantidad máxima de datos que se puede perder, medida desde la última copia de seguridad.

#### DRP

> Plan para recuperar lo que se dañó después de un desastre.

> DRP significa “Disaster Recovery Plan”.

Otras opciones de la carta:

- Plan para mantener el negocio funcionando durante y después de un desastre.
- Cantidad máxima de datos que se puede perder, medida desde la última copia de seguridad.
- Tiempo máximo de inactividad aceptable hasta restablecer el servicio.

#### RPO

> Cantidad máxima de datos que se puede perder, medida desde la última copia de seguridad.

> RPO significa “Recovery Point Objective”.

Otras opciones de la carta:

- Tiempo máximo de inactividad aceptable hasta restablecer el servicio.
- Tiempo máximo que el negocio puede sobrevivir sin funcionar.
- Tiempo para verificar que todo funciona después de recuperar los sistemas.

#### RTO

> Tiempo máximo de inactividad aceptable hasta restablecer el servicio.

> RTO significa “Recovery Time Objective”.

Otras opciones de la carta:

- Cantidad máxima de datos que se puede perder, medida desde la última copia de seguridad.
- Tiempo máximo que el negocio puede sobrevivir sin funcionar.
- Tiempo para verificar que todo funciona después de recuperar los sistemas.

#### MTD

> Tiempo máximo que el negocio puede sobrevivir sin funcionar.

> MTD significa “Maximum Tolerable Downtime”.

Otras opciones de la carta:

- Tiempo máximo de inactividad aceptable hasta restablecer el servicio.
- Tiempo para verificar que todo funciona después de recuperar los sistemas.
- Respaldo de todos los datos.

#### WRT

> Tiempo para verificar que todo funciona después de recuperar los sistemas.

> WRT significa “Work Recovery Time”.

Otras opciones de la carta:

- Tiempo máximo de inactividad aceptable hasta restablecer el servicio.
- Tiempo máximo que el negocio puede sobrevivir sin funcionar.
- Respaldo de todos los datos.

#### Copia completa

> Respaldo de todos los datos.

> En inglés, full backup.

Otras opciones de la carta:

- Respaldo que guarda solo los cambios desde la última copia de cualquier tipo.
- Respaldo que guarda los cambios acumulados desde la última copia completa.
- Estrategia de recuperación que solo restaura datos desde copias: costo muy bajo, pero RPO y RTO de días.

#### Copia incremental

> Respaldo que guarda solo los cambios desde la última copia de cualquier tipo.

Otras opciones de la carta:

- Respaldo que guarda los cambios acumulados desde la última copia completa.
- Respaldo de todos los datos.
- Estrategia de recuperación que solo restaura datos desde copias: costo muy bajo, pero RPO y RTO de días.

#### Copia diferencial

> Respaldo que guarda los cambios acumulados desde la última copia completa.

Otras opciones de la carta:

- Respaldo que guarda solo los cambios desde la última copia de cualquier tipo.
- Respaldo de todos los datos.
- Estrategia de recuperación que solo restaura datos desde copias: costo muy bajo, pero RPO y RTO de días.

#### Backup and Restore

> Estrategia de recuperación que solo restaura datos desde copias: costo muy bajo, pero RPO y RTO de días.

Otras opciones de la carta:

- Estrategia de recuperación con una réplica de lo esencial apagada hasta el desastre: costo bajo, RPO y RTO de horas.
- Estrategia de recuperación con una copia reducida siempre encendida y datos replicados de forma continua: costo medio, RPO y RTO de minutos.
- Estrategia de recuperación con una copia completa de la infraestructura funcionando a la vez: costo alto, RPO y RTO de milisegundos.

#### Luz piloto

> Estrategia de recuperación con una réplica de lo esencial apagada hasta el desastre: costo bajo, RPO y RTO de horas.

> En inglés, pilot light.

Otras opciones de la carta:

- Estrategia de recuperación con una copia reducida siempre encendida y datos replicados de forma continua: costo medio, RPO y RTO de minutos.
- Estrategia de recuperación que solo restaura datos desde copias: costo muy bajo, pero RPO y RTO de días.
- Estrategia de recuperación con una copia completa de la infraestructura funcionando a la vez: costo alto, RPO y RTO de milisegundos.

#### Warm Standby

> Estrategia de recuperación con una copia reducida siempre encendida y datos replicados de forma continua: costo medio, RPO y RTO de minutos.

Otras opciones de la carta:

- Estrategia de recuperación con una réplica de lo esencial apagada hasta el desastre: costo bajo, RPO y RTO de horas.
- Estrategia de recuperación con una copia completa de la infraestructura funcionando a la vez: costo alto, RPO y RTO de milisegundos.
- Estrategia de recuperación que solo restaura datos desde copias: costo muy bajo, pero RPO y RTO de días.

#### Multi-site activo

> Estrategia de recuperación con una copia completa de la infraestructura funcionando a la vez: costo alto, RPO y RTO de milisegundos.

Otras opciones de la carta:

- Estrategia de recuperación con una copia reducida siempre encendida y datos replicados de forma continua: costo medio, RPO y RTO de minutos.
- Estrategia de recuperación con una réplica de lo esencial apagada hasta el desastre: costo bajo, RPO y RTO de horas.
- Estrategia de recuperación que solo restaura datos desde copias: costo muy bajo, pero RPO y RTO de días.

#### NIST CSF

> Marco para gestionar y reducir los riesgos de ciberseguridad.

> NIST CSF significa “Cybersecurity Framework”.

Otras opciones de la carta:

- Informes de auditoría sobre los controles internos de seguridad, disponibilidad y confidencialidad de una organización.
- Política que explica de manera formal y legal las reglas y restricciones de uso de los sistemas.
- Los tres objetivos de la seguridad: confidencialidad, integridad y disponibilidad.

#### SOC

> Informes de auditoría sobre los controles internos de seguridad, disponibilidad y confidencialidad de una organización.

> SOC significa “System and Organization Controls”. Hay tres tipos (1, 2 y 3) y se descargan desde AWS Artifact.

Otras opciones de la carta:

- Marco para gestionar y reducir los riesgos de ciberseguridad.
- Estándar de seguridad para tratar datos de tarjetas de crédito.
- Los tres objetivos de la seguridad: confidencialidad, integridad y disponibilidad.

### Conceptos de operaciones del sistema

#### SysOps

> Operaciones de sistemas: garantizar que los sistemas sigan funcionando, como el intendente de un edificio.

> Los planos del edificio los hacen el arquitecto de nube y el desarrollador.

Otras opciones de la carta:

- Rol encargado de la infraestructura donde corre el software en AWS.
- Rol que diseña la infraestructura.
- Beneficio de automatizar: cambiar tareas hechas a mano por estándares y plantillas.

#### Reducción de errores

> Beneficio de automatizar: cambiar tareas hechas a mano por estándares y plantillas.

Otras opciones de la carta:

- Beneficio de automatizar: administrar todo con las mismas instrucciones para obtener siempre el mismo resultado.
- Beneficio de automatizar: monitorear de forma continua para detectar y evitar errores.
- Las 6 etapas de un sistema: crear, probar, implementar, supervisar, mantener y proteger.

#### Administración repetible

> Beneficio de automatizar: administrar todo con las mismas instrucciones para obtener siempre el mismo resultado.

Otras opciones de la carta:

- Beneficio de automatizar: cambiar tareas hechas a mano por estándares y plantillas.
- Beneficio de automatizar: monitorear de forma continua para detectar y evitar errores.
- Las 6 etapas de un sistema: crear, probar, implementar, supervisar, mantener y proteger.

#### Visibilidad en tiempo real

> Beneficio de automatizar: monitorear de forma continua para detectar y evitar errores.

Otras opciones de la carta:

- Beneficio de automatizar: administrar todo con las mismas instrucciones para obtener siempre el mismo resultado.
- Beneficio de automatizar: cambiar tareas hechas a mano por estándares y plantillas.
- Las 6 etapas de un sistema: crear, probar, implementar, supervisar, mantener y proteger.

#### Ciclo de vida de los sistemas

> Las 6 etapas de un sistema: crear, probar, implementar, supervisar, mantener y proteger.

Otras opciones de la carta:

- Método de 8 pasos: identificar y priorizar, categoría, descripción, síntomas, causa raíz, posibles soluciones, herramientas de validación y recomendaciones.
- Ciclo de vida de la seguridad: prevención, detección, análisis y respuesta, porque la seguridad no es estática.
- Conjunto de instrucciones secuenciales que la terminal ejecuta en orden.

#### Script de shell

> Conjunto de instrucciones secuenciales que la terminal ejecuta en orden.

Otras opciones de la carta:

- Archivo legible por humanos, en JSON o YAML, que describe el resultado deseado en lugar de los pasos.
- Definir toda la infraestructura en archivos de texto, como un plano digital, para crearla de forma automática y repetible.
- Formato de texto de pares clave-valor; es el de las políticas de IAM y el de salida predeterminado de la CLI.

#### Plantilla declarativa

> Archivo legible por humanos, en JSON o YAML, que describe el resultado deseado en lugar de los pasos.

Otras opciones de la carta:

- Conjunto de instrucciones secuenciales que la terminal ejecuta en orden.
- Definir toda la infraestructura en archivos de texto, como un plano digital, para crearla de forma automática y repetible.
- Formato de texto de pares clave-valor; es el de las políticas de IAM y el de salida predeterminado de la CLI.

#### JSON

> Formato de texto de pares clave-valor; es el de las políticas de IAM y el de salida predeterminado de la CLI.

Otras opciones de la carta:

- Formato de texto basado en la indentación, usado en plantillas de infraestructura.
- Archivo legible por humanos, en JSON o YAML, que describe el resultado deseado en lugar de los pasos.
- Definir toda la infraestructura en archivos de texto, como un plano digital, para crearla de forma automática y repetible.

#### YAML

> Formato de texto basado en la indentación, usado en plantillas de infraestructura.

Otras opciones de la carta:

- Formato de texto de pares clave-valor; es el de las políticas de IAM y el de salida predeterminado de la CLI.
- Conjunto de instrucciones secuenciales que la terminal ejecuta en orden.
- Definir toda la infraestructura en archivos de texto, como un plano digital, para crearla de forma automática y repetible.

#### Infrastructure as code

> Definir toda la infraestructura en archivos de texto, como un plano digital, para crearla de forma automática y repetible.

> El nombre va en inglés. Se abrevia IaC; en AWS se hace con CloudFormation.

Otras opciones de la carta:

- Archivo legible por humanos, en JSON o YAML, que describe el resultado deseado en lugar de los pasos.
- Conjunto de instrucciones secuenciales que la terminal ejecuta en orden.
- Comando que prepara la CLI con tu Access Key ID, tu Secret Access Key, la región predeterminada y el formato de salida.

#### aws configure

> Comando que prepara la CLI con tu Access Key ID, tu Secret Access Key, la región predeterminada y el formato de salida.

Otras opciones de la carta:

- Comando que muestra la ayuda de la CLI con todos sus servicios.
- Orden de un comando: aws, servicio, operación, parámetros y opciones, como aws ec2 run-instances.
- Identificador público de tus claves de acceso para la CLI.

#### Access Key ID

> Identificador público de tus claves de acceso para la CLI.

Otras opciones de la carta:

- Parte privada de tus claves de acceso; nunca se comparte.
- Región donde se ejecutan los comandos de la CLI cuando no indicas otra.
- Cómo muestra la CLI los resultados: json (predeterminado), table (tabla) o text (texto separado por tabulaciones).

#### Secret Access Key

> Parte privada de tus claves de acceso; nunca se comparte.

Otras opciones de la carta:

- Identificador público de tus claves de acceso para la CLI.
- Región donde se ejecutan los comandos de la CLI cuando no indicas otra.
- Cómo muestra la CLI los resultados: json (predeterminado), table (tabla) o text (texto separado por tabulaciones).

#### Región predeterminada

> Región donde se ejecutan los comandos de la CLI cuando no indicas otra.

Otras opciones de la carta:

- Cómo muestra la CLI los resultados: json (predeterminado), table (tabla) o text (texto separado por tabulaciones).
- Identificador público de tus claves de acceso para la CLI.
- Orden de un comando: aws, servicio, operación, parámetros y opciones, como aws ec2 run-instances.

#### Formato de salida

> Cómo muestra la CLI los resultados: json (predeterminado), table (tabla) o text (texto separado por tabulaciones).

Otras opciones de la carta:

- Región donde se ejecutan los comandos de la CLI cuando no indicas otra.
- Formato de texto de pares clave-valor; es el de las políticas de IAM y el de salida predeterminado de la CLI.
- Orden de un comando: aws, servicio, operación, parámetros y opciones, como aws ec2 run-instances.

#### Sintaxis de la CLI

> Orden de un comando: aws, servicio, operación, parámetros y opciones, como aws ec2 run-instances.

Otras opciones de la carta:

- Comando que muestra la ayuda de la CLI con todos sus servicios.
- Comando que prepara la CLI con tu Access Key ID, tu Secret Access Key, la región predeterminada y el formato de salida.
- Operación de la CLI de EC2 que crea instancias.

#### aws help

> Comando que muestra la ayuda de la CLI con todos sus servicios.

> También se pide por servicio u operación, como aws ec2 help.

Otras opciones de la carta:

- Comando que prepara la CLI con tu Access Key ID, tu Secret Access Key, la región predeterminada y el formato de salida.
- Orden de un comando: aws, servicio, operación, parámetros y opciones, como aws ec2 run-instances.
- Operación de la CLI de EC2 que crea instancias.

#### run-instances

> Operación de la CLI de EC2 que crea instancias.

Otras opciones de la carta:

- Operación de la CLI de EC2 que lista tus instancias y sus datos.
- Operación de la CLI de EC2 que crea un volumen de disco (EBS).
- Operación de la CLI de EC2 que crea una red virtual.

#### describe-instances

> Operación de la CLI de EC2 que lista tus instancias y sus datos.

Otras opciones de la carta:

- Operación de la CLI de EC2 que crea instancias.
- Comando que lista tus buckets o el contenido de uno.
- Operación de la CLI de EC2 que crea un volumen de disco (EBS).

#### create-volume

> Operación de la CLI de EC2 que crea un volumen de disco (EBS).

Otras opciones de la carta:

- Operación de la CLI de EC2 que crea una copia instantánea de un volumen.
- Operación de la CLI de EC2 que crea instancias.
- Operación de la CLI de EC2 que crea una red virtual.

#### create-vpc

> Operación de la CLI de EC2 que crea una red virtual.

Otras opciones de la carta:

- Operación de la CLI de EC2 que crea un volumen de disco (EBS).
- Operación de la CLI de EC2 que crea instancias.
- Operación de la CLI de EC2 que crea una copia instantánea de un volumen.

#### create-snapshot

> Operación de la CLI de EC2 que crea una copia instantánea de un volumen.

Otras opciones de la carta:

- Operación de la CLI de EC2 que crea un volumen de disco (EBS).
- Comando que copia archivos hacia, desde o entre buckets.
- Comando que lista tus buckets o el contenido de uno.

#### aws s3 ls

> Comando que lista tus buckets o el contenido de uno.

Otras opciones de la carta:

- Comando que copia archivos hacia, desde o entre buckets.
- Operación de la CLI de EC2 que lista tus instancias y sus datos.
- Operación de la CLI de Systems Manager que crea un parámetro, como una contraseña cifrada de tipo SecureString.

#### aws s3 cp

> Comando que copia archivos hacia, desde o entre buckets.

Otras opciones de la carta:

- Comando que lista tus buckets o el contenido de uno.
- Operación de la CLI de EC2 que crea una copia instantánea de un volumen.
- Operación de la CLI de Systems Manager que crea un parámetro, como una contraseña cifrada de tipo SecureString.

#### put-parameter

> Operación de la CLI de Systems Manager que crea un parámetro, como una contraseña cifrada de tipo SecureString.

Otras opciones de la carta:

- Operación de la CLI de EC2 que crea una copia instantánea de un volumen.
- Comando que prepara la CLI con tu Access Key ID, tu Secret Access Key, la región predeterminada y el formato de salida.
- Método de 8 pasos: identificar y priorizar, categoría, descripción, síntomas, causa raíz, posibles soluciones, herramientas de validación y recomendaciones.

#### Solución de problemas

> Método de 8 pasos: identificar y priorizar, categoría, descripción, síntomas, causa raíz, posibles soluciones, herramientas de validación y recomendaciones.

Otras opciones de la carta:

- Las 6 etapas de un sistema: crear, probar, implementar, supervisar, mantener y proteger.
- El origen real de un problema, no solo su síntoma.
- Operaciones de sistemas: garantizar que los sistemas sigan funcionando, como el intendente de un edificio.

#### Causa raíz

> El origen real de un problema, no solo su síntoma.

Otras opciones de la carta:

- Método de 8 pasos: identificar y priorizar, categoría, descripción, síntomas, causa raíz, posibles soluciones, herramientas de validación y recomendaciones.
- Las 6 etapas de un sistema: crear, probar, implementar, supervisar, mantener y proteger.
- Operaciones de sistemas: garantizar que los sistemas sigan funcionando, como el intendente de un edificio.

### Conceptos de arquitectura de AWS

#### CAF

> Guía de AWS con metodología y buenas prácticas para adoptar la nube, organizada en perspectivas de negocio y técnicas.

> CAF significa “Cloud Adoption Framework”.

Otras opciones de la carta:

- Conjunto de principios de diseño y 6 pilares que ayudan a evaluar una arquitectura; no se impone.
- Perspectiva técnica del CAF: los planos de la arquitectura de TI.
- Perspectiva de negocio del CAF: que la tecnología aumente ingresos, baje costos o abra nuevos mercados.

#### Perspectiva Business

> Perspectiva de negocio del CAF: que la tecnología aumente ingresos, baje costos o abra nuevos mercados.

Otras opciones de la carta:

- Perspectiva de negocio del CAF: preparar al talento humano para la nube.
- Perspectiva de negocio del CAF: asegurar que se cumplan las normas.
- Perspectiva técnica del CAF: los planos de la arquitectura de TI.

#### Perspectiva People

> Perspectiva de negocio del CAF: preparar al talento humano para la nube.

Otras opciones de la carta:

- Perspectiva de negocio del CAF: que la tecnología aumente ingresos, baje costos o abra nuevos mercados.
- Perspectiva técnica del CAF: definir las actividades de operación de cada persona.
- Perspectiva de negocio del CAF: asegurar que se cumplan las normas.

#### Perspectiva Governance

> Perspectiva de negocio del CAF: asegurar que se cumplan las normas.

Otras opciones de la carta:

- Perspectiva técnica del CAF: el control de las identidades y la protección.
- Perspectiva de negocio del CAF: que la tecnología aumente ingresos, baje costos o abra nuevos mercados.
- Perspectiva de negocio del CAF: preparar al talento humano para la nube.

#### Perspectiva Platform

> Perspectiva técnica del CAF: los planos de la arquitectura de TI.

Otras opciones de la carta:

- Perspectiva técnica del CAF: definir las actividades de operación de cada persona.
- Perspectiva técnica del CAF: el control de las identidades y la protección.
- Perspectiva de negocio del CAF: que la tecnología aumente ingresos, baje costos o abra nuevos mercados.

#### Perspectiva Security

> Perspectiva técnica del CAF: el control de las identidades y la protección.

Otras opciones de la carta:

- Perspectiva de negocio del CAF: asegurar que se cumplan las normas.
- Perspectiva técnica del CAF: los planos de la arquitectura de TI.
- Perspectiva técnica del CAF: definir las actividades de operación de cada persona.

#### Perspectiva Operations

> Perspectiva técnica del CAF: definir las actividades de operación de cada persona.

Otras opciones de la carta:

- Perspectiva de negocio del CAF: preparar al talento humano para la nube.
- Perspectiva técnica del CAF: los planos de la arquitectura de TI.
- Perspectiva técnica del CAF: el control de las identidades y la protección.

#### Well-Architected Framework

> Conjunto de principios de diseño y 6 pilares que ayudan a evaluar una arquitectura; no se impone.

Otras opciones de la carta:

- Guía de AWS con metodología y buenas prácticas para adoptar la nube, organizada en perspectivas de negocio y técnicas.
- Definir toda la infraestructura en archivos de texto, como un plano digital, para crearla de forma automática y repetible.
- Principio de diseño: la infraestructura crece o se reduce según la demanda en lugar de adivinar cuánta necesitas.

#### Dejar de suponer capacidad

> Principio de diseño: la infraestructura crece o se reduce según la demanda en lugar de adivinar cuánta necesitas.

Otras opciones de la carta:

- Principio de diseño: clonar la arquitectura completa para probarla con carga real y pagar solo el tiempo de la prueba.
- Principio de diseño: desacoplar los servicios para poder reemplazar componentes como piezas intercambiables.
- Principio de diseño: definir la infraestructura en código (CloudFormation) para crearla, cambiarla o duplicarla fácilmente.

#### Probar a escala de producción

> Principio de diseño: clonar la arquitectura completa para probarla con carga real y pagar solo el tiempo de la prueba.

Otras opciones de la carta:

- Principio de diseño: simular caídas en un entorno seguro y crear scripts que respondan al evento.
- Principio de diseño: la infraestructura crece o se reduce según la demanda en lugar de adivinar cuánta necesitas.
- Principio de diseño: definir la infraestructura en código (CloudFormation) para crearla, cambiarla o duplicarla fácilmente.

#### Automatizar para experimentar

> Principio de diseño: definir la infraestructura en código (CloudFormation) para crearla, cambiarla o duplicarla fácilmente.

Otras opciones de la carta:

- Principio de diseño: desacoplar los servicios para poder reemplazar componentes como piezas intercambiables.
- Principio de diseño: recopilar métricas y logs (por ejemplo, con CloudWatch) para tomar decisiones y prevenir cortes.
- Principio de diseño: simular caídas en un entorno seguro y crear scripts que respondan al evento.

#### Arquitectura evolutiva

> Principio de diseño: desacoplar los servicios para poder reemplazar componentes como piezas intercambiables.

Otras opciones de la carta:

- Principio de diseño: definir la infraestructura en código (CloudFormation) para crearla, cambiarla o duplicarla fácilmente.
- Principio de diseño: la infraestructura crece o se reduce según la demanda en lugar de adivinar cuánta necesitas.
- Principio de diseño: recopilar métricas y logs (por ejemplo, con CloudWatch) para tomar decisiones y prevenir cortes.

#### Arquitectura basada en datos

> Principio de diseño: recopilar métricas y logs (por ejemplo, con CloudWatch) para tomar decisiones y prevenir cortes.

Otras opciones de la carta:

- Principio de diseño: simular caídas en un entorno seguro y crear scripts que respondan al evento.
- Principio de diseño: definir la infraestructura en código (CloudFormation) para crearla, cambiarla o duplicarla fácilmente.
- Pilar que busca ejecutar y monitorear los sistemas para mejorar de forma continua, con procesos en código y cambios frecuentes y reversibles.

#### Game day

> Principio de diseño: simular caídas en un entorno seguro y crear scripts que respondan al evento.

> En español, día de pruebas.

Otras opciones de la carta:

- Principio de diseño: clonar la arquitectura completa para probarla con carga real y pagar solo el tiempo de la prueba.
- Principio de diseño: recopilar métricas y logs (por ejemplo, con CloudWatch) para tomar decisiones y prevenir cortes.
- Pilar que busca ejecutar y monitorear los sistemas para mejorar de forma continua, con procesos en código y cambios frecuentes y reversibles.

#### Excelencia operativa

> Pilar que busca ejecutar y monitorear los sistemas para mejorar de forma continua, con procesos en código y cambios frecuentes y reversibles.

Otras opciones de la carta:

- Pilar que busca que el sistema funcione correctamente y se recupere ante fallos o desastres.
- Pilar que usa los recursos justos para cumplir la demanda sin gastos extra: alcance global, serverless y experimentación.
- Pilar que busca que el sistema funcione al menor costo: modelo de consumo, medir la eficiencia y analizar gastos con etiquetas.

#### Pilar de seguridad

> Pilar que protege la información: identidades, detección, infraestructura, datos y respuesta ante incidentes.

Otras opciones de la carta:

- Pilar que busca que el sistema funcione correctamente y se recupere ante fallos o desastres.
- Pilar que busca ejecutar y monitorear los sistemas para mejorar de forma continua, con procesos en código y cambios frecuentes y reversibles.
- Perspectiva técnica del CAF: el control de las identidades y la protección.

#### Fiabilidad

> Pilar que busca que el sistema funcione correctamente y se recupere ante fallos o desastres.

> Un sistema fiable es aquel en el que no aparecen fallos en sus componentes.

Otras opciones de la carta:

- Que el sistema siga funcionando aunque falle un componente; se apoya en tolerancia a errores, escalabilidad y capacidad de recuperación.
- Pilar que usa los recursos justos para cumplir la demanda sin gastos extra: alcance global, serverless y experimentación.
- Pilar que busca ejecutar y monitorear los sistemas para mejorar de forma continua, con procesos en código y cambios frecuentes y reversibles.

#### Eficiencia del rendimiento

> Pilar que usa los recursos justos para cumplir la demanda sin gastos extra: alcance global, serverless y experimentación.

Otras opciones de la carta:

- Pilar que busca que el sistema funcione al menor costo: modelo de consumo, medir la eficiencia y analizar gastos con etiquetas.
- Pilar que busca que el sistema funcione correctamente y se recupere ante fallos o desastres.
- Pilar que busca ejecutar y monitorear los sistemas para mejorar de forma continua, con procesos en código y cambios frecuentes y reversibles.

#### Optimización de costos

> Pilar que busca que el sistema funcione al menor costo: modelo de consumo, medir la eficiencia y analizar gastos con etiquetas.

Otras opciones de la carta:

- Pilar que usa los recursos justos para cumplir la demanda sin gastos extra: alcance global, serverless y experimentación.
- Pilar que reduce el impacto ambiental de las cargas de trabajo.
- Pilar que busca ejecutar y monitorear los sistemas para mejorar de forma continua, con procesos en código y cambios frecuentes y reversibles.

#### Sostenibilidad

> Pilar que reduce el impacto ambiental de las cargas de trabajo.

Otras opciones de la carta:

- Pilar que busca que el sistema funcione al menor costo: modelo de consumo, medir la eficiencia y analizar gastos con etiquetas.
- Pilar que usa los recursos justos para cumplir la demanda sin gastos extra: alcance global, serverless y experimentación.
- Pilar que busca que el sistema funcione correctamente y se recupere ante fallos o desastres.

#### Alta disponibilidad

> Que el sistema siga funcionando aunque falle un componente; se apoya en tolerancia a errores, escalabilidad y capacidad de recuperación.

Otras opciones de la carta:

- Pilar que busca que el sistema funcione correctamente y se recupere ante fallos o desastres.
- Capacidad de completar una tarea por caminos distintos si uno falla.
- Capacidad de ampliar la infraestructura cuando crece la demanda.

#### Tolerancia a errores

> Capacidad de completar una tarea por caminos distintos si uno falla.

Otras opciones de la carta:

- Capacidad de ampliar la infraestructura cuando crece la demanda.
- Procedimientos para restablecer el servicio después de una falla.
- Que el sistema siga funcionando aunque falle un componente; se apoya en tolerancia a errores, escalabilidad y capacidad de recuperación.

#### Escalabilidad

> Capacidad de ampliar la infraestructura cuando crece la demanda.

Otras opciones de la carta:

- Capacidad de completar una tarea por caminos distintos si uno falla.
- Procedimientos para restablecer el servicio después de una falla.
- Principio de diseño: la infraestructura crece o se reduce según la demanda en lugar de adivinar cuánta necesitas.

#### Capacidad de recuperación

> Procedimientos para restablecer el servicio después de una falla.

Otras opciones de la carta:

- Capacidad de completar una tarea por caminos distintos si uno falla.
- Capacidad de ampliar la infraestructura cuando crece la demanda.
- Pilar que busca que el sistema funcione correctamente y se recupere ante fallos o desastres.

#### Pila

> Conjunto de recursos que CloudFormation crea y administra como una sola unidad a partir de una plantilla.

> En inglés, stack: los recursos se crean en orden, de abajo hacia arriba.

Otras opciones de la carta:

- Definir toda la infraestructura en archivos de texto, como un plano digital, para crearla de forma automática y repetible.
- Archivo legible por humanos, en JSON o YAML, que describe el resultado deseado en lugar de los pasos.
- Plan de soporte incluido para todos: solo foros y documentación.

#### Plan Basic

> Plan de soporte incluido para todos: solo foros y documentación.

Otras opciones de la carta:

- Plan de soporte por correo en horario laboral, con respuesta en menos de 12 horas.
- Plan de soporte 24/7 por chat, teléfono y correo, con respuesta en menos de 1 hora.
- Plan de soporte 24/7 con un TAM asignado y respuesta en menos de 15 minutos.

#### Plan Developer

> Plan de soporte por correo en horario laboral, con respuesta en menos de 12 horas.

Otras opciones de la carta:

- Plan de soporte incluido para todos: solo foros y documentación.
- Plan de soporte 24/7 por chat, teléfono y correo, con respuesta en menos de 1 hora.
- Plan de soporte 24/7 con un TAM asignado y respuesta en menos de 15 minutos.

#### Plan Business

> Plan de soporte 24/7 por chat, teléfono y correo, con respuesta en menos de 1 hora.

Otras opciones de la carta:

- Plan de soporte 24/7 con un TAM asignado y respuesta en menos de 15 minutos.
- Plan de soporte por correo en horario laboral, con respuesta en menos de 12 horas.
- Plan de soporte incluido para todos: solo foros y documentación.

#### Plan Enterprise

> Plan de soporte 24/7 con un TAM asignado y respuesta en menos de 15 minutos.

Otras opciones de la carta:

- Plan de soporte 24/7 por chat, teléfono y correo, con respuesta en menos de 1 hora.
- Plan de soporte por correo en horario laboral, con respuesta en menos de 12 horas.
- Plan de soporte incluido para todos: solo foros y documentación.

#### TAM

> Contacto técnico dedicado que AWS asigna en el plan de soporte más alto.

> TAM significa “Technical Account Manager”.

Otras opciones de la carta:

- Red de empresas socias de AWS que ofrecen consultoría especializada.
- Plan de soporte 24/7 por chat, teléfono y correo, con respuesta en menos de 1 hora.
- Guía de AWS con metodología y buenas prácticas para adoptar la nube, organizada en perspectivas de negocio y técnicas.

#### APN

> Red de empresas socias de AWS que ofrecen consultoría especializada.

> APN significa “AWS Partner Network”.

Otras opciones de la carta:

- Contacto técnico dedicado que AWS asigna en el plan de soporte más alto.
- Plan de soporte por correo en horario laboral, con respuesta en menos de 12 horas.
- Guía de AWS con metodología y buenas prácticas para adoptar la nube, organizada en perspectivas de negocio y técnicas.

### IA generativa

#### RAG

> Técnica que busca en tus documentos y luego genera la respuesta con ese contexto.

> RAG significa Retrieval-Augmented Generation: recuperar y después generar. Sirve para que el modelo se apoye en tus datos y alucine menos.

Otras opciones de la carta:

- Solo reentrenar el modelo
- Solo un prompt sin contexto
- Solo mover datos por lotes

#### Modelo fundacional

> Modelo grande ya preentrenado que se adapta a muchas tareas distintas.

> En la documentación de AWS se llama foundation model. No lo entrenas desde cero: lo adaptas.

Otras opciones de la carta:

- Un modelo lineal de una sola variable
- Una regla fija de si y no
- Una tarea programada

### Servicios AI/ML en AWS

#### Amazon Bedrock

> Servicio que te da modelos fundacionales por API, sin que montes la infraestructura.

> Lo usas cuando quieres un modelo ya entrenado, no cuando vas a entrenar el tuyo.

Otras opciones de la carta:

- Solo los cuadernos de SageMaker
- Análisis de imágenes de Rekognition
- Texto a voz de Polly

#### Amazon SageMaker

> Servicio para construir, entrenar y desplegar tus propios modelos de aprendizaje automático.

> A diferencia de Bedrock, aquí el modelo lo preparas tú: datos, entrenamiento y despliegue.

Otras opciones de la carta:

- Solo el chat de Bedrock
- Solo el análisis de texto de Comprehend
- Solo la lectura de documentos de Textract

## Preguntas de examen

Una sola respuesta es correcta. Está marcada. El resto son las otras opciones.

### Servicios de cómputo

#### 1. ¿Qué significan las siglas EC2?

> ¿Qué significan las siglas EC2?

- Elastic Block Store
- Elastic File System
- Elastic Compute Cloud **(correcta)**
- Base de datos nosql

> A. Elastic Block Store: No es correcta porque es el nombre completo de EBS, no de EC2.
> B. Elastic File System: No es correcta porque es el nombre completo de EFS, no de EC2.
> C. Elastic Compute Cloud: EC2 corresponde a “Elastic Compute Cloud”, el nombre completo de sus siglas.
> D. Base de datos nosql: No es correcta porque no corresponde al significado oficial de esas siglas.

#### 2. ¿Cuál es la función principal de Amazon Elastic Compute Cloud (Amazon EC2)?

> ¿Cuál es la función principal de Amazon Elastic Compute Cloud (Amazon EC2)?

- Permite lanzar y ejecutar servidores virtuales llamados instancias, con capacidad de cómputo configurable. **(correcta)**
- Ejecuta código en respuesta a eventos sin que tengas que administrar directamente los servidores; AWS gestiona la infraestructura subyacente.
- Es una base de datos NoSQL administrada que admite modelos de datos clave-valor y documentos.
- Permite definir una red virtual aislada en AWS, con subredes, rutas y controles de tráfico.

> A. Sí. Permite lanzar y ejecutar servidores virtuales llamados instancias, con capacidad de cómputo configurable.
> B. No. Esa es la función de AWS Lambda.
> C. No. Esa es la función de Amazon DynamoDB.
> D. No. Esa es la función de Amazon Virtual Private Cloud (Amazon VPC).

#### 3. ¿Cuáles son las siglas correspondientes a “Elastic Compute Cloud”?

> ¿Cuáles son las siglas correspondientes a “Elastic Compute Cloud”?

- AMI
- EC2 **(correcta)**
- S3
- EBS

> A. AMI: no. AMI significa “Amazon Machine Image”, no “Elastic Compute Cloud”.
> B. EC2: sí. Es la abreviatura oficial de “Elastic Compute Cloud”.
> C. S3: no. S3 significa “Simple Storage Service”, no “Elastic Compute Cloud”.
> D. EBS: no. EBS significa “Elastic Block Store”, no “Elastic Compute Cloud”.

#### 4. Necesitas una máquina virtual para instalar y ejecutar una aplicación web con control sobr

> Necesitas una máquina virtual para instalar y ejecutar una aplicación web con control sobre el sistema operativo. ¿Qué servicio de AWS usas?

- Amazon Simple Storage Service (Amazon S3)
- Amazon Elastic Compute Cloud (Amazon EC2) **(correcta)**
- AWS Identity and Access Management (IAM)
- Amazon Simple Notification Service (Amazon SNS)

> A. No. Ese servicio sirve para guardar archivos y respaldos en buckets.
> B. Sí. Amazon Elastic Compute Cloud (Amazon EC2) es apropiado porque permite lanzar y ejecutar servidores virtuales llamados instancias, con capacidad de cómputo configurable.
> C. No. Ese servicio sirve para decidir quién puede hacer qué.
> D. No. Ese servicio sirve para enviar notificaciones.

#### 5. ¿Qué significan las siglas AMI?

> ¿Qué significan las siglas AMI?

- Elastic File System
- Base de datos nosql
- Amazon Machine Image **(correcta)**
- Relational Database Service

> A. Elastic File System: No es correcta porque es el nombre completo de EFS, no de AMI.
> B. Base de datos nosql: No es correcta porque no corresponde al significado oficial de esas siglas.
> C. Amazon Machine Image: AMI corresponde a “Amazon Machine Image”, el nombre completo de sus siglas.
> D. Relational Database Service: No es correcta porque es el nombre completo de RDS, no de AMI.

#### 6. ¿Cuál es la función principal de Amazon Machine Image (AMI)?

> ¿Cuál es la función principal de Amazon Machine Image (AMI)?

- Almacena y recupera objetos, como imágenes, documentos, respaldos y archivos estáticos, dentro de buckets.
- Facilita configurar, operar y escalar bases de datos relacionales administradas.
- Es una red de entrega de contenido (CDN) que distribuye contenido a usuarios desde ubicaciones cercanas para reducir latencia.
- Es una plantilla que contiene información necesaria para lanzar una instancia EC2, como el sistema operativo y la configuración inicial. **(correcta)**

> A. No. Esa es la función de Amazon Simple Storage Service (Amazon S3).
> B. No. Esa es la función de Amazon Relational Database Service (Amazon RDS).
> C. No. Esa es la función de Amazon CloudFront.
> D. Sí. Es una plantilla que contiene información necesaria para lanzar una instancia EC2, como el sistema operativo y la configuración inicial.

#### 7. ¿Cuáles son las siglas correspondientes a “Amazon Machine Image”?

> ¿Cuáles son las siglas correspondientes a “Amazon Machine Image”?

- EC2
- S3
- AMI **(correcta)**
- EBS

> A. EC2: no. EC2 significa “Elastic Compute Cloud”, no “Amazon Machine Image”.
> B. S3: no. S3 significa “Simple Storage Service”, no “Amazon Machine Image”.
> C. AMI: sí. Es la abreviatura oficial de “Amazon Machine Image”.
> D. EBS: no. EBS significa “Elastic Block Store”, no “Amazon Machine Image”.

#### 8. Quieres lanzar varias instancias EC2 con la misma imagen base y configuración inicial. ¿Qu

> Quieres lanzar varias instancias EC2 con la misma imagen base y configuración inicial. ¿Qué servicio de AWS usas?

- Amazon Machine Image (AMI) **(correcta)**
- Amazon Elastic Block Store (Amazon EBS)
- AWS Key Management Service (AWS KMS)
- AWS Artifact

> A. Sí. Amazon Machine Image (AMI) es apropiado porque es una plantilla que contiene información necesaria para lanzar una instancia EC2, como el sistema operativo y la configuración inicial.
> B. No. Ese servicio sirve para dar un disco a una instancia.
> C. No. Ese servicio sirve para crear y cuidar claves de cifrado.
> D. No. Ese servicio sirve para consultar informes de cumplimiento.

#### 9. ¿Cómo aparece Lambda en la documentación de AWS?

> ¿Cómo aparece Lambda en la documentación de AWS?

- Amazon Elastic File System (Amazon EFS)
- Amazon DynamoDB
- AWS Lambda **(correcta)**
- Amazon Relational Database Service (Amazon RDS)

> A. Amazon Elastic File System (Amazon EFS): No es correcta porque corresponde a EFS, no a Lambda.
> B. Amazon DynamoDB: No es correcta porque corresponde a DynamoDB, no a Lambda.
> C. AWS Lambda: El nombre oficial en inglés es “AWS Lambda”.
> D. Amazon Relational Database Service (Amazon RDS): No es correcta porque corresponde a RDS, no a Lambda.

#### 10. ¿Cuál es la función principal de AWS Lambda?

> ¿Cuál es la función principal de AWS Lambda?

- Ejecuta código en respuesta a eventos sin que tengas que administrar directamente los servidores; AWS gestiona la infraestructura subyacente. **(correcta)**
- Proporciona volúmenes de almacenamiento en bloques que pueden asociarse a instancias EC2 compatibles.
- Permite administrar identidades y permisos para controlar quién puede acceder a los recursos de AWS y qué acciones puede realizar.
- Es un servicio DNS escalable que permite dirigir consultas de nombres de dominio a recursos o endpoints.

> A. Sí. Ejecuta código en respuesta a eventos sin que tengas que administrar directamente los servidores; AWS gestiona la infraestructura subyacente.
> B. No. Esa es la función de Amazon Elastic Block Store (Amazon EBS).
> C. No. Esa es la función de AWS Identity and Access Management (IAM).
> D. No. Esa es la función de Amazon Route 53.

#### 11. ¿Para qué sirve AWS Lambda?

> ¿Para qué sirve AWS Lambda?

- Ejecuta código en respuesta a eventos sin que tengas que administrar directamente los servidores; AWS gestiona la infraestructura subyacente. **(correcta)**
- Proporciona volúmenes de almacenamiento en bloques que pueden asociarse a instancias EC2 compatibles.
- Permite administrar identidades y permisos para controlar quién puede acceder a los recursos de AWS y qué acciones puede realizar.
- Es un servicio DNS escalable que permite dirigir consultas de nombres de dominio a recursos o endpoints.

> A. Sí. Ejecuta código en respuesta a eventos sin que tengas que administrar directamente los servidores; AWS gestiona la infraestructura subyacente.
> B. No. Eso es otro servicio. Lambda no hace eso.
> C. No. Eso es otro servicio. Lambda no hace eso.
> D. No. Eso es otro servicio. Lambda no hace eso.

#### 12. Quieres ejecutar una función cuando se carga un archivo en S3, sin mantener un servidor fu

> Quieres ejecutar una función cuando se carga un archivo en S3, sin mantener un servidor funcionando todo el tiempo. ¿Qué servicio de AWS usas?

- Amazon Elastic File System (Amazon EFS)
- Amazon Virtual Private Cloud (Amazon VPC)
- AWS Lambda **(correcta)**
- AWS Command Line Interface (AWS CLI)

> A. No. Ese servicio sirve para compartir archivos entre varios servidores.
> B. No. Ese servicio sirve para definir tu red privada en AWS.
> C. Sí. AWS Lambda es apropiado porque ejecuta código en respuesta a eventos sin que tengas que administrar directamente los servidores; AWS gestiona la infraestructura subyacente.
> D. No. Ese servicio sirve para operar AWS desde la terminal.

#### 13. Quieres una base de datos en AWS y vas a administrar tú el sistema operativo de esa máquin

> Quieres una base de datos en AWS y vas a administrar tú el sistema operativo de esa máquina, incluidos parches y actualizaciones. ¿Qué servicio usas?

- Amazon EC2, e instalas la base tú **(correcta)**
- Amazon DynamoDB
- Amazon Aurora
- Amazon DocumentDB

> En EC2 la máquina es tuya: el sistema operativo invitado, los parches y la base que instales. DynamoDB, Aurora y DocumentDB son administrados: AWS se encarga de ese sistema operativo.

#### 14. Quieres usar capacidad de EC2 que AWS no está usando en ese momento, y aceptar que te la p

> Quieres usar capacidad de EC2 que AWS no está usando en ese momento, y aceptar que te la puedan quitar, a cambio de un descuento grande frente a On-Demand. ¿Qué opción de compra es? El nombre va en inglés.

- Convertible Reserved Instance
- Dedicated Host
- Spot **(correcta)**
- Standard Reserved Instance

> Spot usa capacidad sobrante. En la guía del curso el descuento llega hasta el 90 % frente a On-Demand, y AWS puede recuperarla con aviso de 2 minutos. Reserved es un compromiso de 1 o 3 años. Dedicated Host es un servidor físico para ti, no un descuento por capacidad sobrante.

#### 15. La base corre todos los días, con el mismo tamaño, y así seguirá los próximos tres años. Q

> La base corre todos los días, con el mismo tamaño, y así seguirá los próximos tres años. Quieres pagar menos que On-Demand a cambio de ese compromiso. ¿Qué opción de EC2 encaja? El nombre va en inglés.

- Dedicated Host, porque siempre es la opción más barata
- Reserved Instance **(correcta)**
- Spot
- On-Demand, porque el uso estable sale más barato así

> Reserved es el compromiso de 1 o 3 años para un uso estable. En la guía del curso el ahorro llega hasta el 72 % frente a On-Demand. Spot puede interrumpirse: no sirve para una base que no puede parar. Dedicated Host es un servidor físico aparte, no el descuento por uso predecible.

#### 16. Cuando un archivo llega a un bucket quieres ejecutar un código corto y no dejar un servido

> Cuando un archivo llega a un bucket quieres ejecutar un código corto y no dejar un servidor encendido esperando. ¿Qué servicio usas?

- Una instancia EC2 encendida todo el día
- Amazon EFS
- AWS Artifact
- AWS Lambda **(correcta)**

> Lambda corre el código cuando ocurre el evento y no administras un servidor. EC2 sería esa máquina encendida. EFS es un sistema de archivos compartido. Artifact guarda informes de cumplimiento.

#### 17. Quieres mudar los servidores de la oficina a AWS tal como están, sin reescribir la aplicac

> Quieres mudar los servidores de la oficina a AWS tal como están, sin reescribir la aplicación. ¿Qué servicio hace ese traslado?

- AWS Application Migration Service **(correcta)**
- AWS Lambda, reescribiendo cada programa
- AWS Database Migration Service
- Amazon CloudFront

> Application Migration Service replica los servidores y los levanta en EC2 sin que cambies el programa. Lambda pide otro diseño, por funciones. DMS mueve bases, no el servidor completo. CloudFront solo entrega contenido.

#### 18. A mediodía el tráfico se triplica y en la noche casi desaparece. No quieres pagar todo el 

> A mediodía el tráfico se triplica y en la noche casi desaparece. No quieres pagar todo el día los servidores del mediodía. ¿Qué configuras?

- Una instancia enorme encendida las 24 horas
- Solo instancias Spot, sin un mínimo
- Apagar la aplicación en las horas pico
- Un grupo de Auto Scaling **(correcta)**

> Auto Scaling agrega instancias cuando sube el tráfico y las quita cuando baja. Una instancia fija del tamaño del pico se paga aunque no haya nadie. Spot puede interrumpirse y, sin un mínimo, te puedes quedar sin capacidad. Apagar la tienda en la hora pico pierde ventas.

#### 19. El equipo quiere subir la aplicación web y que AWS arme el balanceador, el escalado y los 

> El equipo quiere subir la aplicación web y que AWS arme el balanceador, el escalado y los servidores. No quieren diseñar cada pieza a mano. ¿Qué usas?

- AWS Artifact
- Amazon S3 Glacier
- AWS Elastic Beanstalk **(correcta)**
- Armar a mano la VPC, el balanceador y cada instancia

> Elastic Beanstalk recibe tu aplicación y crea por ti el entorno: capacidad, balanceo y escalado. Hacerlo pieza por pieza sirve, pero es justo lo que este equipo no quiere. Artifact entrega informes de cumplimiento. Glacier guarda archivos.

#### 20. La aplicación ya está en contenedores. Quieres correrlos y no encargarte de las instancias

> La aplicación ya está en contenedores. Quieres correrlos y no encargarte de las instancias donde viven. ¿Qué opción encaja?

- AWS Artifact
- AWS Fargate **(correcta)**
- EC2, y tú administras cada servidor del clúster
- Amazon S3

> Fargate corre los contenedores sin que tú administres los servidores. En EC2 el clúster es tuyo: parches, capacidad y el sistema. S3 guarda objetos. Artifact guarda informes.

#### 21. La app debe decir si una foto trae un producto o un rostro. No quieres entrenar un modelo 

> La app debe decir si una foto trae un producto o un rostro. No quieres entrenar un modelo ni administrar servidores. ¿Qué servicio usas?

- Amazon Transcribe
- Amazon Rekognition **(correcta)**
- Amazon Comprehend
- Amazon Polly

> Rekognition analiza imágenes: objetos y rostros, sin que entrenes un modelo. Comprehend lee texto. Polly convierte texto en voz. Transcribe convierte audio en texto.

### Servicios de almacenamiento

#### 1. ¿Qué significan las siglas S3?

> ¿Qué significan las siglas S3?

- Relational Database Service
- Identity and Access Management
- Simple Storage Service **(correcta)**
- Key Management Service

> A. Relational Database Service: No es correcta porque es el nombre completo de RDS, no de S3.
> B. Identity and Access Management: No es correcta porque es el nombre completo de IAM, no de S3.
> C. Simple Storage Service: S3 corresponde a “Simple Storage Service”, el nombre completo de sus siglas.
> D. Key Management Service: No es correcta porque es el nombre completo de KMS, no de S3.

#### 2. ¿Cuál es la función principal de Amazon Simple Storage Service (Amazon S3)?

> ¿Cuál es la función principal de Amazon Simple Storage Service (Amazon S3)?

- Ofrece un sistema de archivos administrado y escalable que puede compartirse entre múltiples recursos compatibles.
- Permite crear y administrar claves criptográficas y controlar su uso para cifrar datos en servicios compatibles.
- Almacena y recupera objetos, como imágenes, documentos, respaldos y archivos estáticos, dentro de buckets. **(correcta)**
- Es un servicio de mensajería pub/sub que distribuye notificaciones a suscriptores mediante protocolos o destinos compatibles.

> A. No. Esa es la función de Amazon Elastic File System (Amazon EFS).
> B. No. Esa es la función de AWS Key Management Service (AWS KMS).
> C. Sí. Almacena y recupera objetos, como imágenes, documentos, respaldos y archivos estáticos, dentro de buckets.
> D. No. Esa es la función de Amazon Simple Notification Service (Amazon SNS).

#### 3. ¿Cuáles son las siglas correspondientes a “Simple Storage Service”?

> ¿Cuáles son las siglas correspondientes a “Simple Storage Service”?

- S3 **(correcta)**
- EC2
- AMI
- EBS

> A. S3: sí. Es la abreviatura oficial de “Simple Storage Service”.
> B. EC2: no. EC2 significa “Elastic Compute Cloud”, no “Simple Storage Service”.
> C. AMI: no. AMI significa “Amazon Machine Image”, no “Simple Storage Service”.
> D. EBS: no. EBS significa “Elastic Block Store”, no “Simple Storage Service”.

#### 4. Necesitas almacenar imágenes, documentos y respaldos en buckets y recuperarlos cuando se s

> Necesitas almacenar imágenes, documentos y respaldos en buckets y recuperarlos cuando se soliciten. ¿Qué servicio de AWS usas?

- Amazon Simple Storage Service (Amazon S3) **(correcta)**
- Amazon DynamoDB
- Amazon CloudFront
- AWS Shield

> A. Sí. Amazon Simple Storage Service (Amazon S3) es apropiado porque almacena y recupera objetos, como imágenes, documentos, respaldos y archivos estáticos, dentro de buckets.
> B. No. Ese servicio sirve para guardar datos NoSQL.
> C. No. Ese servicio sirve para acercar el contenido a quien lo consulta.
> D. No. Ese servicio sirve para absorber ataques de denegación de servicio.

#### 5. ¿Qué significan las siglas EBS?

> ¿Qué significan las siglas EBS?

- Elastic Block Store **(correcta)**
- Identity and Access Management
- Key Management Service
- Virtual Private Cloud

> A. Elastic Block Store: EBS corresponde a “Elastic Block Store”, el nombre completo de sus siglas.
> B. Identity and Access Management: No es correcta porque es el nombre completo de IAM, no de EBS.
> C. Key Management Service: No es correcta porque es el nombre completo de KMS, no de EBS.
> D. Virtual Private Cloud: No es correcta porque es el nombre completo de VPC, no de EBS.

#### 6. ¿Cuál es la función principal de Amazon Elastic Block Store (Amazon EBS)?

> ¿Cuál es la función principal de Amazon Elastic Block Store (Amazon EBS)?

- Proporciona volúmenes de almacenamiento en bloques que pueden asociarse a instancias EC2 compatibles. **(correcta)**
- Es una base de datos NoSQL administrada que admite modelos de datos clave-valor y documentos.
- Permite definir una red virtual aislada en AWS, con subredes, rutas y controles de tráfico.
- Proporciona acceso bajo demanda a informes de cumplimiento, documentos de seguridad y acuerdos relacionados con AWS.

> A. Sí. Proporciona volúmenes de almacenamiento en bloques que pueden asociarse a instancias EC2 compatibles.
> B. No. Esa es la función de Amazon DynamoDB.
> C. No. Esa es la función de Amazon Virtual Private Cloud (Amazon VPC).
> D. No. Esa es la función de AWS Artifact.

#### 7. ¿Cuáles son las siglas correspondientes a “Elastic Block Store”?

> ¿Cuáles son las siglas correspondientes a “Elastic Block Store”?

- EC2
- EBS **(correcta)**
- AMI
- S3

> A. EC2: no. EC2 significa “Elastic Compute Cloud”, no “Elastic Block Store”.
> B. EBS: sí. Es la abreviatura oficial de “Elastic Block Store”.
> C. AMI: no. AMI significa “Amazon Machine Image”, no “Elastic Block Store”.
> D. S3: no. S3 significa “Simple Storage Service”, no “Elastic Block Store”.

#### 8. Una instancia EC2 necesita un volumen de disco persistente para su sistema operativo y dat

> Una instancia EC2 necesita un volumen de disco persistente para su sistema operativo y datos. ¿Qué servicio de AWS usas?

- Amazon Relational Database Service (Amazon RDS)
- Amazon Route 53
- AWS WAF (AWS Web Application Firewall)
- Amazon Elastic Block Store (Amazon EBS) **(correcta)**

> A. No. Ese servicio sirve para operar una base de datos relacional.
> B. No. Ese servicio sirve para resolver nombres de dominio.
> C. No. Ese servicio sirve para filtrar tráfico web malicioso.
> D. Sí. Amazon Elastic Block Store (Amazon EBS) es apropiado porque proporciona volúmenes de almacenamiento en bloques que pueden asociarse a instancias EC2 compatibles.

#### 9. ¿Qué significan las siglas EFS?

> ¿Qué significan las siglas EFS?

- Key Management Service
- Elastic File System **(correcta)**
- Virtual Private Cloud
- Distribución de contenido

> A. Key Management Service: No es correcta porque es el nombre completo de KMS, no de EFS.
> B. Elastic File System: EFS corresponde a “Elastic File System”, el nombre completo de sus siglas.
> C. Virtual Private Cloud: No es correcta porque es el nombre completo de VPC, no de EFS.
> D. Distribución de contenido: No es correcta porque no corresponde al significado oficial de esas siglas.

#### 10. ¿Cuál es la función principal de Amazon Elastic File System (Amazon EFS)?

> ¿Cuál es la función principal de Amazon Elastic File System (Amazon EFS)?

- Facilita configurar, operar y escalar bases de datos relacionales administradas.
- Es una red de entrega de contenido (CDN) que distribuye contenido a usuarios desde ubicaciones cercanas para reducir latencia.
- Permite interactuar con servicios de AWS mediante comandos desde una terminal o scripts.
- Ofrece un sistema de archivos administrado y escalable que puede compartirse entre múltiples recursos compatibles. **(correcta)**

> A. No. Esa es la función de Amazon Relational Database Service (Amazon RDS).
> B. No. Esa es la función de Amazon CloudFront.
> C. No. Esa es la función de AWS Command Line Interface (AWS CLI).
> D. Sí. Ofrece un sistema de archivos administrado y escalable que puede compartirse entre múltiples recursos compatibles.

#### 11. ¿Cuáles son las siglas correspondientes a “Elastic File System”?

> ¿Cuáles son las siglas correspondientes a “Elastic File System”?

- EC2
- EFS **(correcta)**
- AMI
- S3

> A. EC2: no. EC2 significa “Elastic Compute Cloud”, no “Elastic File System”.
> B. EFS: sí. Es la abreviatura oficial de “Elastic File System”.
> C. AMI: no. AMI significa “Amazon Machine Image”, no “Elastic File System”.
> D. S3: no. S3 significa “Simple Storage Service”, no “Elastic File System”.

#### 12. Varias instancias Linux necesitan acceder simultáneamente a los mismos archivos compartido

> Varias instancias Linux necesitan acceder simultáneamente a los mismos archivos compartidos. ¿Qué servicio de AWS usas?

- Amazon Elastic File System (Amazon EFS) **(correcta)**
- AWS Identity and Access Management (IAM)
- Amazon Simple Notification Service (Amazon SNS)
- Amazon GuardDuty

> A. Sí. Amazon Elastic File System (Amazon EFS) es apropiado porque ofrece un sistema de archivos administrado y escalable que puede compartirse entre múltiples recursos compatibles.
> B. No. Ese servicio sirve para decidir quién puede hacer qué.
> C. No. Ese servicio sirve para enviar notificaciones.
> D. No. Ese servicio sirve para detectar actividad sospechosa en la cuenta.

#### 13. Quieres guardar respaldos y los archivos de un sitio estático, como objetos, y leerlos cua

> Quieres guardar respaldos y los archivos de un sitio estático, como objetos, y leerlos cuando haga falta. ¿Qué servicio usas?

- Amazon EFS
- Amazon RDS
- Amazon S3 **(correcta)**
- Amazon EBS

> S3 guarda objetos en buckets: respaldos, archivos y el sitio estático. EBS es el disco de una instancia. EFS es un sistema de archivos que varias instancias Linux montan. RDS es una base relacional, no un almacén de archivos.

#### 14. Tu tienda corre en una instancia EC2. El disco de esa máquina tiene que seguir ahí si la a

> Tu tienda corre en una instancia EC2. El disco de esa máquina tiene que seguir ahí si la apagas, y solo esa instancia lo usa. ¿Qué almacenamiento pides?

- Amazon EBS, un disco para esa instancia **(correcta)**
- Amazon S3, como disco de la instancia
- Amazon EFS, aunque solo la use una máquina
- Amazon S3 Glacier, para leerlo en cada pedido

> EBS es el disco de una instancia: lo conserva si la detienes y no lo comparten otras. S3 guarda objetos, no es el disco del sistema. EFS lo montan varias instancias a la vez. Glacier es para archivos que casi no abres.

#### 15. Tres instancias Linux de la misma aplicación tienen que leer y escribir los mismos archivo

> Tres instancias Linux de la misma aplicación tienen que leer y escribir los mismos archivos al mismo tiempo. ¿Dónde los pones?

- Un disco EBS enganchado a las tres
- El disco local de una sola instancia
- Amazon RDS
- Amazon EFS **(correcta)**

> EFS es un sistema de archivos que varias instancias Linux montan a la vez. Un disco EBS se engancha a una instancia en una zona. El disco local se pierde con esa máquina. RDS guarda tablas, no esos archivos.

#### 16. Guardas las facturas del año. Las abren una vez al mes, pero cuando las piden tienen que v

> Guardas las facturas del año. Las abren una vez al mes, pero cuando las piden tienen que verse al momento. Quieres pagar menos que por archivos de uso diario. ¿Qué clase de S3 encaja?

- S3 Glacier, aunque tarde horas en entregarla
- Amazon EBS
- S3 Standard-Infrequent Access **(correcta)**
- S3 Standard, la de uso diario

> Standard-IA es para datos que se leen poco y aun así se entregan al momento, más barata de guardar que Standard. Glacier es más barata, pero la recuperación puede tardar. EBS es el disco de una instancia, no el archivo de facturas.

#### 17. Un despacho guarda expedientes que la ley pide conservar años. Casi nadie los abre, y si l

> Un despacho guarda expedientes que la ley pide conservar años. Casi nadie los abre, y si los piden pueden esperar horas. Quieres el almacenamiento más barato. ¿Cuál usas?

- Amazon EBS
- Amazon S3 Glacier **(correcta)**
- S3 Standard
- Amazon EFS

> Glacier es para archivos que casi no se consultan y pueden tardar en recuperarse. Standard y EFS cobran como si los usaras seguido. EBS es un disco enganchado a una instancia.

#### 18. La oficina sigue guardando archivos en sus servidores. Quieres que los respaldos terminen 

> La oficina sigue guardando archivos en sus servidores. Quieres que los respaldos terminen en S3 sin cambiar el programa que ya usan para copiar archivos. ¿Qué usas?

- AWS Storage Gateway **(correcta)**
- AWS Database Migration Service
- Amazon CloudFront
- AWS Direct Connect, por sí solo

> Storage Gateway presenta el almacenamiento de AWS como si fuera un disco o una carpeta local, y manda los datos a S3. DMS copia bases de datos, no carpetas de archivos. CloudFront entrega contenido a los usuarios. Direct Connect es el enlace de red, no el respaldo.

### Servicios de bases de datos

#### 1. ¿Cómo aparece DynamoDB en la documentación de AWS?

> ¿Cómo aparece DynamoDB en la documentación de AWS?

- AWS Key Management Service (AWS KMS)
- Amazon Virtual Private Cloud (Amazon VPC)
- Amazon CloudFront
- Amazon DynamoDB **(correcta)**

> A. AWS Key Management Service (AWS KMS): No es correcta porque corresponde a KMS, no a DynamoDB.
> B. Amazon Virtual Private Cloud (Amazon VPC): No es correcta porque corresponde a VPC, no a DynamoDB.
> C. Amazon CloudFront: No es correcta porque corresponde a CloudFront, no a DynamoDB.
> D. Amazon DynamoDB: El nombre oficial en inglés es “Amazon DynamoDB”.

#### 2. ¿Cuál es la función principal de Amazon DynamoDB?

> ¿Cuál es la función principal de Amazon DynamoDB?

- Es una base de datos NoSQL administrada que admite modelos de datos clave-valor y documentos. **(correcta)**
- Permite administrar identidades y permisos para controlar quién puede acceder a los recursos de AWS y qué acciones puede realizar.
- Es un servicio DNS escalable que permite dirigir consultas de nombres de dominio a recursos o endpoints.
- Es un servicio de protección contra ataques de denegación de servicio distribuido (DDoS).

> A. Sí. Es una base de datos NoSQL administrada que admite modelos de datos clave-valor y documentos.
> B. No. Esa es la función de AWS Identity and Access Management (IAM).
> C. No. Esa es la función de Amazon Route 53.
> D. No. Esa es la función de AWS Shield.

#### 3. ¿Para qué sirve Amazon DynamoDB?

> ¿Para qué sirve Amazon DynamoDB?

- Es una base de datos NoSQL administrada que admite modelos de datos clave-valor y documentos. **(correcta)**
- Permite administrar identidades y permisos para controlar quién puede acceder a los recursos de AWS y qué acciones puede realizar.
- Es un servicio DNS escalable que permite dirigir consultas de nombres de dominio a recursos o endpoints.
- Es un servicio de protección contra ataques de denegación de servicio distribuido (DDoS).

> A. Sí. Es una base de datos NoSQL administrada que admite modelos de datos clave-valor y documentos.
> B. No. Eso es otro servicio. DynamoDB no hace eso.
> C. No. Eso es otro servicio. DynamoDB no hace eso.
> D. No. Eso es otro servicio. DynamoDB no hace eso.

#### 4. Tu aplicación necesita una base NoSQL administrada que responda con baja latencia a escala

> Tu aplicación necesita una base NoSQL administrada que responda con baja latencia a escala. ¿Qué servicio de AWS usas?

- AWS Key Management Service (AWS KMS)
- AWS Artifact
- Amazon Inspector
- Amazon DynamoDB **(correcta)**

> A. No. Ese servicio sirve para crear y cuidar claves de cifrado.
> B. No. Ese servicio sirve para consultar informes de cumplimiento.
> C. No. Ese servicio sirve para buscar vulnerabilidades en lo que despliegas.
> D. Sí. Amazon DynamoDB es apropiado porque es una base de datos NoSQL administrada que admite modelos de datos clave-valor y documentos.

#### 5. ¿Qué significan las siglas RDS?

> ¿Qué significan las siglas RDS?

- Relational Database Service **(correcta)**
- Distribución de contenido
- Dns y enrutamiento de dominio
- Simple Notification Service

> A. Relational Database Service: RDS corresponde a “Relational Database Service”, el nombre completo de sus siglas.
> B. Distribución de contenido: No es correcta porque no corresponde al significado oficial de esas siglas.
> C. Dns y enrutamiento de dominio: No es correcta porque no corresponde al significado oficial de esas siglas.
> D. Simple Notification Service: No es correcta porque es el nombre completo de SNS, no de RDS.

#### 6. ¿Cuál es la función principal de Amazon Relational Database Service (Amazon RDS)?

> ¿Cuál es la función principal de Amazon Relational Database Service (Amazon RDS)?

- Facilita configurar, operar y escalar bases de datos relacionales administradas. **(correcta)**
- Permite crear y administrar claves criptográficas y controlar su uso para cifrar datos en servicios compatibles.
- Es un servicio de mensajería pub/sub que distribuye notificaciones a suscriptores mediante protocolos o destinos compatibles.
- Permite crear reglas para inspeccionar y filtrar solicitudes HTTP/HTTPS hacia aplicaciones web y APIs.

> A. Sí. Facilita configurar, operar y escalar bases de datos relacionales administradas.
> B. No. Esa es la función de AWS Key Management Service (AWS KMS).
> C. No. Esa es la función de Amazon Simple Notification Service (Amazon SNS).
> D. No. Esa es la función de AWS WAF (AWS Web Application Firewall).

#### 7. ¿Cuáles son las siglas correspondientes a “Relational Database Service”?

> ¿Cuáles son las siglas correspondientes a “Relational Database Service”?

- RDS **(correcta)**
- EC2
- AMI
- S3

> A. RDS: sí. Es la abreviatura oficial de “Relational Database Service”.
> B. EC2: no. EC2 significa “Elastic Compute Cloud”, no “Relational Database Service”.
> C. AMI: no. AMI significa “Amazon Machine Image”, no “Relational Database Service”.
> D. S3: no. S3 significa “Simple Storage Service”, no “Relational Database Service”.

#### 8. Necesitas una base de datos relacional administrada para una aplicación y quieres reducir 

> Necesitas una base de datos relacional administrada para una aplicación y quieres reducir el trabajo de mantenimiento. ¿Qué servicio de AWS usas?

- Amazon Virtual Private Cloud (Amazon VPC)
- AWS Command Line Interface (AWS CLI)
- Amazon Relational Database Service (Amazon RDS) **(correcta)**
- AWS Security Hub

> A. No. Ese servicio sirve para definir tu red privada en AWS.
> B. No. Ese servicio sirve para operar AWS desde la terminal.
> C. Sí. Amazon Relational Database Service (Amazon RDS) es apropiado porque facilita configurar, operar y escalar bases de datos relacionales administradas.
> D. No. Ese servicio sirve para reunir hallazgos de seguridad en un solo lugar.

#### 9. Las consultas SQL de lectura se repiten y la base no da abasto. Quieres guardar esos resul

> Las consultas SQL de lectura se repiten y la base no da abasto. Quieres guardar esos resultados en memoria para que la aplicación responda más rápido. ¿Qué servicio usas?

- Amazon DynamoDB Accelerator (DAX)
- Amazon CloudFront
- AWS IoT Greengrass
- Amazon ElastiCache **(correcta)**

> ElastiCache es la caché en memoria (Redis o Memcached) delante de una base, incluidas las consultas SQL. DAX es solo la caché de DynamoDB. CloudFront acerca contenido web al usuario. Greengrass corre lógica en dispositivos, no cachea consultas.

#### 10. Necesitas una base MySQL para transacciones del día a día (OLTP), compatible con MySQL y c

> Necesitas una base MySQL para transacciones del día a día (OLTP), compatible con MySQL y capaz de crecer mucho. ¿Qué servicio encaja?

- Amazon Aurora **(correcta)**
- Amazon Redshift
- Amazon DynamoDB
- Amazon Timestream

> Aurora es relacional y compatible con MySQL y PostgreSQL, para la carga transaccional. Redshift es un almacén para análisis, no el OLTP del día a día. DynamoDB es NoSQL de clave-valor. Timestream es para series de tiempo.

#### 11. La base está en Amazon RDS. Hay que parchear el motor de la base, no el sistema de una ins

> La base está en Amazon RDS. Hay que parchear el motor de la base, no el sistema de una instancia que administras tú. ¿Quién hace ese parche del motor?

- Tú, igual que en una base instalada sobre EC2
- Nadie: RDS no se parchea
- El cliente, porque el motor es siempre suyo
- AWS, dentro de la ventana que configures **(correcta)**

> RDS es administrado: AWS parchea el motor. Tú sigues con los datos, los accesos, el esquema y las consultas. En EC2, si instalaste la base tú, el motor también es tuyo.

#### 12. El carrito busca cada producto por su clave, millones de veces, y tiene que responder en m

> El carrito busca cada producto por su clave, millones de veces, y tiene que responder en milisegundos. No hay joins y no quieres administrar un servidor de base. ¿Qué usas?

- Amazon RDS
- Amazon Redshift
- Amazon Neptune
- Amazon DynamoDB **(correcta)**

> DynamoDB es una base de clave-valor, sin servidor, hecha para muchas lecturas por clave. RDS es relacional y la administras como motor. Redshift es para análisis de mucho historial. Neptune es para datos en grafo, como relaciones entre personas.

#### 13. Finanzas quiere cruzar años de ventas para armar reportes. No es la base que cobra el pedi

> Finanzas quiere cruzar años de ventas para armar reportes. No es la base que cobra el pedido de hoy. ¿Qué servicio encaja?

- Amazon ElastiCache
- Amazon DynamoDB
- Amazon Redshift **(correcta)**
- Amazon RDS, como almacén de reportes históricos

> Redshift es el almacén de datos para consultas grandes de análisis. RDS atiende las transacciones del día. ElastiCache guarda en memoria lo que se repite. DynamoDB no está pensada para esos reportes con muchas columnas.

#### 14. La base de la tienda sigue en el centro de datos y quieres pasarla a Amazon RDS mientras l

> La base de la tienda sigue en el centro de datos y quieres pasarla a Amazon RDS mientras la tienda sigue vendiendo, con el corte más corto posible. ¿Qué usas?

- AWS CloudFormation
- AWS Database Migration Service **(correcta)**
- AWS Application Migration Service
- Amazon S3 Glacier

> DMS copia la base y puede seguir replicando los cambios hasta el momento del corte. Application Migration Service mueve servidores enteros, no la base en vivo. Glacier archiva archivos. CloudFormation crea infraestructura, no migra los datos.

### Servicios de redes y entrega

#### 1. ¿Qué significan las siglas VPC?

> ¿Qué significan las siglas VPC?

- Documentación de cumplimiento
- AWS Command Line Interface
- Virtual Private Cloud **(correcta)**
- Protección contra ddos

> A. Documentación de cumplimiento: No es correcta porque no corresponde al significado oficial de esas siglas.
> B. AWS Command Line Interface: No es correcta porque es el nombre completo de AWS CLI, no de VPC.
> C. Virtual Private Cloud: VPC corresponde a “Virtual Private Cloud”, el nombre completo de sus siglas.
> D. Protección contra ddos: No es correcta porque no corresponde al significado oficial de esas siglas.

#### 2. ¿Cuál es la función principal de Amazon Virtual Private Cloud (Amazon VPC)?

> ¿Cuál es la función principal de Amazon Virtual Private Cloud (Amazon VPC)?

- Es un servicio DNS escalable que permite dirigir consultas de nombres de dominio a recursos o endpoints.
- Es un servicio de protección contra ataques de denegación de servicio distribuido (DDoS).
- Permite definir una red virtual aislada en AWS, con subredes, rutas y controles de tráfico. **(correcta)**
- Centraliza y prioriza hallazgos de seguridad y ayuda a evaluar la postura de seguridad en AWS.

> A. No. Esa es la función de Amazon Route 53.
> B. No. Esa es la función de AWS Shield.
> C. Sí. Permite definir una red virtual aislada en AWS, con subredes, rutas y controles de tráfico.
> D. No. Esa es la función de AWS Security Hub.

#### 3. ¿Cuáles son las siglas correspondientes a “Virtual Private Cloud”?

> ¿Cuáles son las siglas correspondientes a “Virtual Private Cloud”?

- VPC **(correcta)**
- EC2
- AMI
- S3

> A. VPC: sí. Es la abreviatura oficial de “Virtual Private Cloud”.
> B. EC2: no. EC2 significa “Elastic Compute Cloud”, no “Virtual Private Cloud”.
> C. AMI: no. AMI significa “Amazon Machine Image”, no “Virtual Private Cloud”.
> D. S3: no. S3 significa “Simple Storage Service”, no “Virtual Private Cloud”.

#### 4. Quieres separar recursos en subredes públicas y privadas y controlar cómo circula el tráfi

> Quieres separar recursos en subredes públicas y privadas y controlar cómo circula el tráfico de red. ¿Qué servicio de AWS usas?

- Amazon Virtual Private Cloud (Amazon VPC) **(correcta)**
- Amazon Simple Notification Service (Amazon SNS)
- Amazon GuardDuty
- AWS Organizations

> A. Sí. Amazon Virtual Private Cloud (Amazon VPC) es apropiado porque permite definir una red virtual aislada en AWS, con subredes, rutas y controles de tráfico.
> B. No. Ese servicio sirve para enviar notificaciones.
> C. No. Ese servicio sirve para detectar actividad sospechosa en la cuenta.
> D. No. Ese servicio sirve para agrupar y gobernar varias cuentas.

#### 5. ¿Cómo aparece CloudFront en la documentación de AWS?

> ¿Cómo aparece CloudFront en la documentación de AWS?

- AWS Artifact
- AWS Command Line Interface (AWS CLI)
- AWS Shield
- Amazon CloudFront **(correcta)**

> A. AWS Artifact: No es correcta porque corresponde a Artifact, no a CloudFront.
> B. AWS Command Line Interface (AWS CLI): No es correcta porque corresponde a AWS CLI, no a CloudFront.
> C. AWS Shield: No es correcta porque corresponde a Shield, no a CloudFront.
> D. Amazon CloudFront: El nombre oficial en inglés es “Amazon CloudFront”.

#### 6. ¿Cuál es la función principal de Amazon CloudFront?

> ¿Cuál es la función principal de Amazon CloudFront?

- Es un servicio de mensajería pub/sub que distribuye notificaciones a suscriptores mediante protocolos o destinos compatibles.
- Permite crear reglas para inspeccionar y filtrar solicitudes HTTP/HTTPS hacia aplicaciones web y APIs.
- Recopila y consulta métricas y registros, crea alarmas y permite observar el rendimiento y el estado de recursos y aplicaciones.
- Es una red de entrega de contenido (CDN) que distribuye contenido a usuarios desde ubicaciones cercanas para reducir latencia. **(correcta)**

> A. No. Esa es la función de Amazon Simple Notification Service (Amazon SNS).
> B. No. Esa es la función de AWS WAF (AWS Web Application Firewall).
> C. No. Esa es la función de Amazon CloudWatch.
> D. Sí. Es una red de entrega de contenido (CDN) que distribuye contenido a usuarios desde ubicaciones cercanas para reducir latencia.

#### 7. ¿Para qué sirve Amazon CloudFront?

> ¿Para qué sirve Amazon CloudFront?

- Es una red de entrega de contenido (CDN) que distribuye contenido a usuarios desde ubicaciones cercanas para reducir latencia. **(correcta)**
- Es un servicio de mensajería pub/sub que distribuye notificaciones a suscriptores mediante protocolos o destinos compatibles.
- Permite crear reglas para inspeccionar y filtrar solicitudes HTTP/HTTPS hacia aplicaciones web y APIs.
- Recopila y consulta métricas y registros, crea alarmas y permite observar el rendimiento y el estado de recursos y aplicaciones.

> A. Sí. Es una red de entrega de contenido (CDN) que distribuye contenido a usuarios desde ubicaciones cercanas para reducir latencia.
> B. No. Eso es otro servicio. CloudFront no hace eso.
> C. No. Eso es otro servicio. CloudFront no hace eso.
> D. No. Eso es otro servicio. CloudFront no hace eso.

#### 8. Tu sitio tiene usuarios en distintos países y quieres entregar imágenes y archivos estátic

> Tu sitio tiene usuarios en distintos países y quieres entregar imágenes y archivos estáticos con menor latencia. ¿Qué servicio de AWS usas?

- AWS Artifact
- Amazon Inspector
- AWS Trusted Advisor
- Amazon CloudFront **(correcta)**

> A. No. Ese servicio sirve para consultar informes de cumplimiento.
> B. No. Ese servicio sirve para buscar vulnerabilidades en lo que despliegas.
> C. No. Ese servicio sirve para recomendarte cómo mejorar costo, seguridad y rendimiento.
> D. Sí. Amazon CloudFront es apropiado porque es una red de entrega de contenido (CDN) que distribuye contenido a usuarios desde ubicaciones cercanas para reducir latencia.

#### 9. ¿Cómo aparece Route 53 en la documentación de AWS?

> ¿Cómo aparece Route 53 en la documentación de AWS?

- Amazon Route 53 **(correcta)**
- AWS Command Line Interface (AWS CLI)
- AWS Shield
- AWS WAF (AWS Web Application Firewall)

> A. Amazon Route 53: El nombre oficial en inglés es “Amazon Route 53”.
> B. AWS Command Line Interface (AWS CLI): No es correcta porque corresponde a AWS CLI, no a Route 53.
> C. AWS Shield: No es correcta porque corresponde a Shield, no a Route 53.
> D. AWS WAF (AWS Web Application Firewall): No es correcta porque corresponde a WAF, no a Route 53.

#### 10. ¿Cuál es la función principal de Amazon Route 53?

> ¿Cuál es la función principal de Amazon Route 53?

- Proporciona acceso bajo demanda a informes de cumplimiento, documentos de seguridad y acuerdos relacionados con AWS.
- Analiza fuentes de datos y señales de AWS para detectar posibles amenazas y actividad maliciosa.
- Es un servicio DNS escalable que permite dirigir consultas de nombres de dominio a recursos o endpoints. **(correcta)**
- Registra la actividad de las cuentas de AWS, incluidas muchas acciones realizadas mediante la consola, SDKs y API.

> A. No. Esa es la función de AWS Artifact.
> B. No. Esa es la función de Amazon GuardDuty.
> C. Sí. Es un servicio DNS escalable que permite dirigir consultas de nombres de dominio a recursos o endpoints.
> D. No. Esa es la función de AWS CloudTrail.

#### 11. ¿Para qué sirve Amazon Route 53?

> ¿Para qué sirve Amazon Route 53?

- Es un servicio DNS escalable que permite dirigir consultas de nombres de dominio a recursos o endpoints. **(correcta)**
- Proporciona acceso bajo demanda a informes de cumplimiento, documentos de seguridad y acuerdos relacionados con AWS.
- Analiza fuentes de datos y señales de AWS para detectar posibles amenazas y actividad maliciosa.
- Registra la actividad de las cuentas de AWS, incluidas muchas acciones realizadas mediante la consola, SDKs y API.

> A. Sí. Es un servicio DNS escalable que permite dirigir consultas de nombres de dominio a recursos o endpoints.
> B. No. Eso es otro servicio. Route 53 no hace eso.
> C. No. Eso es otro servicio. Route 53 no hace eso.
> D. No. Eso es otro servicio. Route 53 no hace eso.

#### 12. Necesitas configurar el DNS de tu dominio para que dirija a los usuarios hacia tu sitio o 

> Necesitas configurar el DNS de tu dominio para que dirija a los usuarios hacia tu sitio o aplicación. ¿Qué servicio de AWS usas?

- Amazon Route 53 **(correcta)**
- AWS Command Line Interface (AWS CLI)
- AWS Security Hub
- Amazon Elastic Compute Cloud (Amazon EC2)

> A. Sí. Amazon Route 53 es apropiado porque es un servicio DNS escalable que permite dirigir consultas de nombres de dominio a recursos o endpoints.
> B. No. Ese servicio sirve para operar AWS desde la terminal.
> C. No. Ese servicio sirve para reunir hallazgos de seguridad en un solo lugar.
> D. No. Ese servicio sirve para ejecutar servidores virtuales.

#### 13. Necesitas repartir tráfico TCP, UDP y TLS, con millones de peticiones por segundo y latenc

> Necesitas repartir tráfico TCP, UDP y TLS, con millones de peticiones por segundo y latencia muy baja. ¿Qué balanceador usas?

- Network Load Balancer **(correcta)**
- Application Load Balancer
- Gateway Load Balancer
- Amazon CloudFront

> El Network Load Balancer trabaja en la capa de transporte (TCP, UDP y TLS) y está hecho para mucho volumen con latencia muy baja. El Application Load Balancer mira HTTP y HTTPS. El Gateway Load Balancer reparte hacia appliances virtuales, como un firewall. CloudFront acerca contenido; no balancea así tu tráfico interno.

#### 14. La tienda está en una Región de Estados Unidos. Quienes compran desde México y España tard

> La tienda está en una Región de Estados Unidos. Quienes compran desde México y España tardan en ver las fotos. Quieres guardar esas fotos cerca de ellos. ¿Qué usas?

- Una segunda instancia en la misma Availability Zone
- AWS Direct Connect
- Un NAT Gateway
- Amazon CloudFront **(correcta)**

> CloudFront copia el contenido en puntos de presencia cerca de quien lo pide. Otra instancia en la misma zona no acerca nada a otro país. Direct Connect une tu oficina con AWS. El NAT deja salir a internet a una subred privada.

#### 15. Ya tienes la tienda en marcha. Quieres que www.tienda.com lleve a esa aplicación. ¿Qué ser

> Ya tienes la tienda en marcha. Quieres que www.tienda.com lleve a esa aplicación. ¿Qué servicio resuelve ese nombre?

- AWS IAM
- Amazon VPC
- Amazon Route 53 **(correcta)**
- Amazon CloudFront

> Route 53 es el DNS de AWS: traduce el nombre a la dirección de tu aplicación. CloudFront entrega el contenido, pero no es el registro del dominio. IAM da permisos. La VPC es tu red privada.

#### 16. La instancia de la base de la aplicación está en una subred privada. Tiene que bajar actua

> La instancia de la base de la aplicación está en una subred privada. Tiene que bajar actualizaciones de internet, pero nadie desde internet debe poder conectarse a ella. ¿Qué le pones?

- Amazon CloudFront delante de la base
- Un NAT Gateway en una public subnet **(correcta)**
- Una IP pública en esa misma instancia
- Un Internet Gateway directo a la private subnet

> El NAT deja salir el tráfico de la subred privada y no deja entrar conexiones nuevas desde internet. Una IP pública o un Internet Gateway en esa subred la dejan alcanzable. CloudFront es para contenido de cara al público.

#### 17. La oficina sigue con sus propios servidores. Quieres un túnel cifrado por internet hasta t

> La oficina sigue con sus propios servidores. Quieres un túnel cifrado por internet hasta tu VPC, sin contratar un enlace dedicado. ¿Qué usas?

- AWS Site-to-Site VPN **(correcta)**
- AWS Direct Connect
- VPC peering
- Amazon CloudFront

> Site-to-Site VPN cifra el tráfico entre tu red y la VPC usando internet. Direct Connect es un enlace privado y dedicado, no un túnel por internet. El peering une dos VPC, no tu oficina. CloudFront entrega contenido a usuarios.

### Servicios de seguridad

#### 1. ¿Qué significan las siglas IAM?

> ¿Qué significan las siglas IAM?

- Dns y enrutamiento de dominio
- Simple Notification Service
- Identity and Access Management **(correcta)**
- Documentación de cumplimiento

> A. Dns y enrutamiento de dominio: No es correcta porque no corresponde al significado oficial de esas siglas.
> B. Simple Notification Service: No es correcta porque es el nombre completo de SNS, no de IAM.
> C. Identity and Access Management: IAM corresponde a “Identity and Access Management”, el nombre completo de sus siglas.
> D. Documentación de cumplimiento: No es correcta porque no corresponde al significado oficial de esas siglas.

#### 2. ¿Cuál es la función principal de AWS Identity and Access Management (IAM)?

> ¿Cuál es la función principal de AWS Identity and Access Management (IAM)?

- Permite administrar identidades y permisos para controlar quién puede acceder a los recursos de AWS y qué acciones puede realizar. **(correcta)**
- Permite definir una red virtual aislada en AWS, con subredes, rutas y controles de tráfico.
- Proporciona acceso bajo demanda a informes de cumplimiento, documentos de seguridad y acuerdos relacionados con AWS.
- Analiza fuentes de datos y señales de AWS para detectar posibles amenazas y actividad maliciosa.

> A. Sí. Permite administrar identidades y permisos para controlar quién puede acceder a los recursos de AWS y qué acciones puede realizar.
> B. No. Esa es la función de Amazon Virtual Private Cloud (Amazon VPC).
> C. No. Esa es la función de AWS Artifact.
> D. No. Esa es la función de Amazon GuardDuty.

#### 3. ¿Cuáles son las siglas correspondientes a “Identity and Access Management”?

> ¿Cuáles son las siglas correspondientes a “Identity and Access Management”?

- EC2
- AMI
- IAM **(correcta)**
- S3

> A. EC2: no. EC2 significa “Elastic Compute Cloud”, no “Identity and Access Management”.
> B. AMI: no. AMI significa “Amazon Machine Image”, no “Identity and Access Management”.
> C. IAM: sí. Es la abreviatura oficial de “Identity and Access Management”.
> D. S3: no. S3 significa “Simple Storage Service”, no “Identity and Access Management”.

#### 4. Quieres permitir que una persona consulte objetos de S3 sin darle permisos para eliminarlo

> Quieres permitir que una persona consulte objetos de S3 sin darle permisos para eliminarlos. ¿Qué servicio de AWS usas?

- Amazon CloudFront
- AWS Shield
- Amazon CloudWatch
- AWS Identity and Access Management (IAM) **(correcta)**

> A. No. Ese servicio sirve para acercar el contenido a quien lo consulta.
> B. No. Ese servicio sirve para absorber ataques de denegación de servicio.
> C. No. Ese servicio sirve para ver métricas, logs y alarmas.
> D. Sí. AWS Identity and Access Management (IAM) es apropiado porque permite administrar identidades y permisos para controlar quién puede acceder a los recursos de AWS y qué acciones puede realizar.

#### 5. ¿Qué significan las siglas KMS?

> ¿Qué significan las siglas KMS?

- Simple Notification Service
- Key Management Service **(correcta)**
- Documentación de cumplimiento
- AWS Command Line Interface

> A. Simple Notification Service: No es correcta porque es el nombre completo de SNS, no de KMS.
> B. Key Management Service: KMS corresponde a “Key Management Service”, el nombre completo de sus siglas.
> C. Documentación de cumplimiento: No es correcta porque no corresponde al significado oficial de esas siglas.
> D. AWS Command Line Interface: No es correcta porque es el nombre completo de AWS CLI, no de KMS.

#### 6. ¿Cuál es la función principal de AWS Key Management Service (AWS KMS)?

> ¿Cuál es la función principal de AWS Key Management Service (AWS KMS)?

- Es una red de entrega de contenido (CDN) que distribuye contenido a usuarios desde ubicaciones cercanas para reducir latencia.
- Permite interactuar con servicios de AWS mediante comandos desde una terminal o scripts.
- Permite crear y administrar claves criptográficas y controlar su uso para cifrar datos en servicios compatibles. **(correcta)**
- Descubre y evalúa vulnerabilidades de software y exposiciones involuntarias en recursos compatibles.

> A. No. Esa es la función de Amazon CloudFront.
> B. No. Esa es la función de AWS Command Line Interface (AWS CLI).
> C. Sí. Permite crear y administrar claves criptográficas y controlar su uso para cifrar datos en servicios compatibles.
> D. No. Esa es la función de Amazon Inspector.

#### 7. ¿Cuáles son las siglas correspondientes a “Key Management Service”?

> ¿Cuáles son las siglas correspondientes a “Key Management Service”?

- EC2
- AMI
- KMS **(correcta)**
- S3

> A. EC2: no. EC2 significa “Elastic Compute Cloud”, no “Key Management Service”.
> B. AMI: no. AMI significa “Amazon Machine Image”, no “Key Management Service”.
> C. KMS: sí. Es la abreviatura oficial de “Key Management Service”.
> D. S3: no. S3 significa “Simple Storage Service”, no “Key Management Service”.

#### 8. Necesitas administrar claves de cifrado para proteger datos almacenados en servicios de AW

> Necesitas administrar claves de cifrado para proteger datos almacenados en servicios de AWS. ¿Qué servicio de AWS usas?

- Amazon Route 53
- AWS Key Management Service (AWS KMS) **(correcta)**
- AWS WAF (AWS Web Application Firewall)
- AWS CloudTrail

> A. No. Ese servicio sirve para resolver nombres de dominio.
> B. Sí. AWS Key Management Service (AWS KMS) es apropiado porque permite crear y administrar claves criptográficas y controlar su uso para cifrar datos en servicios compatibles.
> C. No. Ese servicio sirve para filtrar tráfico web malicioso.
> D. No. Ese servicio sirve para registrar quién hizo qué en la cuenta.

#### 9. ¿Cómo aparece Shield en la documentación de AWS?

> ¿Cómo aparece Shield en la documentación de AWS?

- Amazon Inspector
- AWS Security Hub
- AWS Shield **(correcta)**
- Amazon CloudWatch

> A. Amazon Inspector: No es correcta porque corresponde a Inspector, no a Shield.
> B. AWS Security Hub: No es correcta porque corresponde a Security Hub, no a Shield.
> C. AWS Shield: El nombre oficial en inglés es “AWS Shield”.
> D. Amazon CloudWatch: No es correcta porque corresponde a CloudWatch, no a Shield.

#### 10. ¿Cuál es la función principal de AWS Shield?

> ¿Cuál es la función principal de AWS Shield?

- Es un servicio de protección contra ataques de denegación de servicio distribuido (DDoS). **(correcta)**
- Analiza fuentes de datos y señales de AWS para detectar posibles amenazas y actividad maliciosa.
- Registra la actividad de las cuentas de AWS, incluidas muchas acciones realizadas mediante la consola, SDKs y API.
- Es una plantilla que contiene información necesaria para lanzar una instancia EC2, como el sistema operativo y la configuración inicial.

> A. Sí. Es un servicio de protección contra ataques de denegación de servicio distribuido (DDoS).
> B. No. Esa es la función de Amazon GuardDuty.
> C. No. Esa es la función de AWS CloudTrail.
> D. No. Esa es la función de Amazon Machine Image (AMI).

#### 11. ¿Para qué sirve AWS Shield?

> ¿Para qué sirve AWS Shield?

- Es un servicio de protección contra ataques de denegación de servicio distribuido (DDoS). **(correcta)**
- Analiza fuentes de datos y señales de AWS para detectar posibles amenazas y actividad maliciosa.
- Registra la actividad de las cuentas de AWS, incluidas muchas acciones realizadas mediante la consola, SDKs y API.
- Es una plantilla que contiene información necesaria para lanzar una instancia EC2, como el sistema operativo y la configuración inicial.

> A. Sí. Es un servicio de protección contra ataques de denegación de servicio distribuido (DDoS).
> B. No. Eso es otro servicio. Shield no hace eso.
> C. No. Eso es otro servicio. Shield no hace eso.
> D. No. Eso es otro servicio. Shield no hace eso.

#### 12. Quieres proteger una aplicación alojada en AWS contra ataques DDoS. ¿Qué servicio de AWS u

> Quieres proteger una aplicación alojada en AWS contra ataques DDoS. ¿Qué servicio de AWS usas?

- Amazon Inspector
- AWS Trusted Advisor
- AWS Shield **(correcta)**
- Amazon Elastic Block Store (Amazon EBS)

> A. No. Ese servicio sirve para buscar vulnerabilidades en lo que despliegas.
> B. No. Ese servicio sirve para recomendarte cómo mejorar costo, seguridad y rendimiento.
> C. Sí. AWS Shield es apropiado porque es un servicio de protección contra ataques de denegación de servicio distribuido (DDoS).
> D. No. Ese servicio sirve para dar un disco a una instancia.

#### 13. ¿Qué significan las siglas WAF?

> ¿Qué significan las siglas WAF?

- Web Application Firewall **(correcta)**
- Monitoreo y observabilidad
- Registro de actividad y auditoría
- Administración multicuenta

> A. Web Application Firewall: WAF corresponde a “Web Application Firewall”, el nombre completo de sus siglas.
> B. Monitoreo y observabilidad: No es correcta porque no corresponde al significado oficial de esas siglas.
> C. Registro de actividad y auditoría: No es correcta porque no corresponde al significado oficial de esas siglas.
> D. Administración multicuenta: No es correcta porque no corresponde al significado oficial de esas siglas.

#### 14. ¿Cuál es la función principal de AWS WAF (AWS Web Application Firewall)?

> ¿Cuál es la función principal de AWS WAF (AWS Web Application Firewall)?

- Descubre y evalúa vulnerabilidades de software y exposiciones involuntarias en recursos compatibles.
- Permite administrar y gobernar varias cuentas de AWS de forma centralizada, con políticas y agrupaciones.
- Ejecuta código en respuesta a eventos sin que tengas que administrar directamente los servidores; AWS gestiona la infraestructura subyacente.
- Permite crear reglas para inspeccionar y filtrar solicitudes HTTP/HTTPS hacia aplicaciones web y APIs. **(correcta)**

> A. No. Esa es la función de Amazon Inspector.
> B. No. Esa es la función de AWS Organizations.
> C. No. Esa es la función de AWS Lambda.
> D. Sí. Permite crear reglas para inspeccionar y filtrar solicitudes HTTP/HTTPS hacia aplicaciones web y APIs.

#### 15. ¿Cuáles son las siglas correspondientes a “Web Application Firewall”?

> ¿Cuáles son las siglas correspondientes a “Web Application Firewall”?

- EC2
- WAF **(correcta)**
- AMI
- S3

> A. EC2: no. EC2 significa “Elastic Compute Cloud”, no “Web Application Firewall”.
> B. WAF: sí. Es la abreviatura oficial de “Web Application Firewall”.
> C. AMI: no. AMI significa “Amazon Machine Image”, no “Web Application Firewall”.
> D. S3: no. S3 significa “Simple Storage Service”, no “Web Application Firewall”.

#### 16. Quieres bloquear solicitudes web que coincidan con reglas de seguridad, por ejemplo patron

> Quieres bloquear solicitudes web que coincidan con reglas de seguridad, por ejemplo patrones de ataque conocidos. ¿Qué servicio de AWS usas?

- AWS Security Hub
- Amazon Elastic Compute Cloud (Amazon EC2)
- Amazon Elastic File System (Amazon EFS)
- AWS WAF (AWS Web Application Firewall) **(correcta)**

> A. No. Ese servicio sirve para reunir hallazgos de seguridad en un solo lugar.
> B. No. Ese servicio sirve para ejecutar servidores virtuales.
> C. No. Ese servicio sirve para compartir archivos entre varios servidores.
> D. Sí. AWS WAF (AWS Web Application Firewall) es apropiado porque permite crear reglas para inspeccionar y filtrar solicitudes HTTP/HTTPS hacia aplicaciones web y APIs.

#### 17. ¿Cómo aparece GuardDuty en la documentación de AWS?

> ¿Cómo aparece GuardDuty en la documentación de AWS?

- Amazon CloudWatch
- AWS CloudTrail
- AWS Organizations
- Amazon GuardDuty **(correcta)**

> A. Amazon CloudWatch: No es correcta porque corresponde a CloudWatch, no a GuardDuty.
> B. AWS CloudTrail: No es correcta porque corresponde a CloudTrail, no a GuardDuty.
> C. AWS Organizations: No es correcta porque corresponde a Organizations, no a GuardDuty.
> D. Amazon GuardDuty: El nombre oficial en inglés es “Amazon GuardDuty”.

#### 18. ¿Cuál es la función principal de Amazon GuardDuty?

> ¿Cuál es la función principal de Amazon GuardDuty?

- Analiza fuentes de datos y señales de AWS para detectar posibles amenazas y actividad maliciosa. **(correcta)**
- Centraliza y prioriza hallazgos de seguridad y ayuda a evaluar la postura de seguridad en AWS.
- Ofrece comprobaciones y recomendaciones para ayudar a optimizar costos, rendimiento, seguridad, tolerancia a fallos y límites de servicio, según el plan y las funciones disponibles.
- Almacena y recupera objetos, como imágenes, documentos, respaldos y archivos estáticos, dentro de buckets.

> A. Sí. Analiza fuentes de datos y señales de AWS para detectar posibles amenazas y actividad maliciosa.
> B. No. Esa es la función de AWS Security Hub.
> C. No. Esa es la función de AWS Trusted Advisor.
> D. No. Esa es la función de Amazon Simple Storage Service (Amazon S3).

#### 19. ¿Para qué sirve Amazon GuardDuty?

> ¿Para qué sirve Amazon GuardDuty?

- Analiza fuentes de datos y señales de AWS para detectar posibles amenazas y actividad maliciosa. **(correcta)**
- Centraliza y prioriza hallazgos de seguridad y ayuda a evaluar la postura de seguridad en AWS.
- Ofrece comprobaciones y recomendaciones para ayudar a optimizar costos, rendimiento, seguridad, tolerancia a fallos y límites de servicio, según el plan y las funciones disponibles.
- Almacena y recupera objetos, como imágenes, documentos, respaldos y archivos estáticos, dentro de buckets.

> A. Sí. Analiza fuentes de datos y señales de AWS para detectar posibles amenazas y actividad maliciosa.
> B. No. Eso es otro servicio. GuardDuty no hace eso.
> C. No. Eso es otro servicio. GuardDuty no hace eso.
> D. No. Eso es otro servicio. GuardDuty no hace eso.

#### 20. Necesitas detectar comportamientos sospechosos o posibles amenazas en tus cuentas y cargas

> Necesitas detectar comportamientos sospechosos o posibles amenazas en tus cuentas y cargas de trabajo de AWS. ¿Qué servicio de AWS usas?

- Amazon CloudWatch
- Amazon Machine Image (AMI)
- Amazon DynamoDB
- Amazon GuardDuty **(correcta)**

> A. No. Ese servicio sirve para ver métricas, logs y alarmas.
> B. No. Ese servicio sirve para definir la plantilla con la que se lanza una instancia.
> C. No. Ese servicio sirve para guardar datos NoSQL.
> D. Sí. Amazon GuardDuty es apropiado porque analiza fuentes de datos y señales de AWS para detectar posibles amenazas y actividad maliciosa.

#### 21. ¿Cómo aparece Inspector en la documentación de AWS?

> ¿Cómo aparece Inspector en la documentación de AWS?

- AWS CloudTrail
- Amazon Inspector **(correcta)**
- AWS Organizations
- AWS Trusted Advisor

> A. AWS CloudTrail: No es correcta porque corresponde a CloudTrail, no a Inspector.
> B. Amazon Inspector: El nombre oficial en inglés es “Amazon Inspector”.
> C. AWS Organizations: No es correcta porque corresponde a Organizations, no a Inspector.
> D. AWS Trusted Advisor: No es correcta porque corresponde a Trusted Advisor, no a Inspector.

#### 22. ¿Cuál es la función principal de Amazon Inspector?

> ¿Cuál es la función principal de Amazon Inspector?

- Recopila y consulta métricas y registros, crea alarmas y permite observar el rendimiento y el estado de recursos y aplicaciones.
- Permite lanzar y ejecutar servidores virtuales llamados instancias, con capacidad de cómputo configurable.
- Descubre y evalúa vulnerabilidades de software y exposiciones involuntarias en recursos compatibles. **(correcta)**
- Proporciona volúmenes de almacenamiento en bloques que pueden asociarse a instancias EC2 compatibles.

> A. No. Esa es la función de Amazon CloudWatch.
> B. No. Esa es la función de Amazon Elastic Compute Cloud (Amazon EC2).
> C. Sí. Descubre y evalúa vulnerabilidades de software y exposiciones involuntarias en recursos compatibles.
> D. No. Esa es la función de Amazon Elastic Block Store (Amazon EBS).

#### 23. ¿Para qué sirve Amazon Inspector?

> ¿Para qué sirve Amazon Inspector?

- Descubre y evalúa vulnerabilidades de software y exposiciones involuntarias en recursos compatibles. **(correcta)**
- Recopila y consulta métricas y registros, crea alarmas y permite observar el rendimiento y el estado de recursos y aplicaciones.
- Permite lanzar y ejecutar servidores virtuales llamados instancias, con capacidad de cómputo configurable.
- Proporciona volúmenes de almacenamiento en bloques que pueden asociarse a instancias EC2 compatibles.

> A. Sí. Descubre y evalúa vulnerabilidades de software y exposiciones involuntarias en recursos compatibles.
> B. No. Eso es otro servicio. Inspector no hace eso.
> C. No. Eso es otro servicio. Inspector no hace eso.
> D. No. Eso es otro servicio. Inspector no hace eso.

#### 24. Quieres identificar vulnerabilidades en imágenes de contenedores o instancias EC2 compatib

> Quieres identificar vulnerabilidades en imágenes de contenedores o instancias EC2 compatibles. ¿Qué servicio de AWS usas?

- AWS CloudTrail
- Amazon Inspector **(correcta)**
- AWS Lambda
- Amazon Relational Database Service (Amazon RDS)

> A. No. Ese servicio sirve para registrar quién hizo qué en la cuenta.
> B. Sí. Amazon Inspector es apropiado porque descubre y evalúa vulnerabilidades de software y exposiciones involuntarias en recursos compatibles.
> C. No. Ese servicio sirve para ejecutar código sin administrar servidores.
> D. No. Ese servicio sirve para operar una base de datos relacional.

#### 25. ¿Cómo aparece Security Hub en la documentación de AWS?

> ¿Cómo aparece Security Hub en la documentación de AWS?

- AWS Organizations
- AWS Trusted Advisor
- AWS Security Hub **(correcta)**
- Amazon Elastic Compute Cloud (Amazon EC2)

> A. AWS Organizations: No es correcta porque corresponde a Organizations, no a Security Hub.
> B. AWS Trusted Advisor: No es correcta porque corresponde a Trusted Advisor, no a Security Hub.
> C. AWS Security Hub: El nombre oficial en inglés es “AWS Security Hub”.
> D. Amazon Elastic Compute Cloud (Amazon EC2): No es correcta porque corresponde a EC2, no a Security Hub.

#### 26. ¿Cuál es la función principal de AWS Security Hub?

> ¿Cuál es la función principal de AWS Security Hub?

- Centraliza y prioriza hallazgos de seguridad y ayuda a evaluar la postura de seguridad en AWS. **(correcta)**
- Registra la actividad de las cuentas de AWS, incluidas muchas acciones realizadas mediante la consola, SDKs y API.
- Es una plantilla que contiene información necesaria para lanzar una instancia EC2, como el sistema operativo y la configuración inicial.
- Ofrece un sistema de archivos administrado y escalable que puede compartirse entre múltiples recursos compatibles.

> A. Sí. Centraliza y prioriza hallazgos de seguridad y ayuda a evaluar la postura de seguridad en AWS.
> B. No. Esa es la función de AWS CloudTrail.
> C. No. Esa es la función de Amazon Machine Image (AMI).
> D. No. Esa es la función de Amazon Elastic File System (Amazon EFS).

#### 27. ¿Para qué sirve AWS Security Hub?

> ¿Para qué sirve AWS Security Hub?

- Centraliza y prioriza hallazgos de seguridad y ayuda a evaluar la postura de seguridad en AWS. **(correcta)**
- Registra la actividad de las cuentas de AWS, incluidas muchas acciones realizadas mediante la consola, SDKs y API.
- Es una plantilla que contiene información necesaria para lanzar una instancia EC2, como el sistema operativo y la configuración inicial.
- Ofrece un sistema de archivos administrado y escalable que puede compartirse entre múltiples recursos compatibles.

> A. Sí. Centraliza y prioriza hallazgos de seguridad y ayuda a evaluar la postura de seguridad en AWS.
> B. No. Eso es otro servicio. Security Hub no hace eso.
> C. No. Eso es otro servicio. Security Hub no hace eso.
> D. No. Eso es otro servicio. Security Hub no hace eso.

#### 28. Tu equipo quiere consultar en un lugar central los hallazgos de seguridad de distintos ser

> Tu equipo quiere consultar en un lugar central los hallazgos de seguridad de distintos servicios de AWS. ¿Qué servicio de AWS usas?

- AWS Organizations
- Amazon Simple Storage Service (Amazon S3)
- AWS Security Hub **(correcta)**
- AWS Identity and Access Management (IAM)

> A. No. Ese servicio sirve para agrupar y gobernar varias cuentas.
> B. No. Ese servicio sirve para guardar archivos y respaldos en buckets.
> C. Sí. AWS Security Hub es apropiado porque centraliza y prioriza hallazgos de seguridad y ayuda a evaluar la postura de seguridad en AWS.
> D. No. Ese servicio sirve para decidir quién puede hacer qué.

#### 29. El sitio aguanta una avalancha de tráfico hecha para tumbarlo. No te piden filtrar el text

> El sitio aguanta una avalancha de tráfico hecha para tumbarlo. No te piden filtrar el texto de cada petición. ¿Qué servicio cubre ese ataque de volumen?

- Amazon Inspector
- AWS Artifact
- AWS Shield **(correcta)**
- AWS WAF

> Shield protege contra denegación de servicio. WAF bloquea peticiones HTTP por su contenido, como una inyección SQL. Inspector busca vulnerabilidades en lo que desplegaste. Artifact guarda informes de cumplimiento.

#### 30. Una persona nueva solo tiene que leer un bucket. No debe borrar objetos ni entrar a otras 

> Una persona nueva solo tiene que leer un bucket. No debe borrar objetos ni entrar a otras cuentas de servicio. ¿Qué principio aplicas en IAM? El nombre va en inglés.

- Least privilege: solo el permiso que necesita **(correcta)**
- Dar el root user y cambiar la contraseña después
- Una política que permita todo, y restringir más adelante
- Compartir las access keys del administrador

> Least privilege da solo lo necesario para la tarea. El root user y las claves compartidas abren de más. Una política que permite todo no es un permiso de lectura.

#### 31. La aplicación en la instancia llama a un bucket. No quieres dejar una clave de acceso escr

> La aplicación en la instancia llama a un bucket. No quieres dejar una clave de acceso escrita en el código ni en la imagen. ¿Cómo le das permiso?

- Un rol de IAM asociado a la instancia **(correcta)**
- La clave del root user dentro del código
- Una clave de acceso guardada en la imagen de la instancia
- Hacer el bucket público

> El rol le da a la instancia credenciales temporales para ese bucket, y no quedan escritas en el código. La clave raíz o una clave dentro de la imagen se pueden filtrar. Un bucket público lo abre a cualquiera.

#### 32. La contraseña del root user se filtró en un correo. Quieres que esa contraseña, sola, ya n

> La contraseña del root user se filtró en un correo. Quieres que esa contraseña, sola, ya no alcance para entrar. ¿Qué activas? El nombre va en inglés.

- Borrar CloudTrail para que no quede registro
- Compartir la contraseña nueva con todo el equipo
- Dejar el root user en las aplicaciones
- MFA on the root user **(correcta)**

> MFA pide un segundo factor, así que la contraseña filtrada no basta. Borrar CloudTrail esconde el rastro. Compartir el root user o usarlo en las aplicaciones abre más la cuenta.

#### 33. La contraseña de la base está en el repositorio. Quieres guardarla cifrada, rotarla y que 

> La contraseña de la base está en el repositorio. Quieres guardarla cifrada, rotarla y que la aplicación la pida al arrancar. ¿Dónde la pones?

- En un objeto público de S3
- En el nombre del bucket
- AWS Secrets Manager **(correcta)**
- En un comentario del código

> Secrets Manager guarda el secreto cifrado y puede rotarlo. La aplicación lo pide cuando lo necesita. En el código, en un objeto público o en un nombre, cualquiera lo puede leer.

#### 34. Quieres que te avisen si alguien llama a la API desde un país donde nadie trabaja, o si un

> Quieres que te avisen si alguien llama a la API desde un país donde nadie trabaja, o si una instancia empieza a hablar con una dirección mala. ¿Qué servicio vigila eso?

- AWS Artifact
- Amazon GuardDuty **(correcta)**
- AWS Shield
- AWS WAF

> GuardDuty busca actividad sospechosa: llamadas raras a la API y tráfico hacia destinos malos. Shield frena ataques de volumen. WAF filtra peticiones web según reglas que tú pones. Artifact entrega informes de cumplimiento.

#### 35. Quieres una regla que marque un grupo de seguridad en cuanto queda abierto a todo internet

> Quieres una regla que marque un grupo de seguridad en cuanto queda abierto a todo internet, y ver cómo estaba configurado la semana pasada. ¿Qué usas?

- AWS Config **(correcta)**
- AWS CloudTrail, que solo dice quién llamó a la API
- Amazon CloudWatch, para la CPU
- AWS Artifact

> Config guarda cómo está cada recurso y puede avisar si deja de cumplir una regla. CloudTrail dice quién hizo la llamada, no si el grupo sigue abierto. CloudWatch mide, por ejemplo, la CPU. Artifact entrega informes.

#### 36. Los objetos del bucket tienen que ir cifrados con llaves que tú controlas, y quieres decid

> Los objetos del bucket tienen que ir cifrados con llaves que tú controlas, y quieres decidir qué rol puede usarlas. ¿Qué servicio administra esas llaves?

- Un grupo de seguridad
- AWS Shield
- Amazon CloudFront
- AWS KMS **(correcta)**

> KMS crea y controla las llaves de cifrado, y con IAM decides quién puede usarlas. Un grupo de seguridad filtra tráfico de red, no cifra objetos. Shield frena ataques de volumen. CloudFront entrega contenido.

### Servicios de gestión y monitoreo

#### 1. ¿Qué significan las siglas SNS?

> ¿Qué significan las siglas SNS?

- Web Application Firewall
- Simple Notification Service **(correcta)**
- Detección de amenazas
- Evaluación de vulnerabilidades

> A. Web Application Firewall: No es correcta porque es el nombre completo de WAF, no de SNS.
> B. Simple Notification Service: SNS corresponde a “Simple Notification Service”, el nombre completo de sus siglas.
> C. Detección de amenazas: No es correcta porque no corresponde al significado oficial de esas siglas.
> D. Evaluación de vulnerabilidades: No es correcta porque no corresponde al significado oficial de esas siglas.

#### 2. ¿Cuál es la función principal de Amazon Simple Notification Service (Amazon SNS)?

> ¿Cuál es la función principal de Amazon Simple Notification Service (Amazon SNS)?

- Es un servicio de mensajería pub/sub que distribuye notificaciones a suscriptores mediante protocolos o destinos compatibles. **(correcta)**
- Permite interactuar con servicios de AWS mediante comandos desde una terminal o scripts.
- Descubre y evalúa vulnerabilidades de software y exposiciones involuntarias en recursos compatibles.
- Permite administrar y gobernar varias cuentas de AWS de forma centralizada, con políticas y agrupaciones.

> A. Sí. Es un servicio de mensajería pub/sub que distribuye notificaciones a suscriptores mediante protocolos o destinos compatibles.
> B. No. Esa es la función de AWS Command Line Interface (AWS CLI).
> C. No. Esa es la función de Amazon Inspector.
> D. No. Esa es la función de AWS Organizations.

#### 3. ¿Cuáles son las siglas correspondientes a “Simple Notification Service”?

> ¿Cuáles son las siglas correspondientes a “Simple Notification Service”?

- EC2
- AMI
- S3
- SNS **(correcta)**

> A. EC2: no. EC2 significa “Elastic Compute Cloud”, no “Simple Notification Service”.
> B. AMI: no. AMI significa “Amazon Machine Image”, no “Simple Notification Service”.
> C. S3: no. S3 significa “Simple Storage Service”, no “Simple Notification Service”.
> D. SNS: sí. Es la abreviatura oficial de “Simple Notification Service”.

#### 4. Un sistema debe enviar una notificación a varios suscriptores cuando ocurre un evento. ¿Qu

> Un sistema debe enviar una notificación a varios suscriptores cuando ocurre un evento. ¿Qué servicio de AWS usas?

- AWS Shield
- Amazon CloudWatch
- Amazon Simple Notification Service (Amazon SNS) **(correcta)**
- Amazon Machine Image (AMI)

> A. No. Ese servicio sirve para absorber ataques de denegación de servicio.
> B. No. Ese servicio sirve para ver métricas, logs y alarmas.
> C. Sí. Amazon Simple Notification Service (Amazon SNS) es apropiado porque es un servicio de mensajería pub/sub que distribuye notificaciones a suscriptores mediante protocolos o destinos compatibles.
> D. No. Ese servicio sirve para definir la plantilla con la que se lanza una instancia.

#### 5. ¿Cómo aparece Artifact en la documentación de AWS?

> ¿Cómo aparece Artifact en la documentación de AWS?

- AWS WAF (AWS Web Application Firewall)
- AWS Artifact **(correcta)**
- Amazon GuardDuty
- Amazon Inspector

> A. AWS WAF (AWS Web Application Firewall): No es correcta porque corresponde a WAF, no a Artifact.
> B. AWS Artifact: El nombre oficial en inglés es “AWS Artifact”.
> C. Amazon GuardDuty: No es correcta porque corresponde a GuardDuty, no a Artifact.
> D. Amazon Inspector: No es correcta porque corresponde a Inspector, no a Artifact.

#### 6. ¿Cuál es la función principal de AWS Artifact?

> ¿Cuál es la función principal de AWS Artifact?

- Es un servicio de protección contra ataques de denegación de servicio distribuido (DDoS).
- Proporciona acceso bajo demanda a informes de cumplimiento, documentos de seguridad y acuerdos relacionados con AWS. **(correcta)**
- Centraliza y prioriza hallazgos de seguridad y ayuda a evaluar la postura de seguridad en AWS.
- Ofrece comprobaciones y recomendaciones para ayudar a optimizar costos, rendimiento, seguridad, tolerancia a fallos y límites de servicio, según el plan y las funciones disponibles.

> A. No. Esa es la función de AWS Shield.
> B. Sí. Proporciona acceso bajo demanda a informes de cumplimiento, documentos de seguridad y acuerdos relacionados con AWS.
> C. No. Esa es la función de AWS Security Hub.
> D. No. Esa es la función de AWS Trusted Advisor.

#### 7. ¿Para qué sirve AWS Artifact?

> ¿Para qué sirve AWS Artifact?

- Proporciona acceso bajo demanda a informes de cumplimiento, documentos de seguridad y acuerdos relacionados con AWS. **(correcta)**
- Es un servicio de protección contra ataques de denegación de servicio distribuido (DDoS).
- Centraliza y prioriza hallazgos de seguridad y ayuda a evaluar la postura de seguridad en AWS.
- Ofrece comprobaciones y recomendaciones para ayudar a optimizar costos, rendimiento, seguridad, tolerancia a fallos y límites de servicio, según el plan y las funciones disponibles.

> A. Sí. Proporciona acceso bajo demanda a informes de cumplimiento, documentos de seguridad y acuerdos relacionados con AWS.
> B. No. Eso es otro servicio. Artifact no hace eso.
> C. No. Eso es otro servicio. Artifact no hace eso.
> D. No. Eso es otro servicio. Artifact no hace eso.

#### 8. Tu equipo de cumplimiento necesita consultar informes de auditoría y documentación de cump

> Tu equipo de cumplimiento necesita consultar informes de auditoría y documentación de cumplimiento de AWS. ¿Qué servicio de AWS usas?

- AWS WAF (AWS Web Application Firewall)
- AWS Artifact **(correcta)**
- AWS CloudTrail
- AWS Lambda

> A. No. Ese servicio sirve para filtrar tráfico web malicioso.
> B. Sí. AWS Artifact es apropiado porque proporciona acceso bajo demanda a informes de cumplimiento, documentos de seguridad y acuerdos relacionados con AWS.
> C. No. Ese servicio sirve para registrar quién hizo qué en la cuenta.
> D. No. Ese servicio sirve para ejecutar código sin administrar servidores.

#### 9. ¿Qué significan las siglas AWS CLI?

> ¿Qué significan las siglas AWS CLI?

- Evaluación de vulnerabilidades
- AWS Command Line Interface **(correcta)**
- Centralización de hallazgos de seguridad
- Monitoreo y observabilidad

> A. Evaluación de vulnerabilidades: No es correcta porque no corresponde al significado oficial de esas siglas.
> B. AWS Command Line Interface: AWS CLI corresponde a “AWS Command Line Interface”, el nombre completo de sus siglas.
> C. Centralización de hallazgos de seguridad: No es correcta porque no corresponde al significado oficial de esas siglas.
> D. Monitoreo y observabilidad: No es correcta porque no corresponde al significado oficial de esas siglas.

#### 10. ¿Cuál es la función principal de AWS Command Line Interface (AWS CLI)?

> ¿Cuál es la función principal de AWS Command Line Interface (AWS CLI)?

- Permite interactuar con servicios de AWS mediante comandos desde una terminal o scripts. **(correcta)**
- Permite crear reglas para inspeccionar y filtrar solicitudes HTTP/HTTPS hacia aplicaciones web y APIs.
- Recopila y consulta métricas y registros, crea alarmas y permite observar el rendimiento y el estado de recursos y aplicaciones.
- Permite lanzar y ejecutar servidores virtuales llamados instancias, con capacidad de cómputo configurable.

> A. Sí. Permite interactuar con servicios de AWS mediante comandos desde una terminal o scripts.
> B. No. Esa es la función de AWS WAF (AWS Web Application Firewall).
> C. No. Esa es la función de Amazon CloudWatch.
> D. No. Esa es la función de Amazon Elastic Compute Cloud (Amazon EC2).

#### 11. ¿Cuáles son las siglas correspondientes a “AWS Command Line Interface”?

> ¿Cuáles son las siglas correspondientes a “AWS Command Line Interface”?

- EC2
- AMI
- AWS CLI **(correcta)**
- S3

> A. EC2: no. EC2 significa “Elastic Compute Cloud”, no “AWS Command Line Interface”.
> B. AMI: no. AMI significa “Amazon Machine Image”, no “AWS Command Line Interface”.
> C. AWS CLI: sí. Es la abreviatura oficial de “AWS Command Line Interface”.
> D. S3: no. S3 significa “Simple Storage Service”, no “AWS Command Line Interface”.

#### 12. Quieres ejecutar un comando desde la terminal para listar buckets de S3 o administrar recu

> Quieres ejecutar un comando desde la terminal para listar buckets de S3 o administrar recursos de AWS. ¿Qué servicio de AWS usas?

- Amazon GuardDuty
- AWS Organizations
- Amazon Simple Storage Service (Amazon S3)
- AWS Command Line Interface (AWS CLI) **(correcta)**

> A. No. Ese servicio sirve para detectar actividad sospechosa en la cuenta.
> B. No. Ese servicio sirve para agrupar y gobernar varias cuentas.
> C. No. Ese servicio sirve para guardar archivos y respaldos en buckets.
> D. Sí. AWS Command Line Interface (AWS CLI) es apropiado porque permite interactuar con servicios de AWS mediante comandos desde una terminal o scripts.

#### 13. ¿Cómo aparece CloudWatch en la documentación de AWS?

> ¿Cómo aparece CloudWatch en la documentación de AWS?

- AWS Trusted Advisor
- Amazon CloudWatch **(correcta)**
- Amazon Elastic Compute Cloud (Amazon EC2)
- Amazon Machine Image (AMI)

> A. AWS Trusted Advisor: No es correcta porque corresponde a Trusted Advisor, no a CloudWatch.
> B. Amazon CloudWatch: El nombre oficial en inglés es “Amazon CloudWatch”.
> C. Amazon Elastic Compute Cloud (Amazon EC2): No es correcta porque corresponde a EC2, no a CloudWatch.
> D. Amazon Machine Image (AMI): No es correcta porque corresponde a AMI, no a CloudWatch.

#### 14. ¿Cuál es la función principal de Amazon CloudWatch?

> ¿Cuál es la función principal de Amazon CloudWatch?

- Permite administrar y gobernar varias cuentas de AWS de forma centralizada, con políticas y agrupaciones.
- Recopila y consulta métricas y registros, crea alarmas y permite observar el rendimiento y el estado de recursos y aplicaciones. **(correcta)**
- Ejecuta código en respuesta a eventos sin que tengas que administrar directamente los servidores; AWS gestiona la infraestructura subyacente.
- Es una base de datos NoSQL administrada que admite modelos de datos clave-valor y documentos.

> A. No. Esa es la función de AWS Organizations.
> B. Sí. Recopila y consulta métricas y registros, crea alarmas y permite observar el rendimiento y el estado de recursos y aplicaciones.
> C. No. Esa es la función de AWS Lambda.
> D. No. Esa es la función de Amazon DynamoDB.

#### 15. ¿Para qué sirve Amazon CloudWatch?

> ¿Para qué sirve Amazon CloudWatch?

- Recopila y consulta métricas y registros, crea alarmas y permite observar el rendimiento y el estado de recursos y aplicaciones. **(correcta)**
- Permite administrar y gobernar varias cuentas de AWS de forma centralizada, con políticas y agrupaciones.
- Ejecuta código en respuesta a eventos sin que tengas que administrar directamente los servidores; AWS gestiona la infraestructura subyacente.
- Es una base de datos NoSQL administrada que admite modelos de datos clave-valor y documentos.

> A. Sí. Recopila y consulta métricas y registros, crea alarmas y permite observar el rendimiento y el estado de recursos y aplicaciones.
> B. No. Eso es otro servicio. CloudWatch no hace eso.
> C. No. Eso es otro servicio. CloudWatch no hace eso.
> D. No. Eso es otro servicio. CloudWatch no hace eso.

#### 16. Quieres crear una alarma cuando aumente el uso de CPU de una instancia EC2 y revisar sus m

> Quieres crear una alarma cuando aumente el uso de CPU de una instancia EC2 y revisar sus métricas. ¿Qué servicio de AWS usas?

- AWS Trusted Advisor
- Amazon CloudWatch **(correcta)**
- Amazon Elastic Block Store (Amazon EBS)
- AWS Key Management Service (AWS KMS)

> A. No. Ese servicio sirve para recomendarte cómo mejorar costo, seguridad y rendimiento.
> B. Sí. Amazon CloudWatch es apropiado porque recopila y consulta métricas y registros, crea alarmas y permite observar el rendimiento y el estado de recursos y aplicaciones.
> C. No. Ese servicio sirve para dar un disco a una instancia.
> D. No. Ese servicio sirve para crear y cuidar claves de cifrado.

#### 17. ¿Cómo aparece CloudTrail en la documentación de AWS?

> ¿Cómo aparece CloudTrail en la documentación de AWS?

- AWS CloudTrail **(correcta)**
- Amazon Elastic Compute Cloud (Amazon EC2)
- Amazon Machine Image (AMI)
- AWS Lambda

> A. AWS CloudTrail: El nombre oficial en inglés es “AWS CloudTrail”.
> B. Amazon Elastic Compute Cloud (Amazon EC2): No es correcta porque corresponde a EC2, no a CloudTrail.
> C. Amazon Machine Image (AMI): No es correcta porque corresponde a AMI, no a CloudTrail.
> D. AWS Lambda: No es correcta porque corresponde a Lambda, no a CloudTrail.

#### 18. ¿Cuál es la función principal de AWS CloudTrail?

> ¿Cuál es la función principal de AWS CloudTrail?

- Registra la actividad de las cuentas de AWS, incluidas muchas acciones realizadas mediante la consola, SDKs y API. **(correcta)**
- Ofrece comprobaciones y recomendaciones para ayudar a optimizar costos, rendimiento, seguridad, tolerancia a fallos y límites de servicio, según el plan y las funciones disponibles.
- Almacena y recupera objetos, como imágenes, documentos, respaldos y archivos estáticos, dentro de buckets.
- Facilita configurar, operar y escalar bases de datos relacionales administradas.

> A. Sí. Registra la actividad de las cuentas de AWS, incluidas muchas acciones realizadas mediante la consola, SDKs y API.
> B. No. Esa es la función de AWS Trusted Advisor.
> C. No. Esa es la función de Amazon Simple Storage Service (Amazon S3).
> D. No. Esa es la función de Amazon Relational Database Service (Amazon RDS).

#### 19. ¿Para qué sirve AWS CloudTrail?

> ¿Para qué sirve AWS CloudTrail?

- Registra la actividad de las cuentas de AWS, incluidas muchas acciones realizadas mediante la consola, SDKs y API. **(correcta)**
- Ofrece comprobaciones y recomendaciones para ayudar a optimizar costos, rendimiento, seguridad, tolerancia a fallos y límites de servicio, según el plan y las funciones disponibles.
- Almacena y recupera objetos, como imágenes, documentos, respaldos y archivos estáticos, dentro de buckets.
- Facilita configurar, operar y escalar bases de datos relacionales administradas.

> A. Sí. Registra la actividad de las cuentas de AWS, incluidas muchas acciones realizadas mediante la consola, SDKs y API.
> B. No. Eso es otro servicio. CloudTrail no hace eso.
> C. No. Eso es otro servicio. CloudTrail no hace eso.
> D. No. Eso es otro servicio. CloudTrail no hace eso.

#### 20. Necesitas investigar quién realizó una acción administrativa o cuándo se hizo una llamada 

> Necesitas investigar quién realizó una acción administrativa o cuándo se hizo una llamada a la API. ¿Qué servicio de AWS usas?

- AWS CloudTrail **(correcta)**
- Amazon Elastic Compute Cloud (Amazon EC2)
- Amazon Elastic File System (Amazon EFS)
- Amazon Virtual Private Cloud (Amazon VPC)

> A. Sí. AWS CloudTrail es apropiado porque registra la actividad de las cuentas de AWS, incluidas muchas acciones realizadas mediante la consola, SDKs y API.
> B. No. Ese servicio sirve para ejecutar servidores virtuales.
> C. No. Ese servicio sirve para compartir archivos entre varios servidores.
> D. No. Ese servicio sirve para definir tu red privada en AWS.

#### 21. ¿Cómo aparece Organizations en la documentación de AWS?

> ¿Cómo aparece Organizations en la documentación de AWS?

- AWS Organizations **(correcta)**
- Amazon Machine Image (AMI)
- AWS Lambda
- Amazon Simple Storage Service (Amazon S3)

> A. AWS Organizations: El nombre oficial en inglés es “AWS Organizations”.
> B. Amazon Machine Image (AMI): No es correcta porque corresponde a AMI, no a Organizations.
> C. AWS Lambda: No es correcta porque corresponde a Lambda, no a Organizations.
> D. Amazon Simple Storage Service (Amazon S3): No es correcta porque corresponde a S3, no a Organizations.

#### 22. ¿Cuál es la función principal de AWS Organizations?

> ¿Cuál es la función principal de AWS Organizations?

- Permite lanzar y ejecutar servidores virtuales llamados instancias, con capacidad de cómputo configurable.
- Proporciona volúmenes de almacenamiento en bloques que pueden asociarse a instancias EC2 compatibles.
- Permite administrar identidades y permisos para controlar quién puede acceder a los recursos de AWS y qué acciones puede realizar.
- Permite administrar y gobernar varias cuentas de AWS de forma centralizada, con políticas y agrupaciones. **(correcta)**

> A. No. Esa es la función de Amazon Elastic Compute Cloud (Amazon EC2).
> B. No. Esa es la función de Amazon Elastic Block Store (Amazon EBS).
> C. No. Esa es la función de AWS Identity and Access Management (IAM).
> D. Sí. Permite administrar y gobernar varias cuentas de AWS de forma centralizada, con políticas y agrupaciones.

#### 23. ¿Para qué sirve AWS Organizations?

> ¿Para qué sirve AWS Organizations?

- Permite administrar y gobernar varias cuentas de AWS de forma centralizada, con políticas y agrupaciones. **(correcta)**
- Permite lanzar y ejecutar servidores virtuales llamados instancias, con capacidad de cómputo configurable.
- Proporciona volúmenes de almacenamiento en bloques que pueden asociarse a instancias EC2 compatibles.
- Permite administrar identidades y permisos para controlar quién puede acceder a los recursos de AWS y qué acciones puede realizar.

> A. Sí. Permite administrar y gobernar varias cuentas de AWS de forma centralizada, con políticas y agrupaciones.
> B. No. Eso es otro servicio. Organizations no hace eso.
> C. No. Eso es otro servicio. Organizations no hace eso.
> D. No. Eso es otro servicio. Organizations no hace eso.

#### 24. Una empresa tiene varias cuentas de AWS y quiere aplicar controles y organizar su administ

> Una empresa tiene varias cuentas de AWS y quiere aplicar controles y organizar su administración de manera centralizada. ¿Qué servicio de AWS usas?

- AWS Organizations **(correcta)**
- Amazon Machine Image (AMI)
- Amazon DynamoDB
- Amazon CloudFront

> A. Sí. AWS Organizations es apropiado porque permite administrar y gobernar varias cuentas de AWS de forma centralizada, con políticas y agrupaciones.
> B. No. Ese servicio sirve para definir la plantilla con la que se lanza una instancia.
> C. No. Ese servicio sirve para guardar datos NoSQL.
> D. No. Ese servicio sirve para acercar el contenido a quien lo consulta.

#### 25. ¿Cómo aparece Trusted Advisor en la documentación de AWS?

> ¿Cómo aparece Trusted Advisor en la documentación de AWS?

- AWS Lambda
- AWS Trusted Advisor **(correcta)**
- Amazon Simple Storage Service (Amazon S3)
- Amazon Elastic Block Store (Amazon EBS)

> A. AWS Lambda: No es correcta porque corresponde a Lambda, no a Trusted Advisor.
> B. AWS Trusted Advisor: El nombre oficial en inglés es “AWS Trusted Advisor”.
> C. Amazon Simple Storage Service (Amazon S3): No es correcta porque corresponde a S3, no a Trusted Advisor.
> D. Amazon Elastic Block Store (Amazon EBS): No es correcta porque corresponde a EBS, no a Trusted Advisor.

#### 26. ¿Cuál es la función principal de AWS Trusted Advisor?

> ¿Cuál es la función principal de AWS Trusted Advisor?

- Es una plantilla que contiene información necesaria para lanzar una instancia EC2, como el sistema operativo y la configuración inicial.
- Ofrece comprobaciones y recomendaciones para ayudar a optimizar costos, rendimiento, seguridad, tolerancia a fallos y límites de servicio, según el plan y las funciones disponibles. **(correcta)**
- Ofrece un sistema de archivos administrado y escalable que puede compartirse entre múltiples recursos compatibles.
- Permite crear y administrar claves criptográficas y controlar su uso para cifrar datos en servicios compatibles.

> A. No. Esa es la función de Amazon Machine Image (AMI).
> B. Sí. Ofrece comprobaciones y recomendaciones para ayudar a optimizar costos, rendimiento, seguridad, tolerancia a fallos y límites de servicio, según el plan y las funciones disponibles.
> C. No. Esa es la función de Amazon Elastic File System (Amazon EFS).
> D. No. Esa es la función de AWS Key Management Service (AWS KMS).

#### 27. ¿Para qué sirve AWS Trusted Advisor?

> ¿Para qué sirve AWS Trusted Advisor?

- Ofrece comprobaciones y recomendaciones para ayudar a optimizar costos, rendimiento, seguridad, tolerancia a fallos y límites de servicio, según el plan y las funciones disponibles. **(correcta)**
- Es una plantilla que contiene información necesaria para lanzar una instancia EC2, como el sistema operativo y la configuración inicial.
- Ofrece un sistema de archivos administrado y escalable que puede compartirse entre múltiples recursos compatibles.
- Permite crear y administrar claves criptográficas y controlar su uso para cifrar datos en servicios compatibles.

> A. Sí. Ofrece comprobaciones y recomendaciones para ayudar a optimizar costos, rendimiento, seguridad, tolerancia a fallos y límites de servicio, según el plan y las funciones disponibles.
> B. No. Eso es otro servicio. Trusted Advisor no hace eso.
> C. No. Eso es otro servicio. Trusted Advisor no hace eso.
> D. No. Eso es otro servicio. Trusted Advisor no hace eso.

#### 28. Quieres recibir recomendaciones para reducir costos y mejorar la seguridad y la confiabili

> Quieres recibir recomendaciones para reducir costos y mejorar la seguridad y la confiabilidad de tus recursos de AWS. ¿Qué servicio de AWS usas?

- AWS Lambda
- AWS Trusted Advisor **(correcta)**
- Amazon Relational Database Service (Amazon RDS)
- Amazon Route 53

> A. No. Ese servicio sirve para ejecutar código sin administrar servidores.
> B. Sí. AWS Trusted Advisor es apropiado porque ofrece comprobaciones y recomendaciones para ayudar a optimizar costos, rendimiento, seguridad, tolerancia a fallos y límites de servicio, según el plan y las funciones disponibles.
> C. No. Ese servicio sirve para operar una base de datos relacional.
> D. No. Ese servicio sirve para resolver nombres de dominio.

#### 29. Para una auditoría te piden los informes de AWS: ISO, PCI y los SOC. ¿Dónde los descargas?

> Para una auditoría te piden los informes de AWS: ISO, PCI y los SOC. ¿Dónde los descargas?

- AWS Trusted Advisor
- AWS Artifact **(correcta)**
- AWS Certificate Manager
- AWS Security Token Service

> Artifact es el portal de los informes de cumplimiento de AWS, como ISO, PCI y SOC. Certificate Manager emite certificados TLS. STS da credenciales temporales. Trusted Advisor recomienda mejoras; no entrega esos informes.

#### 30. Alguien borró un bucket ayer. Quieres el usuario, la hora y la llamada a la API. ¿Qué serv

> Alguien borró un bucket ayer. Quieres el usuario, la hora y la llamada a la API. ¿Qué servicio guarda eso?

- AWS Trusted Advisor
- AWS CloudTrail **(correcta)**
- Amazon CloudWatch
- AWS Config

> CloudTrail es el registro de auditoría: quién llamó a la API. CloudWatch mide y alarma. Config dice si el recurso sigue cumpliendo una regla. Trusted Advisor recomienda mejoras.

#### 31. La empresa tiene varias cuentas de AWS y quiere una sola factura y políticas que limiten l

> La empresa tiene varias cuentas de AWS y quiere una sola factura y políticas que limiten lo que esas cuentas pueden hacer. ¿Qué usas?

- AWS Organizations **(correcta)**
- AWS IAM, con un solo usuario para todas
- Amazon VPC Peering
- AWS Artifact

> Organizations agrupa cuentas, une la facturación y aplica políticas de control. IAM decide permisos dentro de una cuenta, no junta la factura de varias. VPC Peering conecta redes. Artifact entrega informes.

#### 32. La web toma pedidos y otro proceso los prepara. Si ese proceso se cae, el pedido tiene que

> La web toma pedidos y otro proceso los prepara. Si ese proceso se cae, el pedido tiene que quedar guardado hasta que vuelva. ¿Qué servicio usas?

- Amazon SES
- Amazon CloudFront
- Amazon SQS **(correcta)**
- Amazon SNS

> SQS es una cola: el mensaje espera a que un proceso lo tome. SNS avisa a varios a la vez y no guarda el trabajo para después. SES envía correo de tu aplicación. CloudFront acerca contenido.

#### 33. Quieres un aviso cuando la CPU de la instancia pase de 80% durante cinco minutos. ¿Qué ser

> Quieres un aviso cuando la CPU de la instancia pase de 80% durante cinco minutos. ¿Qué servicio mide eso y dispara la alarma?

- AWS Config
- AWS Artifact
- Amazon CloudWatch **(correcta)**
- AWS CloudTrail

> CloudWatch recoge métricas, como la CPU, y dispara alarmas. CloudTrail registra llamadas a la API. Config vigila la configuración del recurso. Artifact entrega informes de cumplimiento.

#### 34. Quieres un correo cuando el gasto del mes vaya a pasar de un monto que tú fijas, antes de 

> Quieres un correo cuando el gasto del mes vaya a pasar de un monto que tú fijas, antes de que llegue la factura. ¿Qué configuras?

- Amazon GuardDuty
- AWS Budgets **(correcta)**
- AWS Cost Explorer, que muestra el historial
- AWS Artifact

> Budgets compara el gasto real o el previsto con un monto y te avisa. Cost Explorer te ayuda a ver en qué se fue el dinero, no a fijar esa alerta. Artifact entrega informes. GuardDuty vigila amenazas.

#### 35. Finanzas pregunta qué servicio gastó más el mes pasado. ¿Dónde lo ves?

> Finanzas pregunta qué servicio gastó más el mes pasado. ¿Dónde lo ves?

- AWS Cost Explorer **(correcta)**
- AWS Artifact
- Amazon CloudWatch, en la gráfica de CPU
- AWS Secrets Manager

> Cost Explorer desglosa el gasto por servicio y por tiempo. Artifact entrega informes de cumplimiento, no la factura. CloudWatch mide el uso, no el costo. Secrets Manager guarda contraseñas.

#### 36. Una instancia lleva semanas al 5% de CPU. Quieres que AWS te diga un tamaño más chico que 

> Una instancia lleva semanas al 5% de CPU. Quieres que AWS te diga un tamaño más chico que alcance. ¿Qué servicio lo recomienda?

- AWS Budgets
- AWS Artifact
- Amazon GuardDuty
- AWS Compute Optimizer **(correcta)**

> Compute Optimizer mira el uso y recomienda un tamaño de instancia que encaje. Budgets vigila el monto, no el tamaño. Artifact entrega informes. GuardDuty vigila amenazas, no el tamaño de la máquina.

#### 37. Cuando se cobra un pedido, el almacén, el correo al cliente y un tablero tienen que entera

> Cuando se cobra un pedido, el almacén, el correo al cliente y un tablero tienen que enterarse al mismo tiempo. ¿Qué servicio avisa a los tres?

- Amazon S3
- AWS CloudTrail
- Amazon SNS **(correcta)**
- Amazon SQS, con un solo proceso leyendo la cola

> SNS publica un aviso y lo reciben varios a la vez. Una cola SQS guarda el mensaje para un proceso que lo toma; no avisa a tres destinos por sí sola. S3 guarda el archivo. CloudTrail registra la llamada.

### Conceptos de la nube

#### 1. ¿Qué es una Región de AWS?

> ¿Qué es una Región de AWS?

- Un área geográfica con múltiples Availability Zones **(correcta)**
- Un único datacenter físico
- Solo una cuenta de facturación
- Un tipo de instancia EC2

> Región = geografía; AZ = datacenters aislados dentro.

#### 2. ¿Qué aporta desplegar en varias Availability Zones?

> ¿Qué aporta desplegar en varias Availability Zones?

- Reducir automáticamente el precio de S3
- Eliminar la necesidad de IAM
- Convertir EC2 en serverless
- Mayor alta disponibilidad ante fallos de un datacenter **(correcta)**

> Multi-AZ mitiga fallos de una AZ.

#### 3. Pasar de datacenter propio a cloud suele reducir…

> Pasar de datacenter propio a cloud suele reducir…

- La necesidad de copias de seguridad
- El cifrado de datos
- CAPEX (inversión de capital) a favor de OPEX **(correcta)**
- Solo el ancho de banda de Internet en casa

> Cloud: pago por uso (OPEX) vs comprar hardware (CAPEX).

#### 4. ¿Qué beneficio cloud describe ajustar recursos según demanda?

> ¿Qué beneficio cloud describe ajustar recursos según demanda?

- Root account sharing
- Elasticidad / escalado **(correcta)**
- Vendor lock-in
- Cold storage obligatorio

> Escalar up/down según carga es un valor cloud clave.

#### 5. El AWS Well-Architected Framework organiza buenas prácticas en…

> El AWS Well-Architected Framework organiza buenas prácticas en…

- Pilares (p. ej. seguridad, fiabilidad, rendimiento, coste, ops, sostenibilidad) **(correcta)**
- Solo regiones geográficas
- Tipos de instancia EC2
- Planes de soporte

> WA Framework = pilares de diseño cloud.

#### 6. ¿Qué son las edge locations principalmente asociadas a CloudFront?

> ¿Qué son las edge locations principalmente asociadas a CloudFront?

- Availability Zones dentro de una Región
- Cuentas de facturación
- Roles IAM
- Puntos de presencia para cachear y entregar contenido cerca del usuario **(correcta)**

> Edge locations acercan contenido; no son AZs de cómputo típico.

#### 7. Regiones, AZs y edge locations forman parte de…

> Regiones, AZs y edge locations forman parte de…

- Únicamente AWS Outposts
- El modelo de precios Spot
- La infraestructura global de AWS **(correcta)**
- Solo el Free Tier

> Infra global: Regions, AZs, Points of Presence.

#### 8. Diseñar para fallos y multi-AZ mejora principalmente el pilar de…

> Diseñar para fallos y multi-AZ mejora principalmente el pilar de…

- Operaciones de facturación
- Fiabilidad (Reliability) **(correcta)**
- Coste únicamente
- Sostenibilidad únicamente

> Reliability pillar: resiliencia ante fallos.

#### 9. El modelo de precios “pay-as-you-go” de AWS enfatiza…

> El modelo de precios “pay-as-you-go” de AWS enfatiza…

- Pagar solo por lo que consumes **(correcta)**
- Contratos mínimos de 10 años siempre
- Hardware on-prem obligatorio
- Licencias perpetuas de hipervisor

> Consumo On-Demand (en inglés) = OPEX flexible.

#### 10. Desplegar recursos en minutos en lugar de comprar hardware ilustra…

> Desplegar recursos en minutos en lugar de comprar hardware ilustra…

- Vendor lock-in inevitable
- Pérdida de elasticidad
- CAPEX obligatorio
- Agilidad / velocidad de innovación en cloud **(correcta)**

> Cloud acelera experimentación y entrega.

#### 11. Pasar de gasto de capital (CAPEX) a gasto operativo (OPEX) significa…

> Pasar de gasto de capital (CAPEX) a gasto operativo (OPEX) significa…

- Pagas por uso, en lugar de comprar el hardware por adelantado **(correcta)**
- Comprar más servidores propios
- Dejar de cifrar los datos
- Dejar de usar IAM

> En un centro de datos propio el gasto grande es al comprar (CAPEX). En AWS pagas por lo que usas (OPEX). La guía del examen lo llama el cambio de CAPEX a OPEX.

#### 12. Economías de escala en AWS permiten…

> Economías de escala en AWS permiten…

- Licencias ilimitadas y gratis
- Quitar las zonas de disponibilidad
- Trabajar sin acuerdo de nivel de servicio
- Precios más bajos por el volumen agregado de clientes **(correcta)**

> AWS compra a escala enorme y por eso puede cobrar menos que si montaras el mismo centro de datos tú solo. Eso son las economías de escala.

#### 13. Un equilibrio típico al diseñar en la nube es…

> Un equilibrio típico al diseñar en la nube es…

- Apagar todos los logs
- Usar una sola Región para todo el mundo
- Costo frente a rendimiento y disponibilidad **(correcta)**
- Elegir el logo de la cuenta

> Más disponibilidad o más rendimiento suele costar más. El examen espera que reconozcas ese equilibrio, no que haya una opción gratis y perfecta.

#### 14. Un principio del Marco de Buena Arquitectura (AWS Well-Architected) es…

> Un principio del Marco de Buena Arquitectura (AWS Well-Architected) es…

- Usar el root user en las aplicaciones
- Automatizar para facilitar la excelencia operativa **(correcta)**
- Dejar secretos escritos en el código
- Usar siempre una sola Availability Zone

> El Marco de Buena Arquitectura (Well-Architected) pide automatizar lo repetible. Dejar secretos en el código o usar el root user en una aplicación va en contra.

#### 15. El pilar de optimización de costos (Cost Optimization) busca…

> El pilar de optimización de costos (Cost Optimization) busca…

- Evitar costos innecesarios y elegir el modelo de precios que encaja **(correcta)**
- Comprar el máximo de hardware por adelantado
- Apagar el monitoreo
- No etiquetar los recursos

> El pilar de optimización de costos pide pagar solo por lo que aporta y elegir el modelo de precios que encaja. Esos nombres van en inglés: On-Demand, Reserved, Spot o Savings Plans.

#### 16. El pilar de fiabilidad (Reliability) busca…

> El pilar de fiabilidad (Reliability) busca…

- Que la consola se vea bien
- Trabajar sin copias de seguridad
- Depender de una sola instancia para siempre
- Recuperarte de un fallo y mantener la carga disponible **(correcta)**

> Fiabilidad, en el Marco de Buena Arquitectura, es que el sistema siga o se recupere cuando falla una pieza. Una sola instancia, sin copias, no lo cumple.

#### 17. El pilar de seguridad incluye…

> El pilar de seguridad incluye…

- Guardar todo sin cifrar
- Abrir todos los puertos a internet
- Identidad, detección, protección de datos y respuesta **(correcta)**
- Solo la campaña de marketing

> Seguridad en AWS empieza por quién entra (IAM), cómo te enteras de un problema, cómo proteges los datos y cómo respondes.

#### 18. El pilar de eficiencia del rendimiento trata de…

> El pilar de eficiencia del rendimiento trata de…

- Atender a todo el mundo desde una sola Región
- Usar recursos de cómputo/almacenamiento/red de forma eficiente **(correcta)**
- Pagar siempre el máximo On-Demand
- No usar caché

> Eficiencia del rendimiento es usar el cómputo, el almacenamiento y la red del tamaño correcto, no el más grande por costumbre.

#### 19. El pilar de excelencia operativa se centra en…

> El pilar de excelencia operativa se centra en…

- Ejecutar y monitorear sistemas para entregar valor de negocio **(correcta)**
- Quitar la integración y el despliegue continuos
- Cambiar producción a mano, sin revisión
- Operar sin métricas

> Excelencia operativa es operar con procedimientos claros, cambios revisados y métricas. El cambio a mano en producción, sin medición, se sale de ese pilar.

#### 20. El pilar de sostenibilidad busca…

> El pilar de sostenibilidad busca…

- Dejar instancias EC2 encendidas sin trabajo
- Replicar a veinte Regiones sin necesidad
- Apagar el registro de actividad
- Minimizar el impacto ambiental de las cargas en la nube **(correcta)**

> Sostenibilidad es usar menos recursos de los que la carga necesita: no dejar instancias encendidas sin trabajo ni replicar a regiones que no usas.

#### 21. Las zonas de disponibilidad (Availability Zones) están…

> Las zonas de disponibilidad (Availability Zones) están…

- Sin red entre sí
- Solo para S3
- Aisladas físicamente pero conectadas con baja latencia en una Región **(correcta)**
- En continentes distintos siempre

> Una Availability Zone (en inglés) es uno o más centros de datos aislados. Varias de la misma Region están cerca entre sí, con red de baja latencia, para que puedas repartir la carga.

#### 22. Eliges una Región de AWS según…

> Eliges una Región de AWS según…

- Cuántas personas hay en tu equipo
- Latencia, leyes que debes cumplir, servicios disponibles y precio **(correcta)**
- El idioma de la consola
- El orden alfabético del nombre

> La Región define dónde viven los datos, qué tan lejos están de tus usuarios, qué servicios hay y cuánto cuestan. La documentación de la infraestructura global de AWS lista esos criterios.

#### 23. Los puntos de presencia (edge locations) sirven sobre todo para…

> Los puntos de presencia (edge locations) sirven sobre todo para…

- Acercar contenido, DNS y el firewall de aplicaciones al usuario **(correcta)**
- Alojar ahí la base de datos principal
- Guardar ahí el disco de arranque de una instancia
- Ejecutar ahí los flujos de orquestación

> Un punto de presencia acerca CloudFront, DNS y WAF a quien consulta. No es el lugar donde vive tu base de datos principal ni el disco de una instancia.

#### 24. La elasticidad de la nube significa…

> La elasticidad de la nube significa…

- Dejar la capacidad fija durante tres años
- Quedarte solo con servidores propios
- No medir el uso
- Subir o bajar la capacidad según la demanda **(correcta)**

> Elasticidad es subir o bajar la capacidad cuando cambia la demanda, y pagar en consecuencia. No es dejar la misma capacidad fija durante años.

#### 25. La infraestructura como código permite…

> La infraestructura como código permite…

- Cambiar la infraestructura sin revisión
- Pegar secretos en un chat
- Definir infraestructura en plantillas versionadas **(correcta)**
- Configurar todo a mano en la consola

> Infrastructure as code (en inglés; en AWS, CloudFormation) describe los recursos en un archivo que puedes versionar y repetir. No es configurar todo a mano en la consola.

#### 26. Desacoplar componentes mejora…

> Desacoplar componentes mejora…

- No reintentar cuando algo falla
- Que cada pieza aguante y escale por su cuenta, por ejemplo con colas **(correcta)**
- Que todo dependa de una sola conexión
- Obligar a un solo programa para todo

> Desacoplar es que una pieza pueda fallar o crecer sin tumbar a las demás. Una cola entre dos servicios es el ejemplo clásico.

#### 27. Al diseñar en la nube conviene…

> Al diseñar en la nube conviene…

- Paralelizar trabajo y usar servicios gestionados **(correcta)**
- Hacer todo el trabajo en un solo proceso
- No usar grupos de autoescalado
- Bloquear las APIs

> La nube rinde cuando partes el trabajo y usas servicios que ya escalan, en lugar de un solo proceso que lo hace todo.

#### 28. Debes probar a escala porque…

> Debes probar a escala porque…

- Porque la nube no falla
- Basta con probarlo en tu laptop
- Las métricas no importan
- Los cuellos de botella aparecen bajo carga real **(correcta)**

> Un sistema que va bien con un usuario puede atascarse con mil. Hay que probarlo con la carga que esperas, no solo en tu laptop.

#### 29. Automatiza cambios para…

> Automatiza cambios para…

- Entrar por SSH a producción a arreglar a mano
- No tener un flujo de despliegue
- Reducir error humano y aumentar consistencia **(correcta)**
- Evitar las plantillas de infraestructura

> Un cambio automático y revisado se puede repetir. Entrar por SSH a producción a arreglar algo a mano no se puede repetir ni auditar.

#### 30. Mide todo lo relevante porque…

> Mide todo lo relevante porque…

- Las alarmas estorban
- Sin métricas no puedes mejorar costo, rendimiento ni fiabilidad **(correcta)**
- AWS cobra siempre lo mismo
- Los logs sobran

> Sin métricas no sabes si estás gastando de más, si algo va lento o si está a punto de caer. CloudWatch existe para eso.

#### 31. En el shared responsibility model (en inglés), aplicar parches al sistema operativo de una

> En el shared responsibility model (en inglés), aplicar parches al sistema operativo de una instancia EC2 es…

- Responsabilidad del cliente **(correcta)**
- Solo de AWS siempre
- De Route 53
- De CloudFront

> AWS parchea la infraestructura. El sistema operativo que instalaste en EC2 lo parcheas tú. Es el mismo corte que en la guía: seguridad de la nube frente a seguridad en la nube.

#### 32. Usar un servicio administrado por AWS reduce…

> Usar un servicio administrado por AWS reduce…

- La necesidad de IAM
- Todo el costo a cero
- La necesidad de cifrado
- El trabajo de parches y de alta disponibilidad del motor **(correcta)**

> En RDS, por ejemplo, AWS se encarga de los parches del motor y de la alta disponibilidad que configures. Tú sigues siendo responsable de los accesos, los datos y el cifrado.

#### 33. En el shared responsibility model (en inglés), ¿quién parchea el sistema operativo del hos

> En el shared responsibility model (en inglés), ¿quién parchea el sistema operativo del host de una instancia EC2, el que está debajo de tu máquina virtual?

- El cliente
- AWS y el cliente, a medias
- Ni AWS ni el cliente
- AWS **(correcta)**

> AWS parchea el host: el hardware y la virtualización, la seguridad de la nube. El sistema operativo invitado, el que ves dentro de la instancia, lo parcheas tú.

#### 34. Tienes una instancia EC2 con Linux. Hay un parche de seguridad para ese Linux. ¿Quién lo a

> Tienes una instancia EC2 con Linux. Hay un parche de seguridad para ese Linux. ¿Quién lo aplica?

- AWS, porque es el sistema operativo del host
- Nadie: EC2 no recibe parches
- Tú, porque es el sistema operativo invitado **(correcta)**
- AWS, porque toda instancia se parchea sola

> El Linux que instalaste es el sistema invitado: seguridad en la nube, y te toca a ti. AWS parchea el host, no el sistema que corre dentro de tu instancia.

#### 35. ¿Cuál de estos pares son servicios regionales, es decir, los creas dentro de la Región que

> ¿Cuál de estos pares son servicios regionales, es decir, los creas dentro de la Región que eliges?

- AWS IAM y Amazon CloudFront
- Amazon Route 53 y Amazon CloudFront
- AWS IAM y Amazon Route 53
- Amazon EC2 y Amazon EFS **(correcta)**

> EC2 y EFS viven en una Región. IAM vale para toda la cuenta. Route 53 y CloudFront usan la red global: DNS y puntos de presencia, no una sola Región.

#### 36. ¿Cuál de estas es una ventaja de la computación en la nube?

> ¿Cuál de estas es una ventaja de la computación en la nube?

- Tener economías de escala menores que un centro de datos propio
- Cambiar gasto de capital por gasto variable **(correcta)**
- Cambiar gasto variable por gasto de capital
- Pagar menos en la tienda en línea de Amazon

> Dejas de comprar servidores por adelantado y pagas por lo que usas. La nube suma la demanda de muchos clientes, así que la escala es mayor, no menor. La tienda de Amazon no descuenta tu factura de AWS.

#### 37. Una empresa tarda meses en comprar servidores antes de probar una idea. En AWS los lanza e

> Una empresa tarda meses en comprar servidores antes de probar una idea. En AWS los lanza en minutos. ¿Qué ventaja es?

- Más velocidad y agilidad **(correcta)**
- Menos elasticidad
- Obligación de seguir comprando hardware
- Descuentos de la tienda Amazon.com

> Agilidad es pasar de la idea al recurso en minutos, sin esperar una compra. Elasticidad es otra ventaja: subes o bajas capacidad. No tiene que ver con la tienda de Amazon.

#### 38. Una empresa va a usar AWS para ampliar su centro de datos propio y atender clientes en var

> Una empresa va a usar AWS para ampliar su centro de datos propio y atender clientes en varios países. ¿Qué beneficio obtiene de AWS?

- Cambiar un costo variable bajo por una inversión grande por adelantado
- Descuentos masivos en la tienda Amazon.com
- Cambiar un costo variable alto por comprar la infraestructura por adelantado
- Economías de escala muy grandes **(correcta)**

> AWS compra y opera a una escala que una empresa sola no alcanza, y ese costo menor se refleja en el precio. El movimiento es al revés del que dicen las otras opciones: de gasto de capital a gasto por uso.

#### 39. Si un centro de datos de la Región falla, la aplicación tiene que seguir en otro centro de

> Si un centro de datos de la Región falla, la aplicación tiene que seguir en otro centro de la misma Región. ¿Qué diseño lo consigue?

- Apagar las copias de seguridad para que responda más rápido
- Repartirla en varias zonas de disponibilidad **(correcta)**
- Dejarla en una sola instancia, en una sola zona
- Moverla a una edge location

> Una Availability Zone (en inglés) es uno o más centros de datos aislados dentro de la Region. Varias aguantan la caída de una. Una edge location acerca contenido; no sustituye ese diseño. Quitar las copias no da alta disponibilidad.

### Conceptos de arquitectura de AWS

#### 1. Quieres contratar a AWS, de pago y por proyecto, para que un equipo especializado te ayude

> Quieres contratar a AWS, de pago y por proyecto, para que un equipo especializado te ayude a adoptar la nube con un resultado de negocio concreto. ¿Qué canal es?

- El plan Enterprise Support
- El Technical Account Manager
- AWS Professional Services **(correcta)**
- El soporte Concierge

> Professional Services son proyectos de pago, en áreas de especialidad, para un resultado de adopción. El plan Enterprise es soporte. El TAM es la persona de contacto de ese plan. Concierge ayuda con la facturación dentro de Enterprise, no es un proyecto de adopción.

#### 2. Una fábrica quiere reorganizar equipos para trabajar por producto, colaborar y alinearse c

> Una fábrica quiere reorganizar equipos para trabajar por producto, colaborar y alinearse con la estrategia. Según el Cloud Adoption Framework, ¿qué perspectiva cubre ese cambio de personas y de forma de trabajar?

- Perspectiva Security
- Perspectiva Operations
- Perspectiva People **(correcta)**
- Perspectiva Platform

> People es la perspectiva de negocio del CAF sobre el talento: cómo se organizan las personas y cómo trabajan. Platform son los planos técnicos. Security es identidad y protección. Operations es cómo se opera el día a día.

#### 3. El mismo cambio incluye migrar y modernizar la infraestructura vieja, y armar la plataform

> El mismo cambio incluye migrar y modernizar la infraestructura vieja, y armar la plataforma de datos. ¿Qué perspectiva del CAF es esa?

- Perspectiva Governance
- Perspectiva Platform **(correcta)**
- Perspectiva People
- Perspectiva Business

> Platform es la perspectiva técnica: la arquitectura, la migración y la plataforma. People cambia equipos y cultura. Business mira ingresos, costos y mercados. Governance mira que se cumplan las normas.

#### 4. La dirección quiere que la nube abra productos nuevos y otra forma de ingresar dinero. ¿Qu

> La dirección quiere que la nube abra productos nuevos y otra forma de ingresar dinero. ¿Qué perspectiva del CAF es esa?

- Perspectiva Business **(correcta)**
- Perspectiva Platform
- Perspectiva Security
- Perspectiva Operations

> Business pide que la tecnología suba ingresos, baje costos o abra mercados. No diseña la plataforma ni opera los sistemas.

#### 5. Tienes el plan Business Support+. El sistema de producción se cayó y el negocio está muy a

> Tienes el plan Business Support+. El sistema de producción se cayó y el negocio está muy afectado. ¿En cuánto busca responder AWS a ese primer contacto?

- En menos de 4 horas
- En menos de 1 hora **(correcta)**
- En menos de 15 minutos
- En menos de 30 minutos

> En Business Support+ y en Enterprise, «sistema de producción caído» tiene como meta menos de 1 hora para la primera respuesta. Menos de 30 minutos, en Business Support+, es «sistema crítico de negocio caído». Menos de 15 minutos es ese caso crítico en Enterprise. Menos de 4 horas es «sistema de producción degradado», no caído. Son metas de primer contacto, no de resolución.

#### 6. Quieres describir los servidores, la red y la base en un archivo versionado, y crearlos ot

> Quieres describir los servidores, la red y la base en un archivo versionado, y crearlos otra vez igual, sin configurarlos a mano. ¿Qué servicio usas?

- AWS CloudTrail
- Amazon CloudWatch
- AWS Trusted Advisor
- AWS CloudFormation **(correcta)**

> CloudFormation es infrastructure as code (en inglés): una plantilla crea la pila de recursos. CloudTrail registra llamadas. CloudWatch mide. Trusted Advisor recomienda.

### Fundamentos ML

#### 1. El aprendizaje supervisado usa…

> El aprendizaje supervisado usa…

- Datos etiquetados para entrenar el modelo **(correcta)**
- Solo grupos de datos sin etiqueta
- Solo aprendizaje por recompensa
- Datos sin ninguna característica

> Supervisado significa que los ejemplos ya traen la respuesta correcta (la etiqueta) y el modelo aprende a imitarla.

#### 2. Agrupar datos parecidos sin etiquetas (clustering) es típico de…

> Agrupar datos parecidos sin etiquetas (clustering) es típico de…

- Solo regresión con etiquetas
- Solo aprendizaje por recompensa
- Solo mover datos de un sistema a otro
- Aprendizaje no supervisado **(correcta)**

> Si nadie etiquetó los datos y el modelo busca grupos por su cuenta, es aprendizaje no supervisado.

#### 3. La inferencia es…

> La inferencia es…

- Solo pagar por la GPU
- Solo guardar versiones del código
- Usar un modelo entrenado para predicciones **(correcta)**
- Solo recoger los datos en crudo

> Entrenar ajusta el modelo. Inferir es usarlo ya entrenado para obtener una respuesta nueva.

#### 4. El entrenamiento es…

> El entrenamiento es…

- Solo crear una red virtual
- Ajustar parámetros del modelo con datos **(correcta)**
- Solo publicar el modelo para que lo llamen
- Solo comprar una Reserved Instance

> Entrenar es mostrar datos al modelo para que ajuste sus parámetros. Desplegar el endpoint viene después.

### IA generativa

#### 1. Un modelo fundacional (foundation model) es…

> Un modelo fundacional (foundation model) es…

- Un modelo grande preentrenado adaptable a varias tareas **(correcta)**
- Una imagen de máquina para EC2
- Un bucket de almacenamiento
- Una política de permisos

> Un modelo fundacional ya viene preentrenado con muchísimos datos y se adapta a varias tareas. No es un recurso de EC2, S3 o IAM.

#### 2. Un prompt (la instrucción al modelo) es…

> Un prompt (la instrucción al modelo) es…

- Un grupo de seguridad de la red
- Una puerta de salida a internet
- Un plan de ahorro de cómputo
- La instrucción que le das a un modelo generativo **(correcta)**

> El prompt es el texto (o la entrada) con el que pides una respuesta. No tiene nada que ver con redes, seguridad ni precios.

#### 3. Una alucinación en IA generativa es…

> Una alucinación en IA generativa es…

- La interrupción de una instancia Spot
- La consistencia eventual de un almacén de objetos
- Contenido plausible pero incorrecto inventado por el modelo **(correcta)**
- La caída de una Availability Zone

> El modelo responde con seguridad algo que suena bien y es falso. No es una caída de una Availability Zone ni un corte de Spot.

#### 4. RAG (recuperación más generación) combina…

> RAG (recuperación más generación) combina…

- Solo un grupo de autoescalado
- Buscar en tus documentos y luego dejar que el modelo redacte la respuesta **(correcta)**
- Solo ajustar el modelo, sin documentos
- Solo una red de distribución de contenido

> RAG busca primero en tus documentos y luego el modelo responde con ese contexto. Así reduces respuestas inventadas.

### Servicios AI/ML en AWS

#### 1. Amazon Bedrock ofrece…

> Amazon Bedrock ofrece…

- Acceso administrado a modelos fundacionales por API **(correcta)**
- Solo servidores físicos dedicados
- Solo almacenamiento de archivo a largo plazo
- Solo resolución de nombres de dominio

> Bedrock te da modelos fundacionales por API, sin que tengas que montar ni entrenar la infraestructura. La documentación lo describe como un servicio administrado.

#### 2. Amazon SageMaker sirve para…

> Amazon SageMaker sirve para…

- Solo enviar correo
- Solo resolver nombres de dominio
- Solo ver el presupuesto
- Construir, entrenar y desplegar tus propios modelos **(correcta)**

> SageMaker es el servicio para construir, entrenar y desplegar tus propios modelos. Bedrock, en cambio, te da modelos ya listos por API.

#### 3. Amazon Rekognition analiza…

> Amazon Rekognition analiza…

- Solo tablas de datos para consultar
- Solo permisos de la cuenta
- Imágenes y video: objetos, caras, texto **(correcta)**
- Registros de tráfico de la red

> Rekognition entiende imágenes y video: objetos, caras, texto. No analiza logs de red ni archivos tabulares.

#### 4. Amazon Comprehend hace…

> Amazon Comprehend hace…

- Repartir tráfico de red
- Leer texto y sacar sentimiento, entidades e idioma **(correcta)**
- Guardar objetos en buckets
- Dar un disco a una instancia

> Comprehend lee texto y saca sentimiento, entidades e idioma. No guarda archivos ni balancea tráfico.

#### 5. Amazon Textract extrae…

> Amazon Textract extrae…

- Texto y datos de documentos y escaneos **(correcta)**
- Métricas de un grupo de autoescalado
- El informe de costos
- Los registros de tráfico de red

> Textract lee documentos y escaneos y te devuelve el texto y los campos. No es un servicio de métricas ni de costos.

#### 6. Amazon Transcribe convierte…

> Amazon Transcribe convierte…

- Texto a voz (eso es Polly)
- Poner un pie de foto a una imagen
- Volcar la red virtual a un archivo
- Audio a texto **(correcta)**

> Transcribe pasa de audio a texto. El camino contrario, de texto a voz, es Polly.

#### 7. Amazon Polly convierte…

> Amazon Polly convierte…

- Convertir una imagen en un vector
- Cambiar el formato de una tabla
- Texto a voz sintetizada **(correcta)**
- Voz a texto

> Polly lee un texto en voz alta. Si partes de un audio y quieres el texto, el servicio es Transcribe.

### IA responsable

#### 1. El sesgo en aprendizaje automático puede venir de…

> El sesgo en aprendizaje automático puede venir de…

- Solo la Availability Zone
- Datos de entrenamiento no representativos **(correcta)**
- Solo el color del tablero
- Solo el nombre del bucket

> Si los datos de entrenamiento no representan a quien va a usar el sistema, el modelo hereda ese sesgo. No depende del color de un tablero ni de la Availability Zone.

#### 2. Transparencia en IA implica…

> Transparencia en IA implica…

- Explicar qué puede hacer el sistema, qué no, y cómo usa los datos **(correcta)**
- Ocultar siempre cómo funciona
- No guardar registros
- No revisar las salidas

> Transparencia es decir qué puede hacer el sistema, qué no, y cómo usa los datos. Ocultarlo no es una práctica responsable.

#### 3. Privacidad en IA requiere…

> Privacidad en IA requiere…

- Publicar datos personales en un bucket abierto
- Apagar el cifrado de las claves
- Pegar llaves de administrador en el prompt
- Proteger los datos personales del entrenamiento y de la inferencia **(correcta)**

> Los datos personales del entrenamiento y de la inferencia hay que protegerlos. Publicarlos o pegar llaves en el prompt rompe esa práctica.

#### 4. Dejar a una persona en el circuito (human-in-the-loop) sirve para…

> Dejar a una persona en el circuito (human-in-the-loop) sirve para…

- Dejar de evaluar el modelo
- Aprobar todo automáticamente
- Revisar las salidas críticas antes de aplicarlas **(correcta)**
- Quitar el monitoreo

> Cuando una decisión es crítica, una persona revisa la salida del modelo antes de aplicarla.

#### 5. Evaluar modelos incluye…

> Evaluar modelos incluye…

- Solo el tamaño del prompt
- Métricas de calidad, robustez y riesgo según el caso **(correcta)**
- Solo mirar el logo
- Solo el precio de la GPU

> Evaluar un modelo es medir si responde bien, si aguanta casos raros y qué riesgo tiene. El precio de la GPU no dice nada de su calidad.
