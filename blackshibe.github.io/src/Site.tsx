import { faDiscord, faGithub, faYoutube, IconDefinition } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import "./index.css";

import sky from "./wallpaper/sky.jpg";
import snow from "./wallpaper/snow.jpeg";

function ProjectCard({ children, href }: React.PropsWithChildren<{ href?: string }>) {
	return (
		<a href={href}>
			<div className="border-zinc-700 bg-zinc-900 rounded border ease-in-out duration-100 hover:shadow-2xl cursor-pointer">
				{children}
			</div>
		</a>
	);
}

function MiscProjectCard({ children, href }: React.PropsWithChildren<{ href?: string }>) {
	return (
		<a href={href}>
			<div className="border-zinc-700 bg-zinc-900 p-4 rounded border ease-in-out duration-100 hover:shadow-2xl cursor-pointer">
				{children}
			</div>
		</a>
	);
}

function ExperienceCard({ children }: React.PropsWithChildren<{}>) {
	return <div className="border-zinc-700 bg-zinc-900 rounded border p-4">{children}</div>;
}

function SocialIcon({ icon, text, link }: { icon: IconDefinition; text: string; link?: string }) {
	return (
		<div className="flex">
			<div className="aspect-square w-7 text-base">
				<FontAwesomeIcon className={"w-6 aspect-square "} icon={icon} />
			</div>
			<a href={link}>{text}</a>
		</div>
	);
}

function Header({ header, footer, href }: { header: string; footer: string; href?: string }) {
	return (
		<>
			<a href={href} className="text-2xl font-bold font-ibm-mono ease-in-out duration-100 hover:text-sky-300">
				{header}
			</a>
			<h2 className="text-1xl font-ibm-mono font-bold text-sky-100 pb-4">{footer}</h2>
		</>
	);
}

function Site() {
	let banners = [sky, snow];
	let banner = Math.floor(Math.random() * banners.length);

	return (
		<div
			style={{ backgroundImage: `url("${banners[banner]}")` }}
			className="font-sans leading-6 font-poppins text-left text-lg bg-image underline-offset-4"
		>
			<div className="from-zinc-900 bg-gradient-to-t">
				<div className="card-width flex justify-between flex-col h-screen p-8 md:p-16 text-zinc-200">
					<div>
						<h1 className="text-4xl md:text-6xl font-bold font-ibm-mono">blackshibe</h1>
						<h2 className="text-1xl font-ibm-mono font-bold text-sky-200">foxes & text editors</h2>
					</div>
					<div className="text-sm sm:text-base">
						<p>Hi! i'm blackshibe. I mainly do programming nowadays.</p>
						<br />
						<p>
							Ever since I was 9, I've been playing with electronics. I started programming in 2017 and
							have been busy making games since.
						</p>
						<br />
						<p>
							The art of programming has had me kneeling, bending down and patching up my sore wounds. One
							could say I was raped, but I say I use linux.
						</p>
						<br />

						<p className="font-bold">Languages I know</p>
						<div className="flex text-2xl gap-1 pt-1">
							<i className="devicon-html5-plain"></i>
							<i className="devicon-typescript-plain"></i>
							<i className="devicon-react-original"></i>

							<div className="w-2"></div>

							<i className="devicon-lua-plain"></i>
							<i className="devicon-python-plain"></i>

							<div className="w-2"></div>

							<i className="devicon-cplusplus-plain"></i>
							<i className="devicon-csharp-plain"></i>
						</div>

						<p className="font-bold pt-8">Technologies I'm familiar with</p>
						<div className="flex text-2xl gap-1 pt-1">
							<i className="devicon-git-plain"></i>

							<div className="w-2"></div>

							<i className="devicon-react-original"></i>
							<i className="devicon-nextjs-original"></i>
							<i className="devicon-tailwindcss-plain"></i>
							<i className="devicon-electron-original"></i>

							<div className="w-2"></div>

							<i className="devicon-arduino-plain"></i>
							<i className="devicon-opengl-plain"></i>
						</div>
					</div>
					<div className="text-left text-white text-1xl gap-1 flex flex-col w-full">
						<SocialIcon icon={faDiscord} text="Black Shibe#4208" />
						<SocialIcon link="https://github.com/blackshibe" icon={faGithub} text="blackshibe" />
						<SocialIcon link="https://youtube.com/@biackshibe" icon={faYoutube} text="biackshibe" />
					</div>
				</div>
			</div>
			{/* 2nd page */}
			<div className="bg-zinc-800 flex flex-col bg-noise justify-center items-center text-white">
				<div className="experience-width gap-8 p-2 md:p-8">
					<h1 className="text-2xl p-4 font-bold font-ibm-mono text-zinc-200">My Projects</h1>
					<div className="h-full grid md:flex justify-center">
						<div className="p-4 flex flex-col gap-4 w-full md:w-3/6">
							<ProjectCard href="https://cetuspro.com/en">
								<img src="logo-dark.jpg" className="from-zinc-900 bg-gradient-to-t rounded-t" />
								<div className="p-4">
									<Header header="CetusPro" footer="Software & Technology" />
									<a
										href="https://github.com/blackshibe/remind-me-notes"
										className="text-zinc-400 text-base underline "
									>
										Academy project: Remind Me Notes
									</a>
								</div>
							</ProjectCard>
							<ProjectCard href="https://www.roblox.com/games/3837841034/0-21-6-Deadline">
								<img src="ump.png" className="from-zinc-900 bg-gradient-to-t rounded-t" />
								<div className="p-4">
									<Header header="Deadline" footer="First Person Shooter" />

									<p className="text-zinc-400 pt-4 text-base">
										Popular First Person Shooter with the most advanced weapon customization in the
										world.
									</p>
								</div>
							</ProjectCard>
						</div>
						<div className="p-4 flex flex-col w-full md:w-3/6 gap-4">
							<MiscProjectCard href="https://blackshibe.github.io/canim">
								<h1 className="text-2xl font-bold font-ibm-mono">Canim</h1>
								<h2 className="text-1xl font-ibm-mono font-bold text-sky-100">Open-source Animator</h2>
								<p className="text-zinc-600 pt-4 text-base">
									Open-source Roblox animation library used in Deadline.
								</p>
							</MiscProjectCard>

							<MiscProjectCard href="https://github.com/blackshibe/remind-me-notes">
								<h1 className="text-2xl font-bold font-ibm-mono">Remind Me</h1>
								<h2 className="text-1xl font-ibm-mono font-bold text-sky-100">React Native App</h2>
								<p className="text-zinc-600 pt-4 text-base">
									Developed as part of the CetusPro Academy.
								</p>
							</MiscProjectCard>

							<MiscProjectCard href="https://github.com/blackshibe/luabsge">
								<h1 className="text-2xl font-bold font-ibm-mono">LuaBSGE</h1>
								<h2 className="text-1xl font-ibm-mono font-bold text-sky-100">
									Lua+C rendering engine
								</h2>
								<p className="text-zinc-600 pt-4 text-base">
									Written for fun. Integrates a Lua scripting API with full control over the engine.
								</p>
							</MiscProjectCard>
						</div>
					</div>
					<h1 className="text-2xl p-4 font-bold font-ibm-mono text-zinc-200">My Experience</h1>
					<div className="h-full grid md:flex justify-center">
						<div className="p-4 flex flex-col gap-4 w-full md:w-3/5">
							<ExperienceCard>
								<h1 className="text-2xl font-bold font-ibm-mono">Web Development</h1>
								<h2 className="pt-1 pb-1 font-ibm-mono font-bold text-zinc-600">HTML+CSS since 2020</h2>
								<ul className="p-2 text-zinc-400 text-base leading-7">
									<a
										href="https://github.com/blackshibe/ts-remind-me"
										className="text-zinc-400 text-base underline "
									>
										Reminder app written with Angular
									</a>
									<p>Simple, Sentry inspired error tracker</p>
									<p>Server hosting with Azure & AWS</p>
								</ul>
							</ExperienceCard>

							<ExperienceCard>
								<h1 className="text-2xl font-bold font-ibm-mono">Roblox</h1>
								<h2 className="pt-1 pb-1 font-ibm-mono font-bold text-zinc-600">Luau since 2017</h2>
								<ul className="p-2 text-zinc-400 text-base leading-7">
									<p>
										<a
											href="https://devforum.roblox.com/t/writing-an-fps-framework-2020/503318"
											className="text-zinc-400 text-base underline "
										>
											Popular devforum tutorial about writing an FPS framework
										</a>
									</p>
									<p>
										<a
											href="https://github.com/blackshibe/roblox-server-ray-tracer"
											className="text-zinc-400 text-base underline "
										>
											Custom raytracing algorithm integrated with a flask webserver
										</a>
									</p>

									<p>Long time user of Rojo & Roblox-ts</p>
									<p>Experience with Roact + Rodux</p>
								</ul>
							</ExperienceCard>
						</div>
						<div className="p-4 flex flex-col gap-4 w-full md:w-2/5">
							<ExperienceCard>
								<h1 className="text-2xl font-bold font-ibm-mono">Arduino</h1>
								<h2 className="pt-1 pb-1 font-ibm-mono font-bold text-zinc-600">C++ since 2019</h2>
								<ul className="p-2 text-zinc-600 text-base">
									<p>Soldering, putting together shitty pcb designs</p>
									<p>
										Parsing, sending and rendering .obj meshes to a TFT Display controlled by an
										ESP32
									</p>
									<p>
										DIY RGB strip controller integrated with the adafruit online service for a DIY
										RGB setup
									</p>
								</ul>
							</ExperienceCard>

							<ExperienceCard>
								<h1 className="text-2xl font-bold font-ibm-mono">Unity</h1>
								<ul className="p-2 text-zinc-600 text-base">
									<p>TCP networking from scratch with C# core libraries for tonk-warfare</p>
								</ul>
							</ExperienceCard>

							<ExperienceCard>
								<h1 className="text-2xl font-bold font-ibm-mono">Other</h1>
								<ul className="p-2 text-zinc-600 text-base">
									<p>General experience with Linux</p>
									<p>Viewmodel and cutscene animation in blender</p>
									<p>Basic modelling and PBR texturing skills</p>
								</ul>
							</ExperienceCard>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Site;