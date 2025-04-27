import { noise_options, noise_start } from "/webgl/noise.js";
import { glitch_start } from "/webgl/glitch.js";

const logs = document.getElementById("logs");
const after_start_logs = document.getElementById("new-logs");
const load_notification = document.getElementById("load-notification");

const has_seen_intro_value = true; //  localStorage.getItem("has_seen_intro") !== undefined;
const MS_INTRO_STOP_DELAY = has_seen_intro_value ? 100 : 250;

let ms_delay = has_seen_intro_value ? 0 : 100;
let logs_in_one_frame = has_seen_intro_value ? 100 : 1;
let opacity = has_seen_intro_value ? 0.8 : 0.1;

let element_index = 0;
function out_log(target, str) {
	// overwrite existing pre if it exists under element index, otherwise create a new one
	if (target.children[element_index] !== undefined) {
		target.children[element_index].innerHTML = str;
		element_index += 1;
	} else {
		const new_element = document.createElement("pre");
		new_element.innerHTML = str;
		target.appendChild(new_element);

		element_index += 1;
		if (new_element.getBoundingClientRect().top > window.innerHeight - 80) {
			element_index = 0;
		}
	}
}

export function has_seen_intro() {
	return has_seen_intro_value;
}

async function get_text(url) {
	return (await (await fetch(url)).text()).split("\n");
}

function update_opacity() {
	logs.style.opacity = opacity;
	noise_options.strength = opacity;
}

let showed_neofetch = false;
async function show_neofetch() {
	showed_neofetch = true;
	const log = await get_text("/script/log/neofetch.html");
	after_start_logs.innerHTML = "";
	after_start_logs.classList.remove("opacity-0");
	after_start_logs.classList.add("bg-transparent");

	log.forEach((element, index) => {
		setTimeout(() => {
			after_start_logs.innerHTML += element + "\n";
		}, index * 25);
	});
}

globalThis.show_neofetch = show_neofetch;

async function after_intro() {
	opacity = 1;
	update_opacity();

	ms_delay = 100;
	glitch_start();
	noise_options.enabled = false;
	logs.innerHTML = "";
}

export async function load_logs() {
	load_notification.classList.add("hidden");
	localStorage.setItem("has_seen_intro", true);
	noise_start();

	const boot_log = await get_text("/script/log/bootlog.txt");
	let next_update_time = 0;
	let cur_boot_element = 0;

	function draw() {
		if (Date.now() < next_update_time) {
			requestAnimationFrame(draw);
			return;
		}

		ms_delay -= 3;
		opacity += 1 / boot_log.length;
		logs_in_one_frame += 20 / boot_log.length;
		next_update_time = Date.now() + ms_delay;

		update_opacity();

		for (let i = 0; i < logs_in_one_frame; i++) {
			let element = boot_log[cur_boot_element];
			cur_boot_element += 1;

			if (element === undefined) {
				setTimeout(after_intro, MS_INTRO_STOP_DELAY);
				return;
			}

			out_log(logs, element);
		}

		requestAnimationFrame(draw);
	}

	requestAnimationFrame(draw);
}
