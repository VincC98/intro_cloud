<script lang="ts">
  import { user } from "@stores/auth";
  import { cart } from "@stores/cart";
  import { success } from "@stores/toasts";
  import Modal from "@interfaces/misc/Modal.svelte";
  import { gateway } from "../../app.d";
  import {dailyRecommendation} from '@stores/recommendation'
  import axios from "axios";

  let showModal = false;
 
  interface Product {
    id: String;
    name: string;
    price: number;
    image: string;
    category: String;
    description: String;
  }
  export let product: Product;
  
  let quantity: number = 0;
  function addToCart() {
    cart.addToCart({ ...product, quantity });
    quantity = 0;

    success("Added item to cart");
    axios.post(`${gateway}/cart`, {cart : $cart }, {withCredentials: true});
    axios.post(`${gateway}/logs`, {action : "add item to cart", log : [product, quantity]}, {withCredentials : true});
  }
  function viewItem(){
      showModal = true;
      if ($user.isLogged === true){
          axios.post(`${gateway}/logs`, {action : "view item", log : product}, {withCredentials : true});
      }
            
  }
  
    function isProductInCart(productName) {
  return $cart.some(product => product.name === productName);
}
  </script>


<div class="col mb-5">
  <div class="card h-100">
    <!-- Product image-->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <img
      class="card-img-top"
      src={product.image}
      alt="..."
      on:click={viewItem}
    />
    <!-- Product details-->
    <div class="card-body p-4">
      <div class="text-center">
        <!-- Product name-->
        <h5 class="fw-bolder">{product.name}</h5>
        <!-- Product price-->
        ${product.price}
      </div>
    </div>
    <!-- Product actions-->
    {#if $user.isLogged}
      <div class="card-footer p-4 pt-0 border-top-0 bg-transparent mb-4">
        <div class="custom-number-input h-10 w-32 m-auto">
          <div
            class="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1"
          >
            <button
              on:click={() => quantity--}
              class=" bg-pink-500 text-gray-600 hover:text-gray-700 hover:bg-pink-600 h-full w-20 rounded-l cursor-pointer outline-none"
            >
              <span class="m-auto text-2xl font-thin">−</span>
            </button>
            <input
              type="number"
              class="outline-none focus:outline-none text-center w-full bg-gradient-to-r from-pink-500 to-yellow-500 font-semibold text-md hover:text-black focus:text-black md:text-basecursor-default flex items-center text-gray-700 outline-none"
              name="custom-input-number"
              bind:value={quantity}
            />
            <button
              on:click={() => quantity++}
              class="bg-yellow-500 text-gray-600 hover:text-gray-700 hover:bg-yellow-600 h-full w-20 rounded-r cursor-pointer"
            >
              <span class="m-auto text-2xl font-thin">+</span>
            </button>
          </div>
          <button
            disabled={quantity == 0}
            class="p-1 transition ease-in-out bg-gradient-to-r from-pink-500 to-yellow-500 to-90% text-center font-semibold text-md w-full text-white hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 rounded-md"
            on:click={addToCart}>Add to cart</button
          >
        </div>
      </div>
    {/if}

    <!-- QuickView-->
    <Modal bind:showModal cssClass="text-center">
      <h2 class="text-4xl" slot="header">
        {product.name}
        <br />
        <span class="text-xl"><em>{product.price}$</em></span>
      </h2>
      <div class="container">
        <img class="card-img-top" src={product.image} alt={product.name} />
        <h2 class="text-lg">About the product</h2>
        <p>{product.description}</p>
        <br />
        <hr class="mb-3" />
        <h3>Customers who bought this item also bought</h3>
        <ul class="list-group mb-3">
          {#if $dailyRecommendation.reco1 != false}
            {#each Object.values($dailyRecommendation) as $reco ($reco)}
              {#if $reco != undefined}
                {#if $reco.name != product.name}
                {#if isProductInCart($reco.name) != true}
                  
                    <li class="list-group-item grid grid-flow-row-dense grid-cols-4 lh-sm">
                      <img  src={$reco.image} alt={$reco.name} />
                      </li>
                      
                    {/if}
                  {/if}
                {/if}

              {/each}
            {:else}
              <li class="list-group-item grid grid-flow-row-dense lh-sm">Your recommendation is empty</li>
            {/if}
        </ul>
      </div>
    </Modal>
  </div>
</div>
<style>
  /* Chrome, Safari, Edge, Opera */
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }

  .custom-number-input input:focus {
    outline: none !important;
  }

  .custom-number-input button:focus {
    outline: none !important;
  }

  
</style>
