import "./index.css";

import snow from "./RBA_01.png";

function Site() {
	let banners = [snow];
	let banner = Math.floor(Math.random() * banners.length);

	return (
		<div
			style={{ backgroundImage: `url("${banners[banner]}")` }}
			className="font-sans leading-6 font-ibm-mono text-left text-lg bg-image underline-offset-4"
		>
			<div className="custom-bg-opaque flex justify-center items-center h-screen">
				<div className="flex w-100 gap-2 items-start flex-col p-8 justify-center custom-bg-opaque">
					<p>blackshibe</p>
					<p style={{ opacity: "50%" }}>professional programmer & hobbyist musician</p>
					<hr />
					<p>foxes and text editors</p>
					<p>the world is a fuck</p>
					<p>all good things must end</p>
					<p style={{ opacity: "50%" }}>thanks, Jax</p>
					<hr />
					<a href="https://github.com/blackshibe/">https://github.com/blackshibe/</a>
					<a href="https://soundcloud.com/shibesongs">https://soundcloud.com/shibesongs</a>
				</div>
			</div>
		</div>
	);
}

export default Site;
