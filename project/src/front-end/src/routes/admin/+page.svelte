<script>
	import {
		Button,
		ButtonGroup,
		GradientButton,
		Input,
		Label,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Checkbox,
		TableSearch
	} from 'flowbite-svelte';

	import { products, productsMerged } from '@stores/products';
	import Modal from '@interfaces/misc/Modal.svelte';
	import axios from "axios";
	import { addToast } from "@stores/toasts";
	import { gateway } from '../../app.d';

	let modalProduct = null;
	let searchTerm = '';
	$: filteredItems = $productsMerged.filter(
		(product) => product.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
	);
	$: showUpdateModal = false;
	$: showCreateModal = false;

	function displayUpdateModal(product) {
		modalProduct = product;
		showUpdateModal = true;
	}

	function displayCreateModal() {
		modalProduct = { _id: '',name: '', price: 0, category: '', image: '' , description: ''};
		showCreateModal = true;
	}

	function updateModalProduct() {
		// Sanitize input
		products.__updateProduct(modalProduct);
		console.log(`Product ${modalProduct.name} has been updated`)

		modalProduct = null;
		showUpdateModal = false;
	}

	function createProduct() {
		products.__addProduct(modalProduct);

		axios.post(`${gateway}/product`, modalProduct, {withCredentials : true})
				.then((res) => {
					console.log(`Product ${modalProduct.name} has been added`)
				})
				.catch((err) => {
					console.log("impossible to add product")
		})

		modalProduct = null;
		showCreateModal = false;
	}

	function deleteModalProduct() {
		deleteProduct(modalProduct);
	}

	function deleteProduct(product) {
		// This function deletes the product from the store.

		products.__removeProduct(product);
		console.log(`Product ${modalProduct.name} has been removed`)
		$products = $products; // This line is needed because Svelte's reactivity is triggered by assignment. Deleting an element of the array is not an assignment so we trigger one manually.
		modalProduct = null;
		showUpdateModal = false;
	}

	function updateRecommendation(){
		// update recommendation database
		axios.post(`${gateway}/recommendations`)	
			.then((res) => {
				console.log(res.data.status)
				if (res.data.status === "success"){
			addToast({
				message: "Daily Recommendation for users updated!",
				type: "success",
				dismissible: true,
				timeout: 3000,
					});
				}
			})
			.catch((err) => {
			addToast({
				message: "Could not update Daily Recommendation, or already updated!",
				type: "error",
				dismissible: true,
				timeout: 3000,
			});
			});
		
	}
</script>

<!-- Header-->
<header class="py-5 bg-gradient-to-r from-pink-500 to-yellow-500">
	<div class="container px-4 px-lg-5 my-3">
		<div class="text-center text-white">
			<h1 class="display-4 fw-bolder">Admin</h1>
		</div>
	</div>
</header>
<div class="sm:p-5 md:p-10">
	<GradientButton color="pinkToOrange" on:click={displayCreateModal}>Add product</GradientButton>
	<GradientButton color="greenToBlue" on:click={updateRecommendation}>Load Daily Recommendation</GradientButton>
	<TableSearch placeholder="Search by maker name" hoverable={true} bind:inputValue={searchTerm}>
		<TableHead>
			<TableHeadCell>Product name</TableHeadCell>
			<TableHeadCell>Category</TableHeadCell>
			<TableHeadCell>Price</TableHeadCell>
			<TableHeadCell>Description</TableHeadCell>
			<TableHeadCell>
				<span class="sr-only"> Edit </span>
			</TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each filteredItems as item, index}
				<TableBodyRow>
					<TableBodyCell>{item.name}</TableBodyCell>
					<TableBodyCell>{item.category}</TableBodyCell>
					<TableBodyCell>${item.price}</TableBodyCell>
					<TableBodyCell>{item.description}</TableBodyCell>
					<TableBodyCell>
						<ButtonGroup>
							<Button color="yellow" on:click={displayUpdateModal(item)}>Edit</Button>
							<Button color="red" on:click={deleteProduct(item)}>Delete</Button>
						</ButtonGroup>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</TableSearch>
</div>
<!-- QuickView-->
<Modal bind:showModal={showUpdateModal} cssClass="text-center">
	<h2 slot="header" class="text-xl mb-2">Update product</h2>
	{#if modalProduct}
		<div class="container m-2">
			<Label class="space-y-2">
				<span>Product name</span>
				<Input type="text" class="text-xl" bind:value={modalProduct.name} />
			</Label>
			<br />
			<Label class="space-y-2">
				<span>Product price</span>
				<Input type="number" step=".01" class="text-xl" bind:value={modalProduct.price} />
			</Label>
			<br />
			<Label class="space-y-2">
				<span>Product image</span>
				<Input type="text" class="text-xl" bind:value={modalProduct.image} />
			</Label>
			<br />
			<Label class="space-y-2">
				<span>Product description</span>
				<Input type="text" class="text-xl" bind:value={modalProduct.description} />
			</Label>
		</div>
		<div class="container">
			<img class="card-img-top w-40 h-40 m-auto" src={modalProduct.image} alt={modalProduct.name} />
		</div>
		<ButtonGroup class="space-x-px">
			<GradientButton color="purpleToBlue" on:click={updateModalProduct}>Update</GradientButton>
			<GradientButton color="cyanToBlue" on:click={deleteModalProduct}>Delete</GradientButton>
		</ButtonGroup>
	{/if}
</Modal>

<Modal bind:showModal={showCreateModal} cssClass="text-center">
	<h2 slot="header" class="text-xl mb-2">Create product</h2>
	{#if modalProduct}
		<div class="container m-2">
			<Label class="space-y-2">
				<span>Product name</span>
				<Input type="text" class="text-xl" bind:value={modalProduct.name} required />
			</Label>
			<br />
			<Label class="space-y-2">
				<span>Product category</span>
				<Input type="text" class="text-xl" bind:value={modalProduct.category} required />
			</Label>
			<br />
			<Label class="space-y-2">
				<span>Product price</span>
				<Input type="number" step=".01" class="text-xl" bind:value={modalProduct.price} required />
			</Label>
			<br />
			<Label class="space-y-2">
				<span>Product image</span>
				<Input type="text" class="text-xl" bind:value={modalProduct.image} />
			</Label>
			<br />
			<Label class="space-y-2">
				<span>Product description</span>
				<Input type="text" class="text-xl" bind:value={modalProduct.description} />
			</Label>
		</div>
		<div class="container">
			<img class="card-img-top w-40 h-40 m-auto" src={modalProduct.image} alt={modalProduct.name} />
		</div>
		<ButtonGroup class="space-x-px">
			<GradientButton color="cyanToBlue" on:click={createProduct}>Create</GradientButton>
		</ButtonGroup>
	{/if}
</Modal>
