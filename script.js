
let cart = [];

function loadCart() {
  try {
    const saved = sessionStorage.getItem('buenaPinta_cart');
    cart = saved ? JSON.parse(saved) : [];
  } catch (e) {
    cart = [];
  }
}

// Guardar carrito
function saveCart() {
  try {
    sessionStorage.setItem('buenaPinta_cart', JSON.stringify(cart));
  } catch (e) {
    console.log('No se puede guardar, usando memoria local');
  }
}


function addToCart(button) {
  const productCard = button.closest('.product');
  
  const title = productCard.querySelector('.title')?.textContent || 'Producto';
  
 
  let price = 0;
  const newPriceEl = productCard.querySelector('.new-price');
  const priceEl = productCard.querySelector('.price');
  
  if (newPriceEl) {
    price = parseFloat(newPriceEl.textContent.replace('S/', '').replace('S', '').trim());
  } else if (priceEl) {
    price = parseFloat(priceEl.textContent.replace('S/', '').replace('S', '').trim());
  }
  
  
  const img = productCard.querySelector('.thumb img')?.src || '';
  const id = title.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now();
  
 
  const existing = cart.find(item => item.title === title && item.price === price);
  
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, title, price, img, qty: 1 });
  }
  
  saveCart();
  console.log('Producto agregado:', title, 'Carrito actual:', cart);
  
  
  alert(`✓ "${title}" agregado al carrito`);
}


function updateCartCount() {
  const cartCountElements = document.querySelectorAll('#cart-count');
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCountElements.forEach(el => el.textContent = totalItems);
}


function renderCart() {
  const cartItems = document.getElementById('cart-items');
  if (!cartItems) return;
  
  cartItems.innerHTML = '';
  
  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="meta">El carrito está vacío.</div>';
    document.getElementById('cart-total').textContent = '0.00';
    return;
  }
  
  let total = 0;
  
  cart.forEach((item, index) => {
    total += item.price * item.qty;
    
    const row = document.createElement('div');
    row.className = 'cart-item';
    
    const imgHtml = item.img ? `<img src="${item.img}" alt="${item.title}" class="cart-item-image">` : '';
    
    row.innerHTML = `
      ${imgHtml}
      <div class="cart-item-content">
        <div class="cart-item-info">
          <div class="cart-item-details">
            <div class="cart-item-name">${item.title}</div>
            <div class="cart-item-meta">S/ ${item.price.toFixed(2)} c/u</div>
          </div>
          <div class="cart-item-price">S/ ${(item.price * item.qty).toFixed(2)}</div>
        </div>
        <div class="cart-item-controls">
          <input type="number" min="1" value="${item.qty}" 
                 onchange="changeQty(${index}, this.value)">
          <button class="btn" style="padding: 8px 12px;" 
                  onclick="removeFromCart(${index})">Eliminar</button>
        </div>
      </div>
    `;
    
    cartItems.appendChild(row);
  });
  
  document.getElementById('cart-total').textContent = total.toFixed(2);
}

// Cambia cantidad
function changeQty(index, newQty) {
  const qty = parseInt(newQty) || 0;
  
  if (qty <= 0) {
    removeFromCart(index);
  } else {
    cart[index].qty = qty;
    saveCart();
    renderCart();
  }
}

// Elimina producto
function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
  updateCartCount();
}

// Vacía carrito
function clearCart() {
  if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
    cart = [];
    saveCart();
    renderCart();
    updateCartCount();
  }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  
  // Año en footer
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
  
  // Agregar listeners a botones
  document.querySelectorAll('.product button').forEach(button => {
    if (button.textContent.includes('Agregar')) {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        addToCart(button);
      });
    }
  });
  
  // Botón vaciar carrito
  const clearBtn = document.getElementById('clear-cart');
  if (clearBtn) {
    clearBtn.addEventListener('click', clearCart);
  }
  
  // Actualizar vista
  updateCartCount();
  renderCart();
});