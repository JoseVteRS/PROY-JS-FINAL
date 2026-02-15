# Virtual Market

Proyecto adaptado para utilizar Docker en vez de XAMPP, WAMP, MAMP, Laragon, etc.

Requisitos:
- Docker instalado en el sistema.

Para ver el proyecto, se debe ejecutar primero el comando:

```bash
docker compose up -d
```

## Acceder a la web Virtual Market
Se accede a la weba través de `http://localhost:8080`. Se hará una redirección automática a `carrito.html`. También se puede acceder a la web directamente a `http://localhost:8080/carrito.html`.


# phpMyAdmin
Para pode facilitar el seguimiento del proyecto (Ver los productos, unidades, pedidos, etc), se ha creado un servicio `phpMyAdmin` en el `docker-compose.yml` que se puede acceder a través de `http://localhost:8081`.

