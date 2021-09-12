const loadProducts = () => {
	// const url = `https://fakestoreapi.com/products`;
	const url = 'http://127.0.0.1:5500/data.json'
	fetch(url)
		.then((response) => response.json())
		.then((data) => showProducts(data));
};
loadProducts();

// show all product in UI 
const showProducts = (products) => {
	for (const product of products) {
		const { title, price, category, image } = product;
		const div = document.createElement("div");
		div.classList.add("col");
		div.innerHTML = `
      		<div class="single-product card h-100">
      			<div class="card-body">
        			<img class="product-image" src="${image}"/>
					<h4 class="card-title">${title}</h4>
					<p class="card-text">Category: ${category}</p>
					<h3>Price: $ ${price}</h3>
      			</div>
      		
				<div class="card-footer">
					<button onclick="addToCart(${price})" id="addToCart-btn" class="buy-now btn btn-success">add to cart</button>
					<button id="details-btn" class="btn btn-danger">Details</button>
      			</div>
      		
      		</div>
      	`;
		document.getElementById("all-products").appendChild(div);
	}
};
let count = 0;
const addToCart = (price) => {
	count = count + 1;
	updatePrice('price', price);

	updateTaxAndCharge();
	updateTotal()
	document.getElementById("total-Products").innerText = count;
};

const getInputValue = (id) => {
	const element = document.getElementById(id).innerText;
	const converted = parseFloat(element);
	return converted;
};

// main price update function
const updatePrice = (id, value) => {
	const convertedOldPrice = getInputValue(id);
	const convertPrice = parseFloat(value);
	const total = convertedOldPrice + convertPrice;
	document.getElementById(id).innerText = total.toFixed(2);
};

// set innerText function
const setInnerText = (id, value) => {
	const val = parseFloat(value)
	document.getElementById(id).innerText = val.toFixed(2);
};

// update delivery charge and total Tax
const updateTaxAndCharge = () => {
	const priceConverted = getInputValue("price");
	if (priceConverted <= 200) {
		setInnerText('delivery-charge', 20);
	}
	if (priceConverted > 200) {
		setInnerText("delivery-charge", 30);
		setInnerText("total-tax", priceConverted * 0.2);
	}
	if (priceConverted > 400) {
		setInnerText("delivery-charge", 50);
		setInnerText("total-tax", priceConverted * 0.3);
	}
	if (priceConverted > 500) {
		setInnerText("delivery-charge", 60);
		setInnerText("total-tax", priceConverted * 0.4);
	}
};

//grandTotal update function
const updateTotal = () => {
	const grandTotal =
		getInputValue("price") + getInputValue("delivery-charge") +
		getInputValue("total-tax");
	document.getElementById("total").innerText = grandTotal.toFixed(2);
};
