// ============ LOADER ============
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelector('.loader')?.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }, 1500);
});

// ============ CURSOR ============
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

if (cursor && window.innerWidth > 768) {
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    setTimeout(() => {
      if (cursorFollower) {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
      }
    }, 80);
  });

  document.querySelectorAll('a, button, .menu-item, .dish-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(2)';
      if (cursorFollower) cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      if (cursorFollower) cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });
}

// ============ NAV SCROLL ============
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav?.classList.add('scrolled');
  } else {
    nav?.classList.remove('scrolled');
  }
});

// ============ MOBILE MENU ============
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
const backdrop = document.querySelector('.overlay-backdrop');
const mobileClose = document.querySelector('.mobile-nav-close');

function openMobileNav() {
  mobileNav?.classList.add('open');
  backdrop?.classList.add('visible');
  document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
  mobileNav?.classList.remove('open');
  backdrop?.classList.remove('visible');
  document.body.style.overflow = 'auto';
}

hamburger?.addEventListener('click', openMobileNav);
mobileClose?.addEventListener('click', closeMobileNav);
backdrop?.addEventListener('click', closeMobileNav);

// ============ SCROLL ANIMATIONS ============
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ============ NOTIFICATION ============
function showNotification(title, message) {
  let notif = document.querySelector('.notification');
  if (!notif) {
    notif = document.createElement('div');
    notif.className = 'notification';
    document.body.appendChild(notif);
  }
  notif.innerHTML = `<strong>${title}</strong>${message}`;
  notif.classList.add('show');
  setTimeout(() => notif.classList.remove('show'), 3500);
}

// ============ CART SYSTEM ============
let cart = JSON.parse(sessionStorage.getItem('divangrill_cart') || '[]');

function saveCart() {
  sessionStorage.setItem('divangrill_cart', JSON.stringify(cart));
  updateCartUI();
  updateCartBadge();
}

function addToCart(name, price, image) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, qty: 1, image });
  }
  saveCart();
  showNotification('Ajouté !', name + ' ajouté au panier');
}

function removeFromCart(name) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty--;
    if (existing.qty <= 0) {
      cart = cart.filter(i => i.name !== name);
    }
  }
  saveCart();
}

function updateCartBadge() {
  const badge = document.querySelector('.cart-badge');
  if (badge) {
    const total = cart.reduce((s, i) => s + i.qty, 0);
    badge.textContent = total;
    badge.style.display = total > 0 ? 'block' : 'none';
  }
}

function updateCartUI() {
  const cartItems = document.querySelector('.cart-items');
  const cartEmpty = document.querySelector('.cart-empty');
  const cartTotal = document.querySelector('.cart-subtotal');
  const cartDelivery = document.querySelector('.cart-delivery-fee');
  const cartGrand = document.querySelector('.cart-grand-total');
  
  if (!cartItems) return;

  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="cart-empty">🛒 Votre panier est vide</div>';
    if (cartTotal) cartTotal.textContent = '0,00 €';
    if (cartGrand) cartGrand.textContent = '0,00 €';
    return;
  }

  const deliveryFee = getOrderType() === 'livraison' ? 2.90 : 0;
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const grand = subtotal + deliveryFee;

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item" data-name="${item.name}">
      <div class="cart-item-name">${item.name}</div>
      <div class="cart-item-qty">
        <button class="qty-btn" onclick="removeFromCart('${item.name}')">−</button>
        <span>${item.qty}</span>
        <button class="qty-btn" onclick="addToCart('${item.name}', ${item.price}, '')">+</button>
      </div>
      <div class="cart-item-price">${(item.price * item.qty).toFixed(2).replace('.', ',')} €</div>
    </div>
  `).join('');

  if (cartTotal) cartTotal.textContent = subtotal.toFixed(2).replace('.', ',') + ' €';
  if (cartDelivery) cartDelivery.textContent = deliveryFee === 0 ? 'Gratuit' : deliveryFee.toFixed(2).replace('.', ',') + ' €';
  if (cartGrand) cartGrand.textContent = grand.toFixed(2).replace('.', ',') + ' €';
}

function getOrderType() {
  const btn = document.querySelector('.order-type-btn.active');
  return btn ? btn.dataset.type : 'retrait';
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  updateCartUI();
});

// ============ SMOOTH PAGE TRANSITIONS ============
document.querySelectorAll('a[href$=".html"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('#') && !href.startsWith('http')) {
      // Allow normal navigation
    }
  });
});
