import { writable } from 'svelte/store';
/* 
https://svelte.dev/docs/svelte-store
writable.subscribe = view the value
writable.update = change the value
writable.set = reset the value
*/
export const user = writable({ isLogged: false, isAdmin: false });
