# Virtual Market

Proyecto adaptado para utilizar Docker en vez de XAMPP, WAMP, MAMP, Laragon, etc.

Requisitos:
- Docker instalado en el sistema.

## Desarrollo local

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

- App: http://localhost:8080
- phpMyAdmin: http://localhost:8081