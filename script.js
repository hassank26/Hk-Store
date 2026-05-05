
const cur = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  cur.style.left = e.clientX - 5 + 'px';
  cur.style.top = e.clientY - 5 + 'px';
});

document.querySelectorAll('button, a, .p-card, .cat-item').forEach(el => {
  el.addEventListener('mouseenter', () => cur.classList.add('big'));
  el.addEventListener('mouseleave', () => cur.classList.remove('big'));
});

const products = [
  { id:1, name:'Cotton Polo Shirt', cat:'Men', price:1599, old:null, badge:'New', img:'assets/image1.png', sizes:['S','M','L','XL'] },
  { id:2, name:'Slim Fit Denim Shirt', cat:'Men', price:2299, old:null, badge:'New', img:'assets/image2.png', sizes:['S','M','L','XL'] },
  { id:3, name:'Linen White Shirt', cat:'Men', price:1899, old:120, badge:'Sale', img:'assets/image3.png', sizes:['S','M','L','XL'] },
  { id:4, name:'100% Cotton Plain Round Neck T-Shirt', cat:'Men', price:2499, old:null, badge:null, img:'assets/image4.png', sizes:['S','M','L','XL','XXL'] },
  { id:5, name:'Simple Black Shirt', cat:'Men', price:1999, old:175, badge:'Sale', img:'assets/image5.png', sizes:['28','30','32','34','36'] },
  { id:6, name:'Slim Fit Jeans', cat:'Men', price:2799, old:null, badge:'New', img:'assets/image6.png', sizes:['28','30','32','34','36'] },
  { id:7, name:'Cargo Trousers', cat:'Men', price:2199, old:null, badge:null, img:'assets/image7.png', sizes:['28','30','32','34','36'] },
  { id:8, name:'Navy Full Sleeves Track Suit', cat:'Men', price:2599, old:null, badge:'New', img:'assets/image8.png', sizes:['28','30','32','34','36'] }
];

function renderProducts() {
  const grid = document.getElementById('product-grid');
  let html = '';
  for (let p of products) {
    html += `
    <div class="p-card">
      <div class="p-img">
        <img src="${p.img}" alt="${p.name}" class="p-img-inner">
        ${p.badge ? `<div class="p-badge ${p.badge==='Sale'?'sale-badge':''}">${p.badge}</div>` : ''}
        <div class="p-overlay">
          <button class="quick-add" onclick="addToCart(${p.id})">+ Add to Bag</button>
        </div>
      </div>
      <div class="p-info">
        <div class="p-cat">${p.cat}</div>
        <div class="p-name">${p.name}</div>
        <div class="p-price-row">
          <span class="p-price">PKR${p.price}</span>
          ${p.old ? `<span class="p-old">PKR${p.old}</span>` : ''}
        </div>
        <div class="p-sizes">
          ${p.sizes.map((s,i)=>`<button class="p-sz ${i===1?'on':''}" onclick="pickSize(this)">${s}</button>`).join('')}
        </div>
      </div>
    </div>`;
  }
  grid.innerHTML = html;
}

function pickSize(btn) {
  let sizeBtns = btn.closest('.p-sizes').querySelectorAll('.p-sz');
  sizeBtns.forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
}

let cart = [];

function addToCart(id) {
  let prod = products.find(x => x.id === id);
  if (!prod) return;
  
  let existing = cart.find(x => x.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({...prod, qty:1});
  }
  updateCartUI();
  showToast(`${prod.name} added ✓`);
  openCart();
}

function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  updateCartUI();
}

function changeQty(id, d) {
  let item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += d;
  if (item.qty <= 0) {
    removeFromCart(id);
  } else {
    updateCartUI();
  }
}

function updateCartUI() {
  let total = 0;
  let count = 0;
  for (let i of cart) {
    total += i.price * i.qty;
    count += i.qty;
  }

  document.getElementById('cart-n').textContent = count;
  document.getElementById('cart-total').textContent = total.toFixed(2);
  
  if (count > 0) {
    document.getElementById('cart-dot').className = 'cart-dot show';
  } else {
    document.getElementById('cart-dot').className = 'cart-dot';
  }

  const body = document.getElementById('cart-body');
  if (cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty-state">
        <div class="big">🛍</div>
        <p>Nothing here yet.<br/>Browse and add something you like.</p>
      </div>`;
  } else {
    let cartHtml = '';
    for (let item of cart) {
      cartHtml += `
      <div class="c-item">
        <img src="${item.img}" alt="${item.name}" class="c-item-thumb">
        <div class="c-item-info">
          <div class="c-item-name">${item.name}</div>
          <div class="c-item-meta">${item.cat} · Size M</div>
          <div class="c-item-row">
            <div class="qty-wrap">
              <button class="q-btn" onclick="changeQty(${item.id},-1)">−</button>
              <input class="q-num" value="${item.qty}" readonly/>
              <button class="q-btn" onclick="changeQty(${item.id},1)">+</button>
            </div>
            <span class="c-item-price">PKR${(item.price*item.qty).toFixed(2)}</span>
          </div>
          <button class="c-remove" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
      </div>`;
    }
    body.innerHTML = cartHtml;
  }
}

function openCart() {
  document.getElementById('cart-bg').classList.add('open');
  document.getElementById('cart-panel').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cart-bg').classList.remove('open');
  document.getElementById('cart-panel').classList.remove('open');
  document.body.style.overflow = '';
}

function openDrawer() {
  document.getElementById('drawer').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  document.getElementById('drawer').classList.remove('open');
  document.body.style.overflow = '';
}

function showToast(msg) {
  let el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.getElementById('toasts').appendChild(el);
  setTimeout(() => {
    el.classList.add('out');
    el.addEventListener('animationend', () => el.remove());
  }, 3000);
}

function subscribeNL() {
  let input = document.getElementById('nl-email');
  if (!input.value.includes('@')) {
    showToast('Enter a valid email!');
    return;
  }
  showToast('You are in! Welcome to the list 🎉');
  input.value = '';
}

renderProducts();
