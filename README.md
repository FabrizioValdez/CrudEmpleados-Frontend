# CrudEmpleados Frontend - React

Panel administrativo para gestión de empleados conectado a la API ASP.NET Core.

## Tecnologías
- React
- JavaScript
- Axios
- JWT

## Requisitos previos
- Node.js 18+
- npm

## Configuración

1. Clonar el repositorio
   git clone https://github.com/FabrizioValdez/CrudEmpleados-Frontend

2. Instalar dependencias
   npm install

3. Verificar que la URL de la API en src apunte a:
   const API = "https://localhost:7256/api"

4. Ejecutar el proyecto
   npm start

La app estará disponible en http://localhost:3000

## Funcionalidades
- Login con autenticación JWT
- Protección de rutas por rol (ADMIN)
- Crear, editar y eliminar empleados
- Asignación de sueldo por empleado
