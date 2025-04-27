import { load_logs, has_seen_intro } from "/script/logs.js";

const load_button = document.getElementById("load-button");

// if (has_seen_intro()) {
// 	load_logs();
// } else {
// 	load_button.addEventListener("click", () => {
// 		load_logs();
// 	});
// }

load_logs();
