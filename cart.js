// CART HTML
document.body.insertAdjacentHTML("afterbegin", `
<div id="cart-backdrop" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80]"></div>

<aside id="cart-panel"
    class="fixed top-0 right-0 h-screen w-full max-w-[420px] bg-white z-[90] shadow-2xl border-l border-blue-100 flex flex-col">

    <div class="relative px-6 py-6 border-b border-blue-100 bg-white">

        <div class="absolute top-0 left-0 w-full h-2 bg-blue-400"></div>

        <div class="flex items-start justify-between gap-4 pt-2">

            <div class="flex items-center gap-4">

                <div
                    class="w-14 h-14 rounded-full bg-white border-4 border-blue-100 shadow-md flex items-center justify-center shrink-0">

                    <img src="./images/logo.png"
                        alt="Prime Promotions Logo"
                        class="w-10 h-10 object-contain rounded-full">

                </div>

                <div>

                    <p class="text-xs uppercase tracking-[0.22em] text-blue-400 font-bold">
                        Prime Promotions
                    </p>

                    <h3 class="brand-font text-4xl leading-none text-gray-950 mt-1">
                        Saved Items
                    </h3>

                    <p class="text-sm text-gray-500 mt-1">
                        Add notes before sending your request.
                    </p>

                </div>
            </div>

            <button id="close-cart"
                class="w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-400 hover:text-white text-gray-600 flex items-center justify-center transition shadow-sm">

                <i class="fa-solid fa-xmark"></i>

            </button>
        </div>
    </div>

    <div class="px-6 py-4 bg-blue-50/80 border-b border-blue-100">

        <div class="flex items-center justify-between gap-4">

            <div>

                <p class="brand-font text-3xl text-gray-950 leading-none mt-1">
                    <span id="cart-total-label">0</span> Saved Catalogs
                </p>

            </div>
        </div>
    </div>

    <div class="flex-1 overflow-y-auto px-5 py-5 bg-white">

        <ul id="cart-list" class="space-y-4 text-md text-gray-800"></ul>

    </div>

    <div class="px-5 py-5 bg-gray-50 border-t border-gray-200">

        <div class="rounded-3xl bg-white border border-blue-100 p-5 shadow-sm">

            <p class="brand-font text-3xl text-gray-950 leading-none">
                Send to our team
            </p>

            <p class="text-sm text-gray-500 mt-1 mb-4">
                Email your saved catalogs and notes.
            </p>

            <button id="send-email"
                class="w-full bg-blue-400 hover:bg-blue-500 text-white brand-font text-2xl px-6 py-3 rounded-full shadow-lg transition flex items-center justify-center gap-3 whitespace-nowrap">

                <i class="fa-solid fa-envelope"></i>

                Send Request

            </button>
        </div>
    </div>
</aside>
`);

// CART LOGIC
const cartPanel = document.getElementById('cart-panel');
const cartBackdrop = document.getElementById('cart-backdrop');
const cartList = document.getElementById('cart-list');
const cartIcon = document.getElementById('cart-icon');
const closeCartBtn = document.getElementById('close-cart');
const cartTotalLabel = document.getElementById('cart-total-label');
const cartCount = document.getElementById('cart-count');

function getCart() {
    return JSON.parse(localStorage.getItem('catalogCart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('catalogCart', JSON.stringify(cart));
}

function updateCartCount() {

    const cart = getCart();

    if (cartCount) {
        cartCount.textContent = cart.length;
        cartCount.classList.toggle('hidden', cart.length === 0);
    }

    if (cartTotalLabel) {
        cartTotalLabel.textContent = cart.length;
    }
}

function updateCartList() {

    const cart = getCart();

    cartList.innerHTML = '';

    if (cart.length === 0) {

        cartList.innerHTML = `
            <li class="text-center py-12">
                <div class="w-16 h-16 mx-auto rounded-full bg-blue-50 border border-blue-100 shadow-sm flex items-center justify-center mb-4">
                    <i class="fa-solid fa-cart-shopping text-2xl text-blue-300"></i>
                </div>

                <p class="brand-font text-3xl text-gray-800">
                    No saved catalogs yet
                </p>

                <p class="text-sm text-gray-500 mt-1">
                    Save catalogs you like and they will show up here.
                </p>
            </li>
        `;

        return;
    }

    cart.forEach((item, index) => {

        const li = document.createElement('li');

        li.className =
            "bg-white border border-blue-100 rounded-2xl p-4 shadow-sm hover:shadow-lg hover:border-blue-300 transition relative";

        li.innerHTML = `
            <div class="flex items-start justify-between gap-4">

                <div class="pr-4">

                    <p class="text-xs uppercase tracking-widest text-blue-400 font-semibold mb-1">
                        Saved Catalog
                    </p>

                    <a href="${item.link}" target="_blank"
                        class="brand-font text-2xl text-gray-900 hover:text-blue-500 transition leading-none block">

                        ${item.name}

                    </a>
                </div>

                <button class="remove-btn w-9 h-9 rounded-full bg-gray-100 text-gray-500 hover:bg-red-500 hover:text-white transition flex items-center justify-center shrink-0"
                    data-index="${index}">

                    <i class="fa-solid fa-xmark"></i>

                </button>
            </div>

            <div class="mt-4">

                <label class="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-1 block">
                    Notes
                </label>

                <textarea
                    class="cart-notes w-full border border-blue-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
                    rows="3"
                    data-index="${index}"
                    placeholder="Add notes, quantities, colors, sizes, logo placement, questions, etc...">${item.notes || ''}</textarea>
            </div>
        `;

        cartList.appendChild(li);
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {

        btn.addEventListener('click', (e) => {

            const index = parseInt(e.currentTarget.getAttribute('data-index'));

            const updatedCart = getCart();

            updatedCart.splice(index, 1);

            saveCart(updatedCart);

            updateCartCount();
            updateCartList();
        });
    });

    document.querySelectorAll('.cart-notes').forEach(input => {

        input.addEventListener('input', (e) => {

            const index = parseInt(e.target.getAttribute('data-index'));

            const cart = getCart();

            cart[index].notes = e.target.value;

            saveCart(cart);
        });
    });
}

function openCart() {

    updateCartList();

    document.body.classList.add('cart-open');

    if (window.innerWidth < 1024) {
        document.body.style.overflow = 'hidden';
    }
}

function closeCart() {

    document.body.classList.remove('cart-open');

    document.body.style.overflow = '';
}

if (cartIcon) {
    cartIcon.addEventListener('click', openCart);
}

if (closeCartBtn) {
    closeCartBtn.addEventListener('click', closeCart);
}

if (cartBackdrop) {
    cartBackdrop.addEventListener('click', closeCart);
}

// SAVE BUTTONS
document.addEventListener('click', (e) => {

    const saveBtn = e.target.closest('.save-btn');

    if (!saveBtn) return;

    const name = saveBtn.getAttribute('data-name');
    const link = saveBtn.getAttribute('data-link');

    const cart = getCart();

    const alreadySaved = cart.some(item =>
        item.name === name && item.link === link
    );

    if (!alreadySaved) {

        cart.push({
            name,
            link,
            notes: ''
        });

        saveCart(cart);
    }

    updateCartCount();
    openCart();
});

// SEND EMAIL
document.addEventListener('click', (e) => {

    if (!e.target.closest('#send-email')) return;

    const cart = getCart();

    if (cart.length === 0) {

        alert("Your saved list is empty!");

        return;
    }

    let body = "Here are the catalogs I'm interested in:\\n\\n";

    cart.forEach(item => {

        body += \`Catalog: \${item.name}\\n\`;

        if (item.link) {
            body += \`Catalog Link: \${item.link}\\n\`;
        }

        if (item.notes) {
            body += \`Notes/Questions:\\n\${item.notes}\\n\`;
        }

        body += "\\n";
    });

    const mailtoLink =
        \`mailto:sales@primepromollc.com?subject=Saved Catalogs&body=\${encodeURIComponent(body)}\`;

    window.location.href = mailtoLink;
});

// ESC CLOSE
document.addEventListener("keydown", (e) => {

    if (document.body.classList.contains('cart-open') && e.key === "Escape") {

        closeCart();
    }
});

updateCartCount();
