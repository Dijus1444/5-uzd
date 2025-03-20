document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('productForm');
    const inventoryList = document.getElementById('inventoryList');
    const foundList = document.getElementById('foundList');
    const searchInput = document.getElementById('searchId');
    const cartList = document.getElementById('cartList');

    let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateInventory() {
        inventoryList.innerHTML = '';
        inventory.forEach(product => {
            const row = document.createElement('tr');
            row.style.backgroundColor = "white";

            const productIdCell = document.createElement('td');
            productIdCell.textContent = product.id;
            
            const productNameCell = document.createElement('td');
            productNameCell.textContent = product.name;
            
            const productQuantityCell = document.createElement('td');
            productQuantityCell.textContent = product.quantity;

            const actionsCell = document.createElement('td');
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.onclick = () => editProduct(product.id);
            
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteProduct(product.id);
            
            const cartButton = document.createElement('button');
            cartButton.textContent = 'Add to Cart';
            cartButton.onclick = () => addToCart(product.id);

            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);
            actionsCell.appendChild(cartButton);

            row.appendChild(productIdCell);
            row.appendChild(productNameCell);
            row.appendChild(productQuantityCell);
            row.appendChild(actionsCell);
            
            inventoryList.appendChild(row);
        });

        localStorage.setItem('inventory', JSON.stringify(inventory));
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const productId = form.productId.value.trim();
        const productName = form.productName.value.trim();
        const productQuantity = Number(form.productQuantity.value.trim());
        if (!productId || !productName || isNaN(productQuantity) || productQuantity <= 0) {
            alert('Invalid input. Try again.');
            return;
        }

        const existingProduct = inventory.find(p => p.id === productId);

        if (existingProduct && form.productId.disabled === false) {
            alert('Product ID must be unique!');
            return;
        }

        if (form.productId.disabled) {
            existingProduct.name = productName;
            existingProduct.quantity = productQuantity;
            form.productId.disabled = false;
        } else {
            inventory.push({ id: productId, name: productName, quantity: productQuantity });
        }

        form.reset();
        updateInventory();
    });

    function editProduct(productId) {
        const product = inventory.find(p => p.id === productId);
        if (!product) return;

        form.productId.value = product.id;
        form.productName.value = product.name;
        form.productQuantity.value = product.quantity;
        form.productId.disabled = true;
    }

    function deleteProduct(productId) {
        inventory = inventory.filter(p => p.id !== productId);
        updateInventory();
        updateFoundList([]);
    }

    function addToCart(productId) {
        const product = inventory.find(p => p.id === productId);
        if (!product) return;

        const cartItem = cart.find(p => p.id === productId);
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            cart.push({ id: product.id, name: product.name, quantity: 1 });
        }

        updateCart();
    }

    function updateCart() {
        cartList.innerHTML = '';
        cart.forEach(product => {
            const row = document.createElement('tr');
            row.style.backgroundColor = "white";
            
            const productIdCell = document.createElement('td');
            productIdCell.textContent = product.id;
            
            const productNameCell = document.createElement('td');
            productNameCell.textContent = product.name;
            
            const productQuantityCell = document.createElement('td');
            productQuantityCell.textContent = product.quantity;

            const actionsCell = document.createElement('td');
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.onclick = () => removeFromCart(product.id);
            
            actionsCell.appendChild(removeButton);

            row.appendChild(productIdCell);
            row.appendChild(productNameCell);
            row.appendChild(productQuantityCell);
            row.appendChild(actionsCell);
            
            cartList.appendChild(row);
        });

        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function removeFromCart(productId) {
        cart = cart.filter(p => p.id !== productId);
        updateCart();
    }

    function searchProduct() {
        const searchId = searchInput.value.trim();
        if (!searchId) {
            alert('Please enter a product ID.');
            return;
        }

        const foundProducts = inventory.filter(p => p.id === searchId);

        if (foundProducts.length === 0) {
            foundList.innerHTML = '<li>No product found.</li>';
        } else {
            updateFoundList(foundProducts);
        }
    }

    function updateFoundList(foundProducts) {
        foundList.innerHTML = '';

        foundProducts.forEach(product => {
            const listItem = document.createElement('li');
            listItem.textContent = `${product.id} - ${product.name} (Qty: ${product.quantity})`;
            foundList.appendChild(listItem);
        });
    }

    updateInventory();
    updateCart();
});