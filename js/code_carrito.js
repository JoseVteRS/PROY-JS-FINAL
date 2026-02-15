document.addEventListener('DOMContentLoaded', function () {
  const STORAGE_KEY = 'carrito_virtualmarket';
  let carrito = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  let productos = [];

  function guardarCarrito() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
    renderizarCarrito();
  }

  function cargarProductos() {
    fetch('php/todos_productos.php')
      .then((res) => res.text())
      .then((text) => {
        if (text.trim().startsWith('<') || text.trim().startsWith('<?')) {
          alert('Error: el servidor no devolvió datos válidos. Comprueba que Docker esté en ejecución (docker compose up -d) y que MySQL haya arrancado.');
          return;
        }
        const data = JSON.parse(text);
        if (data && data.error) {
          alert('Error del servidor: ' + data.error);
          return;
        }
        productos = data;
        const items = document.getElementById('items');
        items.innerHTML = data
          .map(
            (p) => `
          <div class="producto" data-id="${p.id}">
            <p>${p.nombre}</p>
            <img class="card-image" src="img/${p.foto}" alt="${p.nombre}">
            <p>Precio: ${p.precio}€</p>
            <div class="unidades">
              <span>${obtenerCantidad(p.id)}</span>
              <button class="btn-add" data-id="${p.id}">+</button>
            </div>
          </div>
        `
          )
          .join('');
      })
      .catch((err) => console.error('Error cargando productos:', err));
  }

  function obtenerCantidad(id) {
    const item = carrito.find((c) => c.id == id);
    return item ? item.cantidad : 0;
  }

  function añadirAlCarrito(id) {
    const prod = productos.find((p) => p.id == id);
    if (!prod) return;
    const item = carrito.find((c) => c.id == id);
    if (item) {
      item.cantidad++;
    } else {
      carrito.push({
        id: prod.id,
        nombre: prod.nombre,
        precio: prod.precio,
        foto: prod.foto,
        cantidad: 1,
      });
    }
    guardarCarrito();
    actualizarCantidadProducto(id);
  }

  function actualizarCantidadProducto(id) {
    const div = document.querySelector(`.producto[data-id="${id}"] .unidades span`);
    if (div) div.textContent = obtenerCantidad(id);
  }

  function renderizarCarrito() {
    const lista = document.getElementById('lista-carrito');
    lista.innerHTML = carrito
      .map(
        (item) => `
      <li data-id="${item.id}">
        ${item.nombre} - ${item.cantidad} x ${item.precio}€
        <button class="btn-remove" data-id="${item.id}">x</button>
      </li>
    `
      )
      .join('');
    actualizarTotal();
  }

  function actualizarTotal() {
    const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    document.getElementById('total').textContent = total.toFixed(2);
  }

  function eliminarDelCarrito(id) {
    carrito = carrito.filter((c) => c.id != id);
    guardarCarrito();
    actualizarCantidadProducto(id);
  }

  function vaciarCarrito() {
    carrito = [];
    localStorage.removeItem(STORAGE_KEY);
    renderizarCarrito();
    productos.forEach((p) => actualizarCantidadProducto(p.id));
  }

  function tramitarPedido() {
    alert('Se va a tramitar el pedido');
    const body = 'carrito=' + encodeURIComponent(JSON.stringify(carrito));
    fetch('php/tramito_carrito.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data === 'ok') {
          alert('Pedido tramitado con éxito');
          vaciarCarrito();
        } else {
          alert(data && data.error ? data.error : 'Error al tramitar');
        }
      })
      .catch(() => alert('Error al tramitar'));
  }

  document.getElementById('items').addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-add')) {
      añadirAlCarrito(e.target.dataset.id);
    }
  });

  document.getElementById('lista-carrito').addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-remove')) {
      eliminarDelCarrito(e.target.dataset.id);
    }
  });

  document.getElementById('borrar').addEventListener('click', vaciarCarrito);
  document.getElementById('tramitar').addEventListener('click', tramitarPedido);

  cargarProductos();
  renderizarCarrito();
});
