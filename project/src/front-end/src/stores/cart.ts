import { derived, writable } from 'svelte/store';

function createCart() {
	const { subscribe, set, update } = writable([]);

	return {
		set,
		subscribe,
		update,
		addToCart: (item) =>
			update((oldCart) => {
				if(!(item._id in oldCart)) {
					oldCart[item._id] = {id:item._id, quantity:0};
				}
				const itemIndex = oldCart.findIndex((e) => e._id === item._id);
				console.log(item);
				if (itemIndex === -1) {
					return [...oldCart, item];
				} else {
					oldCart[itemIndex].quantity += item.quantity;
					return oldCart;
				}
			}),
		
	};
}

export const cart = createCart();

export const totalQuantity = derived(cart, ($cart) =>
	$cart.reduce((acc, curr) => acc + curr.quantity, 0)
);

export const totalPrice = derived(cart, ($cart) =>
	$cart.reduce((acc, curr) => acc + curr.quantity * curr.price, 0)
);
