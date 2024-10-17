<script>
	import '../app.postcss';
	import '../assets/css/app.css';
	import { onMount } from 'svelte';
	import { user } from '@stores/auth';
	import { cart } from '@stores/cart';
	import Toasts from '@interfaces/toasts/Toasts.svelte';
	import Cart from '@interfaces/cart/Cart.svelte';
	import { goto } from '$app/navigation';
	import {parseJwt , gateway} from '../app.d'
	import {dailyRecommendation} from '@stores/recommendation'
	import {getProductByName} from '@stores/products'
	import axios from "axios";
	export const ssr = false;

	function get_reco() {
		axios.get(`${gateway}/recommendations`)
            .then(async (res) => {
              if (res.data.status === "success"){
                //$dailyRecommendation = res.data.res_db.recommendation
				console.log("recommendations retrieved from db");
                $dailyRecommendation.reco1 = await getProductByName(res.data.res_db.recommendation[0].key)
                $dailyRecommendation.reco2 = await getProductByName(res.data.res_db.recommendation[1].key)
                $dailyRecommendation.reco3 = await getProductByName(res.data.res_db.recommendation[2].key)
              }


            })
            .catch(async (err) => {
                console.log("daily recommendation not update yet, get default")
                //console.log(err)
				$dailyRecommendation.reco1 = await getProductByName("Apple")
				$dailyRecommendation.reco2 = await getProductByName("Mango")
				$dailyRecommendation.reco3 = await getProductByName("Cucumber")

            });
			}
	onMount( async ()=> {
		//check for a session cookie
		const cookies = document.cookie.split(';')
		for (const cookie of cookies) {
			const [cookieName, cookieValue] = cookie.trim().split('=');
			if (cookieName ===  "ScappSession") {
				console.log("user logged in")
				$user.isLogged = true;
				const jwtToken = cookieValue;
				const decodedToken = parseJwt(jwtToken);
				if (decodedToken.sub === "admin"){
					console.log("user is admin")
					$user.isAdmin = true;
				}
				else{
					$user.isAdmin = false;
				}
			}
		}		
		// Initialize cart
		if ($user.isLogged){
		console.log('initialize the cart');
		axios.get(`${gateway}/cart`, {withCredentials : true})
		.then((res) => {
			if (res.data.status === "success"){
				cart.update((old) => res.data.res_db.cart);
				console.log("cart updated from database");
			}

		})
		.catch((err) => {
				console.log("user has no cart yet")
				});
		}
		get_reco()
		
	});

	function logout() {
		$user.isLogged = false;
		$user.isAdmin = false;
		document.cookie = "ScappSession=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";//delete the session cookie
		goto('/');
	}
</script>

<Toasts />

<nav class="navbar navbar-expand-lg navbar-light bg-light">
	<div class="container px-4 px-lg-5">
		<a class="navbar-brand" href="#!">Scapp</a>
		<div class="navbar-collapse">
			<ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
				<li class="nav-item"><a class="nav-link active" aria-current="page" href="/">Home</a></li>
				{#if $user.isAdmin}
					<li class="nav-item"><a class="nav-link" href="/admin">admin</a></li>
				{/if}
				{#if !$user.isLogged}
					<li class="nav-item"><a class="nav-link" href="/register">Register</a></li>
					<li class="nav-item"><a class="nav-link" href="/login">Sign in</a></li>
				{:else}
					<li class="nav-item">
						<a class="nav-link" href="/" on:click|preventDefault={logout}>Logout</a>
					</li>
				{/if}
			</ul>

			{#if $user.isLogged}
				<Cart />
				
			{/if}
		</div>
	</div>
</nav>

<slot />
