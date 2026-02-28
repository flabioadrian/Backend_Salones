**Backend Salones - Guía de Inicio Rápido**
Este proyecto es el backend para la gestión de alumnos y grupos, construido con Node.js, Express y MySQL.

**Pre-requisitos**
Node.js (Versión LTS recomendada)

NPM (Viene con Node)

Acceso a una base de datos MySQL.

**Instalación**
Clonar el repositorio:
    git clone https://github.com/flabioadrian/Backend_Salones.git
    cd Backend_Salones

Instalar dependencias:
    npm install

Configurar variables de entorno:
    Copia el archivo .env.example y cámbiale el nombre a .env.

Abre .env y rellena tus credenciales reales (Host, Usuario, Password, DB Name).

**Ejecución**
**Modo Desarrollo (con auto-reinicio):**
    npm run dev

**Modo Producción:**
npm start

El servidor estará disponible en: http://localhost:3000

**Estructura del Proyecto**
src/config: Configuración de la conexión a la base de datos (MySQL2).

src/models: Definición de consultas SQL y lógica de datos.

src/controllers: Lógica de negocio y manejo de peticiones/respuestas.

src/routes: Definición de los endpoints de la API.