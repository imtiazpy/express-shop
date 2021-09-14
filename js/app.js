const allProducts = document.getElementById('all-products');
const searchField = document.getElementById('search-field');
const searchBtn = document.getElementById('search-btn');
const addedProducts = document.getElementById('added-Products');
let count = 0;

// function for loading all the products from the API 
const loadProducts = () => {
	const url = `https://fakestoreapi.com/products`;
	fetch(url)
		.then((response) => response.json())
		.then((data) => showProducts(data));
};


// show all product in UI 
const showProducts = (products) => {
	// this object is used for adding star rating in each product dynamically
	const ratingObj = {}

	for (const product of products) {

		const { id, title, price, category, image, description, rating: { rate, count } } = product;
		ratingObj[`ratings-${id}`] = rate

		const div = document.createElement("div");
		div.classList.add("col", "single-product");
		div.innerHTML = `
      		<div class="card h-100 product border border-info">
      			<div id="card-body" class="card-body text-center">
        			<div class="bg-white border border-info rounded-3 p-2 mb-2">
						<img class="card-img-top product-image" src="${image}"/>
					</div>
					<h5 class="card-title">${title}</h5>
					<p class="card-text">Category: ${category}</p>	
      			</div>
				<div class="card-footer">
					<h4 class="text-center">Price: $ ${price}</h4>
					<div class="d-flex justify-content-evenly">
						<button onclick="addToCart(${price})" id="addToCart-btn" class="buy-now btn btn-outline-success">add to cart</button>
						<button id="details-btn" class="btn btn-outline-info" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="showDetail('${title}', '${image}', '${description}')">Details</button>
					</div>
					<div class="d-flex justify-content-evenly mt-2">
						<button class="d-flex align-items-center btn btn-info ratings-${id}">
							<div class="hollow">
								<div class="solid"></div>
							</div>
							<span class="rate ms-1">(${rate})</span>
						</button>
						<button class="btn btn-success">
							<i class="fas fa-user-friends"></i> <span class="rate">${count}</span>
						</button>
					</div>
      			</div>
      		</div>
      	`;
		allProducts.appendChild(div);
	}
	// setting the ratings of the product on each card element
	setRatings(ratingObj)
};


// show single product info in the modal on button click
const showDetail = (title, image, description) => {
	const detailCard = document.getElementById('detail-card');
	detailCard.textContent = '';
	detailCard.innerHTML = `
		<div class="col">
			<div class="card border border-info">
				<div class="card-body text-center">
					<div class="border border-info rounded-3 p-2 mb-2">
						<img class="card-img-top product-image" src="${image}"/>
					</div>
					<h5 class="card-title">${title}</h5>
					<p class="card-text">${description}</p>	
	  			</div>
			</div>
		</div>
	`
}



// get value from any amount field by ID 
const getValue = (id) => {
	const element = document.getElementById(id).innerText;
	const value = parseFloat(element);
	return value;
};

// set innerText of any field
const setValue = (id, val) => {
	const value = parseFloat(val)
	document.getElementById(id).innerText = value.toFixed(2);
};


// function for adding products to cart 
const addToCart = (price) => {
	count++;
	// disabling err message in case it was enabled on buyNow button click
	toggleError(false)
	updatePrice('price', price);
	updateTaxAndCharge();
	updateTotal()
	addedProducts.innerText = count;
};

// main price update function
const updatePrice = (id, value) => {
	const previousProductPrice = getValue(id);
	const newProductPrice = parseFloat(value);
	const total = previousProductPrice + newProductPrice;
	setValue('price', total)
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
	}
};

//grandTotal update function
const updateTotal = () => {
	const price = getValue('price');
	const deliveryCharge = getValue('delivery-charge');
	const tax = getValue('total-tax');
	const grandTotal = price + deliveryCharge + tax;
	setValue('total', grandTotal);
};

// clear all the value on buyNow btn click
const buyNowHandler = () => {
	const addedProducts = count
	const cartAmountFields = ['price', 'delivery-charge', 'total-tax', 'total'];
	cartAmountFields.forEach(field => {
		if (addedProducts === 0) {
			// if any products were not added the error message will be shown 
			toggleError("No products were added to cart! Please add some", true)
		} else {
			setValue(field, 0)
		}
	});
	count = 0
	// setting the initial delivery charge and products count 
	document.getElementById('delivery-charge').innerText = 20;
	addedProducts.innerText = count;
}

// function to toggle error message on and off
const toggleError = (msg = '', toShow) => {
	const alertMsg = document.getElementById('alert-message');
	if (toShow) {
		alertMsg.innerText = msg;
		alertMsg.classList.remove('d-none');
	} else {
		alertMsg.classList.add('d-none')
	}
};


// function for star ratings
const setRatings = ratingObj => {
	const starTotal = 5;
	for (const rating in ratingObj) {
		const percentage = (ratingObj[rating] / starTotal) * 100;
		const percentageRounded = `${(Math.round(percentage / 10) * 10)}%`;
		// the className of the ratings btn and the key of ratingObj matches, 
		// hence we are setting style on the ratings btn using that key of ratingObj
		document.querySelector(`.${rating} .solid`).style.width = percentageRounded;
	}
};


// search functionality
const searchProduct = () => {
	// disabling error in case it was enabled on empty search 
	toggleError(false)
	// taking all the cards in an array by className 
	const productList = document.getElementsByClassName('single-product')
	const searchKey = searchField.value.toLowerCase();

	// if the searchKey is available in any of the cards then those cards will be shown
	for (const product of productList) {
		product.innerText.toLowerCase().includes(searchKey) ?
			product.style.display = 'block' : product.style.display = 'none';
	}
}

searchBtn.addEventListener('click', (e) => {
	e.preventDefault()
	if (!searchField.value) {
		toggleError("Please type something in the box", true)
	} else {
		toggleError(false)
		searchProduct()
	}

})

// showing products initially
loadProducts();
