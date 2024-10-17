// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

//to modify
const url = 'http://192.168.56.102'
export const account = 'modified_for_privacy'
export const gateway = `${url}:3010`;
/**
 * 
 * @param token raw jwt recieved from the authentifcation process
 * @returns the decoded token (from base 64) to a dictionary like object with ["sub", "iat", "exp"] keys
 */
export function parseJwt(token) {
	try {
		return JSON.parse(atob(token.split('.')[1]));
	} 
	catch (e) {
		return null;
	}
}
 
/**
 * 
 * @param decodedToken is a Jwt creating by the authentification microservice
 * @param tokenAuth raw token value response from the authentification microservice
 * The function create a session cookie with the value of the token and expiration date
 */
export function createCookie(decodedToken, tokenAuth){
	let exp_date = new Date()
	exp_date.setTime(exp_date.getTime()+(decodedToken.exp))
	document.cookie = `ScappSession=${tokenAuth}; expires=${exp_date}`

}

export {};
