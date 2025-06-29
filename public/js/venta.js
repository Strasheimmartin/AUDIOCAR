document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/products')
        .then(response => response.json())
        .then(products => {
            const productGrid = document.getElementById('product-grid');
            if (products.length === 0) {
                productGrid.innerHTML = '<p>No hay productos disponibles en este momento.</p>';
                return;
            }
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="price">${product.price}</div>
                `;
                productGrid.appendChild(productCard);
            });
        });
});