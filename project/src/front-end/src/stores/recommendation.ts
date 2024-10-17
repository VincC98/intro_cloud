import { writable } from 'svelte/store';
/* 
https://svelte.dev/docs/svelte-store
writable.subscribe = view the value
writable.update = change the value
writable.set = reset the value
*/
export const dailyRecommendation = writable({reco1: false, 
                                             reco2: false,
                                             reco3: false});
