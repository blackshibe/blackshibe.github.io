import { FontLoader } from "https://unpkg.com/three@0.154.0/examples/jsm/loaders/FontLoader.js";

const font_loader = new FontLoader();

export async function load_font(url) {
	return new Promise((resolve) => {
		font_loader.load(url, function (font) {
			resolve(font);
		});
	});
}
