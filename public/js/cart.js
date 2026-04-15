const CART_STORAGE_KEY = "jobee_cart";

function getCart() {
  const cart = localStorage.getItem(CART_STORAGE_KEY);
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addItemToCart(product) {
  const cart = getCart();

  const existingItem = cart.find(
    (item) => item.id === product.id && item.size === product.size
  );

  if (existingItem) {
    existingItem.quantity += product.quantity || 1;
  } else {
    cart.push({
      ...product,
      quantity: product.quantity || 1
    });
  }

  saveCart(cart);
}

function removeItemFromCart(productId, size) {
  const cart = getCart().filter(
    (item) => !(item.id === productId && item.size === size)
  );

  saveCart(cart);
}

function updateItemQuantity(productId, size, delta) {
  const cart = getCart();
  const item = cart.find(
    (product) => product.id === productId && product.size === size
  );

  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    const updatedCart = cart.filter(
      (product) => !(product.id === productId && product.size === size)
    );
    saveCart(updatedCart);
    return;
  }

  saveCart(cart);
}

function clearCart() {
  localStorage.removeItem(CART_STORAGE_KEY);
  updateCartBadge();
}

function getCartCount() {
  return getCart().reduce((total, item) => total + item.quantity, 0);
}

function updateCartBadge() {
  const badge = document.getElementById("navbar-cart-count");
  if (!badge) return;

  const count = getCartCount();
  badge.textContent = count;

  if (count > 0) {
    badge.style.display = "grid";
  } else {
    badge.style.display = "none";
  }
}

window.getCart = getCart;
window.saveCart = saveCart;
window.addItemToCart = addItemToCart;
window.removeItemFromCart = removeItemFromCart;
window.updateItemQuantity = updateItemQuantity;
window.clearCart = clearCart;
window.getCartCount = getCartCount;
window.updateCartBadge = updateCartBadge;