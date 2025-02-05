import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'

const appEl = document.getElementById("app");

if(!appEl) {
		throw new Error("Cannot find app element"); 
	}

const app = mount(App, {
	target: appEl,
});

export default app
