/* ============================================
   SHOP PAGE — TOP MEN'S
   E-Commerce Functionality
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── Data ───
    const productData = [
        { brand: 'Rolex', name: 'Submariner Date', desc: 'The iconic 41mm Oystersteel and yellow gold Submariner with a black Cerachrom bezel. Water-resistant to 300m, chronometer-certified movement.', price: 14500, category: 'watches' },
        { brand: 'Tom Ford', name: 'Oud Wood EDP', desc: 'A masterful blend of exotic oud, rosewood, and cardamom. 100ml Private Blend — warm, smoky, and utterly captivating.', price: 395, category: 'fragrances' },
        { brand: 'Montblanc', name: 'Star Gold Cufflinks', desc: 'Handcrafted 18K gold cufflinks with deep black onyx inlay. The perfect finishing touch for the discerning gentleman.', price: 1250, category: 'cufflinks' },
        { brand: 'Brioni', name: 'Bespoke Tuxedo', desc: 'Hand-tailored from Super 180s wool in midnight blue. Italian craftsmanship at its finest — peak lapel, single button.', price: 7800, category: 'fashion' },
        { brand: 'Patek Philippe', name: 'Calatrava 5227G', desc: '39mm white gold case with officer\'s caseback. A timeless dress watch featuring the classic Calatrava cross.', price: 9200, category: 'watches' },
        { brand: 'Berluti', name: 'Venezia Leather Wallet', desc: 'Hand-patinated Venezia calfskin leather bifold. Each piece unique with rich colour depth. Cards slots and bill compartment.', price: 850, category: 'accessories' },
        { brand: 'Cartier', name: 'Santos Aviator Sunglasses', desc: 'Gold-finish metal frame inspired by the legendary Santos design. Grey polarized lenses, UV protection, leather-wrapped temples.', price: 620, category: 'accessories' },
        { brand: 'Creed', name: 'Aventus EDP', desc: 'The legendary masculine scent. 100ml of bergamot, blackcurrant, apple, and oak-moss. Confident, bold, unforgettable.', price: 475, category: 'fragrances' },
        { brand: 'Audemars Piguet', name: 'Royal Oak 15500ST', desc: '41mm stainless steel with Grande Tapisserie blue dial. The iconic octagonal bezel — sport-luxe perfection.', price: 22500, category: 'watches' },
        { brand: 'Cartier', name: 'Trinity Cufflinks', desc: 'Iconic three-tone gold interlocking ring design. White, yellow, and rose gold — a symbol of love, fidelity, and friendship.', price: 2100, category: 'cufflinks' },
        { brand: 'Tom Ford', name: 'Shelton Suit', desc: 'Wool-silk blend two-piece in charcoal grey. Slim-fit silhouette, Italian construction, notch lapel. Timeless elegance.', price: 3200, category: 'fashion' },
        { brand: 'Maison Francis Kurkdjian', name: 'Baccarat Rouge 540', desc: '70ml EDP. An alchemy of saffron, jasmine, and amberwood. Luminous, radiant, and deeply addictive.', price: 320, category: 'fragrances' }
    ];

    // ─── State ───
    let cart = JSON.parse(localStorage.getItem('topmens_cart') || '[]');
    let activeFilter = 'all';
    let searchTerm = '';
    let sortBy = 'featured';

    // ─── Elements ───
    const shopGrid = document.getElementById('shopGrid');
    const cards = shopGrid.querySelectorAll('.shop-card');
    const filterTabs = document.querySelectorAll('.filter-tab');
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const resultsCount = document.getElementById('resultsCount');
    const noResults = document.getElementById('noResults');
    const cartBtn = document.getElementById('cartBtn');
    const cartCount = document.getElementById('cartCount');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartClose = document.getElementById('cartClose');
    const cartItems = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartFooter = document.getElementById('cartFooter');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const quickViewModal = document.getElementById('quickViewModal');
    const modalClose = document.getElementById('modalClose');
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toastText');
    const backToTop = document.getElementById('backToTop');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    // ─── Mobile Nav ───
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('open');
        });
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }

    // ─── Back To Top ───
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ─── Init ───
    updateCartUI();
    applyFilters();

    // ============================================
    // FILTERING, SEARCH & SORT
    // ============================================

    // Category filter tabs
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeFilter = tab.getAttribute('data-filter');
            applyFilters();
        });
    });

    // Search
    searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value.toLowerCase().trim();
        applyFilters();
    });

    // Sort
    sortSelect.addEventListener('change', (e) => {
        sortBy = e.target.value;
        applyFilters();
    });

    function applyFilters() {
        const cardsArray = Array.from(cards);

        // Filter
        cardsArray.forEach(card => {
            const category = card.getAttribute('data-category');
            const name = card.getAttribute('data-name').toLowerCase();
            const brand = card.querySelector('.shop-brand').textContent.toLowerCase();

            const matchesFilter = activeFilter === 'all' || category === activeFilter;
            const matchesSearch = !searchTerm || name.includes(searchTerm) || brand.includes(searchTerm) || category.includes(searchTerm);

            if (matchesFilter && matchesSearch) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });

        // Sort visible cards
        const visibleCards = cardsArray.filter(c => !c.classList.contains('hidden'));

        visibleCards.sort((a, b) => {
            const priceA = parseInt(a.getAttribute('data-price'));
            const priceB = parseInt(b.getAttribute('data-price'));
            const nameA = a.getAttribute('data-name');
            const nameB = b.getAttribute('data-name');

            switch (sortBy) {
                case 'price-low': return priceA - priceB;
                case 'price-high': return priceB - priceA;
                case 'name': return nameA.localeCompare(nameB);
                default: return 0;
            }
        });

        // Re-order in DOM
        visibleCards.forEach(card => shopGrid.appendChild(card));
        cardsArray.filter(c => c.classList.contains('hidden')).forEach(card => shopGrid.appendChild(card));

        // Update count
        const count = visibleCards.length;
        resultsCount.textContent = `Showing ${count} product${count !== 1 ? 's' : ''}`;
        noResults.style.display = count === 0 ? 'block' : 'none';

        // Re-animate
        visibleCards.forEach((card, i) => {
            card.style.animation = 'none';
            card.offsetHeight; // trigger reflow
            card.style.animation = `cardFadeIn 0.4s ease ${i * 0.05}s forwards`;
        });
    }

    // ============================================
    // ADD TO CART
    // ============================================

    // All "Add to Cart" buttons on cards
    document.querySelectorAll('.shop-card .add-to-cart-btn').forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const card = btn.closest('.shop-card');
            const cardIndex = Array.from(cards).indexOf(card);
            if (cardIndex >= 0) {
                addToCart(cardIndex, 1);
            }
        });
    });

    function addToCart(productIndex, qty = 1) {
        const product = productData[productIndex];
        if (!product) return;

        const existingItem = cart.find(item => item.index === productIndex);
        if (existingItem) {
            existingItem.qty += qty;
        } else {
            const card = cards[productIndex];
            const imgSrc = card.querySelector('.shop-card-image img').getAttribute('src');
            cart.push({
                index: productIndex,
                brand: product.brand,
                name: product.name,
                price: product.price,
                img: imgSrc,
                qty: qty
            });
        }

        saveCart();
        updateCartUI();
        showToast(`${product.name} added to cart`);
    }

    function removeFromCart(productIndex) {
        cart = cart.filter(item => item.index !== productIndex);
        saveCart();
        updateCartUI();
    }

    function saveCart() {
        localStorage.setItem('topmens_cart', JSON.stringify(cart));
    }

    function updateCartUI() {
        // Cart count badge
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        cartCount.textContent = totalItems;
        if (totalItems > 0) {
            cartCount.classList.add('show');
        } else {
            cartCount.classList.remove('show');
        }

        // Cart items
        if (cart.length === 0) {
            cartEmpty.style.display = 'block';
            cartFooter.style.display = 'none';
            // Clear existing cart items (not the empty message)
            cartItems.querySelectorAll('.cart-item').forEach(el => el.remove());
            return;
        }

        cartEmpty.style.display = 'none';
        cartFooter.style.display = 'block';

        // Remove existing cart item elements
        cartItems.querySelectorAll('.cart-item').forEach(el => el.remove());

        // Build cart items
        let subtotal = 0;
        cart.forEach(item => {
            subtotal += item.price * item.qty;
            const itemEl = document.createElement('div');
            itemEl.classList.add('cart-item');
            itemEl.innerHTML = `
                <div class="cart-item-img">
                    <img src="${item.img}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <span class="cart-item-brand">${item.brand}</span>
                    <div class="cart-item-name">${item.name}${item.qty > 1 ? ` × ${item.qty}` : ''}</div>
                    <div class="cart-item-bottom">
                        <span class="cart-item-price">$${(item.price * item.qty).toLocaleString()}</span>
                        <button class="cart-item-remove" data-index="${item.index}">Remove</button>
                    </div>
                </div>
            `;
            cartItems.appendChild(itemEl);
        });

        cartSubtotal.textContent = `$${subtotal.toLocaleString()}`;

        // Remove listeners
        cartItems.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-index'));
                removeFromCart(idx);
            });
        });
    }

    // ============================================
    // CART SIDEBAR
    // ============================================

    cartBtn.addEventListener('click', () => {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    function closeCart() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    cartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // Checkout button
    document.getElementById('checkoutBtn').addEventListener('click', () => {
        showToast('Thank you! Checkout is a demo.');
        closeCart();
    });

    // ============================================
    // QUICK VIEW MODAL
    // ============================================

    document.querySelectorAll('.quick-view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const productIndex = parseInt(btn.getAttribute('data-product'));
            openQuickView(productIndex);
        });
    });

    function openQuickView(index) {
        const product = productData[index];
        const card = cards[index];
        if (!product || !card) return;

        const imgSrc = card.querySelector('.shop-card-image img').getAttribute('src');

        document.getElementById('modalImg').src = imgSrc;
        document.getElementById('modalImg').alt = product.name;
        document.getElementById('modalBrand').textContent = product.brand;
        document.getElementById('modalName').textContent = product.name;
        document.getElementById('modalDesc').textContent = product.desc;
        document.getElementById('modalPrice').textContent = `$${product.price.toLocaleString()}`;
        document.getElementById('qtyInput').value = 1;

        quickViewModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Set up add button
        const modalAddBtn = document.getElementById('modalAddBtn');
        modalAddBtn.onclick = () => {
            const qty = parseInt(document.getElementById('qtyInput').value) || 1;
            addToCart(index, qty);
            closeQuickView();
        };
    }

    function closeQuickView() {
        quickViewModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeQuickView);
    quickViewModal.addEventListener('click', (e) => {
        if (e.target === quickViewModal) closeQuickView();
    });

    // Quantity controls
    document.getElementById('qtyMinus').addEventListener('click', () => {
        const input = document.getElementById('qtyInput');
        if (parseInt(input.value) > 1) input.value = parseInt(input.value) - 1;
    });

    document.getElementById('qtyPlus').addEventListener('click', () => {
        const input = document.getElementById('qtyInput');
        if (parseInt(input.value) < 10) input.value = parseInt(input.value) + 1;
    });

    // ============================================
    // TOAST NOTIFICATION
    // ============================================

    let toastTimer;
    function showToast(message) {
        clearTimeout(toastTimer);
        toastText.textContent = message;
        toast.classList.add('show');
        toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    // ============================================
    // KEYBOARD SHORTCUTS
    // ============================================

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeQuickView();
            closeCart();
        }
    });

});
