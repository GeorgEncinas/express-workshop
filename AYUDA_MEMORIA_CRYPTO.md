# Ayuda Memoria: Crypto Tracker

## Conceptos Básicos
- **Node.js**: entorno de ejecución de JavaScript en servidor.
- **npm**: gestor de paquetes; `npm install` para dependencias.
- **Módulos**: `require` y `module.exports` en CommonJS.
- **Promesas y async/await**: manejo de operaciones asíncronas.
- **JSON**: formato de intercambio de datos.
- **HTTP**: protocolo cliente-servidor (métodos GET, POST, DELETE, etc.).
### HTTP
- HTTP es un protocolo de solicitud-respuesta entre cliente y servidor.
- Métodos principales:
  - GET: obtener un recurso.
  - POST: crear un recurso.
  - PUT/PATCH: actualizar un recurso.
  - DELETE: eliminar un recurso.
  - OPTIONS, HEAD, etc.
- Códigos de estado comunes:
  - 200 OK, 201 Created
  - 400 Bad Request, 401 Unauthorized
  - 404 Not Found, 500 Internal Server Error
- Encabezados (headers): `Content-Type`, `Authorization`, `Accept`, etc.
- Parámetros de ruta (`/recurso/:id`), query (`?page=2`), y body (JSON).
- **REST**: estilo de arquitectura para APIs HTTP.
### REST
- REST (Representational State Transfer) define una arquitectura basada en recursos.
- Cada URI identifica un recurso (p.ej. `/api/coins`).
- Se usa el método HTTP para CRUD:
  - GET → leer
  - POST → crear
  - PUT/PATCH → actualizar
  - DELETE → eliminar
- Stateless: cada petición contiene toda la información necesaria.
- Idempotencia: GET, PUT y DELETE no deben alterar múltiples veces el recurso.
- Representación en JSON.
- **Variables de entorno**: configuraciones sensibles en `.env`.

## Conceptos Clave

1. **Express.js**
   - Framework minimalista para Node.js.
   - `app.use(express.json())` para parsear JSON.
   - `app.get`, `app.post`, `app.delete`, etc.

2. **Estructura de Proyecto**
   ```
   crypto-tracker/
   ├ .env               # Variables de entorno
   ├ package.json       # Dependencias y scripts
   ├ data/              # Persistencia JSON para watchlist
   │  └ watchlist.json
   └ src/
      ├ app.js          # Punto de entrada
      ├ routes/         # Definición de endpoints
      │   ├ coins.js    # API CoinGecko
      │   ├ auth.js     # Ruta de login JWT
      │   └ watchlist.js# CRUD + persistencia JSON
      └ middleware/     # Middlewares
          └ auth.js     # Verificación JWT
   ```

3. **Variables de Entorno (.env)**
   - `PORT`: puerto del servidor.
   - `JWT_SECRET`: clave secreta para firmar/verificar tokens.

4. **Logger Middleware**
   ```js
   app.use((req, res, next) => {
     console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
     next();
   });
   ```

5. **Manejo de Errores**
   ```js
   app.use((err, req, res, next) => {
     console.error(err.stack);
     res.status(500).json({ error: err.message });
   });
   ```

6. **Consumir API Externa (CoinGecko)**
   - Usar `axios.get(url, { params })`.
   - Extraer datos y mapear campos.

7. **CRUD Watchlist en JSON**
   - Leer `data/watchlist.json` al iniciar:
     ```js
     const data = fs.readFileSync(filePath, 'utf8');
     watchlist = JSON.parse(data);
     ```
   - Escribir tras cada cambio:
     ```js
     fs.writeFileSync(filePath, JSON.stringify(watchlist, null, 2));
     ```
   - Endpoints:
     - `GET /api/watchlist` → lista completa
     - `GET /api/watchlist/:id` → item por id
     - `POST /api/watchlist` → agregar
     - `DELETE /api/watchlist/:id` → eliminar

8. **Autenticación con JWT**
   - Generar token en `/api/auth/login`:
     ```js
     jwt.sign({ user }, secret, { expiresIn: '1h' });
     ```
   - Middleware de verificación:
     ```js
     const payload = jwt.verify(token, secret);
     req.user = payload;
     ```
   - Proteger rutas con el middleware.

9. **npm Scripts**
   ```json
   "scripts": {
     "start": "node src/app.js",
     "dev": "node --watch src/app.js"
   }
   ```

10. **Pruebas**
    - Usar curl o Postman para validar:
      - `/ping`
      - `/api/coins`
      - `/api/auth/login`
      - `/api/watchlist` (con token)

---

## Preguntas Frecuentes (FAQ)

**Q1: ¿Cuál es la diferencia entre JSON y JavaScript Object?**  
R: JSON es un formato de texto para intercambio de datos. Un objeto JS es una estructura en memoria. Se usa `JSON.parse` y `JSON.stringify` para convertir.

**Q2: ¿Qué es un middleware en Express?**  
R: Una función que interpone la petición antes de la ruta final. Puede modificar `req`, `res` o manejar errores.

**Q3: ¿Cómo manejo rutas protegidas?**  
R: Con un middleware de autenticación (JWT), que verifica el token antes de llamar a la ruta.

**Q4: ¿Por qué usar variables de entorno (.env)?**  
R: Para separar configuraciones sensibles (claves, puertos) del código fuente.

**Q5: ¿Qué significa idempotencia en HTTP?**  
R: Una operación idempotente produce el mismo resultado sin importar cuántas veces se ejecute.  
  - Ejemplo: `DELETE /api/watchlist/bitcoin`  
    1. Primera llamada → elimina el recurso y devuelve 200.  
    2. Llamadas posteriores → devuelve 404 o 200, pero el estado (sin bitcoin) no cambia.  

**Q6: ¿Cómo persistir datos en producción?**  
R: Usar una base de datos (MongoDB, PostgreSQL, etc.) en lugar de archivos JSON.

Guarda este archivo para consultar rápidamente los pasos y conceptos vistos en el taller.


https://pub-97d2f14809854ff1870055724c829992.r2.dev/book.pdf
