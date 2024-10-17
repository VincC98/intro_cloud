<script>
	import { user } from '@stores/auth';
	import { goto } from '$app/navigation';
	import { cart } from '@stores/cart';
	import axios from "axios";
	import { addToast } from '@stores/toasts';
	import {parseJwt, createCookie, gateway} from '../../app.d'

	let username = '';
	let password = '';

	function handleOnSubmit() {
		axios
			.get(`${gateway}/user/${username}/${password}`, { username, password }, {withCredentials : true})
      		.then((res) => {
				if (res.data.status === "success"){
					//set the cookie with the answer from the authentification API
					const decodedToken = parseJwt(res.data.token);
					createCookie(decodedToken, res.data.token)

					//get cart when logged in 
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
					
					if (username === 'admin' && password === 'admin') {
					$user.isLogged = true;
					$user.isAdmin = true;
					addToast({
						message: `Welcome back admin!`,
						type: 'success',
						dismissible: true,
						timeout: 3000
					});
					goto('/');
					return;
					}
					else {
					$user.isLogged = true;
					$user.isAdmin = false;
					addToast({
						message: `Welcome back ${username}!`,
						type: 'success',
						dismissible: true,
						timeout: 3000
					});
					goto('/');
					return;
					}
				}	 
			}).catch((err) => {
				addToast({
				message: "Login completed with an error.",
				type: "error",
				dismissible: true,
				timeout: 3000,
				});
			});	
	}
</script>

<form method="POST" on:submit|preventDefault={handleOnSubmit}>
	<div class="container py-5 h-100">
		<div class="row d-flex justify-content-center align-items-center h-100">
			<div class="col-12 col-md-8 col-lg-6 col-xl-5">
				<div class="card shadow-2-strong" style="border-radius: 1rem;">
					<div class="card-body p-5 text-center">
						<h3 class="mb-5">Sign in</h3>

						<div class="form-outline mb-4">
							<input id="username" class="form-control form-control-lg" bind:value={username} />
							<label class="form-label" for="username">Username</label>
						</div>

						<div class="form-outline mb-4">
							<input
								type="password"
								id="password"
								class="form-control form-control-lg"
								bind:value={password}
							/>
							<label class="form-label" for="password">Password</label>
						</div>

						<button class="btn btn-primary btn-lg btn-block" type="submit">Login</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</form>
