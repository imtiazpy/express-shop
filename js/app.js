const allProducts = document.getElementById('all-products');
const searchField = document.getElementById('search-field');
const searchBtn = document.getElementById('search-btn');
let count = 0;
const loadProducts = () => {
	const url = `https://fakestoreapi.com/products`;
	fetch(url)
		.then((response) => response.json())
		.then((data) => showProducts(data));
};


// show all product in UI 
const showProducts = (products) => {
	for (const product of products) {
		const { title, price, category, image, rating: { rate, count } } = product;
		const div = document.createElement("div");
		div.classList.add("col", "single-product");
		div.innerHTML = `
      		<div class="card h-100 product">
      			<div class="card-body text-center">
        			<div class="mb-2">
						<img class="card-img-top product-image" src="${image}"/>
					</div>
					<h5 class="card-title">${title}</h5>
					<p class="card-text">Category: ${category}</p>	
      			</div>
      		
				<div class="card-footer">
					<h4 class="text-center">Price: $ ${price}</h4>
					<div class="d-flex justify-content-evenly">
						<button onclick="addToCart(${price})" id="addToCart-btn" class="buy-now btn btn-outline-success">add to cart</button>
						<button id="details-btn" class="btn btn-outline-info">Details</button>
					</div>
					<div class="d-flex justify-content-between mt-2">
						<button class="btn btn-info">Ratings: ${rate}</button>
						<button class="btn btn-success	">Rated by: ${count}</button>
					</div>
      			</div>
      		</div>
      	`;
		allProducts.appendChild(div);
	}
};
const addToCart = (price) => {
	count++;
	updatePrice('price', price);
	updateTaxAndCharge();
	updateTotal()
	document.getElementById("total-Products").innerText = count;
};

const getValue = (id) => {
	const element = document.getElementById(id).innerText;
	const value = parseFloat(element);
	return value;
};

// main price update function
const updatePrice = (id, value) => {
	const previousProductPrice = getValue(id);
	const newProductPrice = parseFloat(value);
	const total = previousProductPrice + newProductPrice;
	document.getElementById(id).innerText = total.toFixed(2);
};

// set innerText function
const setValue = (id, val) => {
	const value = parseFloat(val)
	document.getElementById(id).innerText = value.toFixed(2);
};

// update delivery charge and total Tax
const updateTaxAndCharge = () => {
	const productPrice = getValue("price");
	if (productPrice > 200) {
		setValue("delivery-charge", 30);
		setValue("total-tax", productPrice * 0.2);
	}
	if (productPrice > 400) {
		setValue("delivery-charge", 50);
		setValue("total-tax", productPrice * 0.3);
	}
	if (productPrice > 500) {
		setValue("delivery-charge", 60);
		setValue("total-tax", productPrice * 0.4);
	} else {
		setValue('delivery-charge', 20)
	}
};

//grandTotal update function
const updateTotal = () => {
	const price = getValue('price');
	const deliveryCharge = getValue('delivery-charge');
	const tax = getValue('total-tax');
	const grandTotal = price + deliveryCharge + tax;
	document.getElementById("total").innerText = grandTotal.toFixed(2);
};


// search functionality
const searchProduct = () => {
	const productList = document.getElementsByClassName('single-product')
	const searchKey = searchField.value.toLowerCase();
	for (const product of productList) {
		product.innerText.toLowerCase().includes(searchKey) ?
			product.style.display = 'block' : product.style.display = 'none';
	}
}

searchBtn.addEventListener('click', (e) => {
	e.preventDefault()
	searchProduct()
})

// showing products initially
loadProducts();

