import { derived, writable } from 'svelte/store';
import axios from "axios";
import { gateway } from '../app.d';

export const products = createProducts();


//console.log('Retrive the products from the database');
axios.get(`${gateway}/product/all`, {withCredentials : true})
.then((res) => {
	if (res.data.status === "success"){
		var dbProducts = res.data.res_db;
		//console.log("Products retrieved from database");

		for (let i = 0; i < dbProducts["total_rows"]; i++) {
			var prod = dbProducts.rows[i];

			axios.get(`${gateway}/product/${prod.id}`)
			.then((res) => {
				if (res.data.status === "success"){
					products.__addProduct(res.data.res_db);
				}
			})
		}	
		//console.log(`Products added to the store`);	
	}
})
.catch((err) => {
		//console.log("error when retrieving the products")
		console.log(err)
});	


function createProducts() {
	const { subscribe, set, update } = writable({});
	return {
		subscribe,
		update,
		set,
		__addProduct: (product) =>
			update((oldProducts) => {

				//console.log(`Add product ${product.name} to the store`);
				if (!(product.category in oldProducts)) {
					oldProducts[product.category] = [];
				}
				oldProducts[product.category].push({_id: product._id, name : product.name, price : product.price, image : product.image, category : product.category, description : product.description});

				return oldProducts;
			}),

		__removeProduct: (product) =>
			update((oldProducts) => {

				//console.log(`Remove product ${product.name} from the store`);
				let index = oldProducts[product.category].findIndex((prod) => prod._id == product._id);
				if (index == -1) return oldProducts;
				oldProducts[product.category].splice(index, 1);

				axios.get(`${gateway}/product/delete/${product._id}`, {withCredentials : true})
				.then((res) => {
					console.log(`Product ${product._id} has been deleted `)
				})
				.catch((err) => {
					console.log(err)
				})
				console.log(`Product ${product._id} has been deleted `)

				return oldProducts
			}),
		
		__updateProduct: (product) =>
			update((oldProducts) => {

				//console.log(`Update product ${product.name} from the store`);
				let index = oldProducts[product.category].findIndex((prod) => prod._id == product._id);
				if (index == -1) return oldProducts;
				oldProducts[product.category][index] = product;

				axios.post(`${gateway}/product/update`, product, {withCredentials : true})
				.then((res) => {
					console.log(`Product ${product._id} has been updated	`)
				})
				.catch((err) => {
					console.log(err)
				})
				console.log(`Product ${product._id} has been updated `)

				return oldProducts
			})
	};
}


export const productsMerged = derived(products, ($products) => {
	return Object.values($products).flat();
});

export const getProductByName = (productName) => {
	//console.log("inside get product by name")
	//console.log(productName)
	return new Promise((resolve, reject) => {
		productsMerged.subscribe((value) => {
			if (Array.isArray(value) && value.length >= 8) {
				const eighthArray = value;
				//console.log(eighthArray);
				// Do something with eighthArray
				const foundObject = eighthArray.find((item) => item.name === productName);

				if (foundObject) {
				console.log("Found:", foundObject);
				resolve(foundObject);
				} else {
					reject(new Error(`Object with name ${productName} not found`));
				}
			}
	});
  });
}