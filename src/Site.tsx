import { faDiscord, faGithub, IconDefinition } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import "./index.css";

import snow from "./wallpaper/sky.jpg";

function ProjectCard({ children, href }: React.PropsWithChildren<{ href?: string }>) {
	return (
		<a href={href}>
			<div className="border-zinc-700 bg-zinc-900 rounded border ease-in-out duration-100 hover:shadow-2xl cursor-pointer">
				{children}
			</div>
		</a>
	);
}

function ProjectTags({ children, date }: React.PropsWithChildren<{ date: string }>) {
	return (
		<div className="flex justify-between text-zinc-600 pt-4">
			<div className="text-zinc-600 flex gap-1">{children}</div>
			<div className="flex text-sm align-middle">{date}</div>
		</div>
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

function ExperienceCardWithImage({ children }: React.PropsWithChildren<{}>) {
	return <div className="border-zinc-700 bg-zinc-900 rounded border">{children}</div>;
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
			<a href={href} className="text-2xl font-bold font-ibm-mono ease-in-out duration-100">
				{header}
			</a>
			<h2 className="text-1xl font-ibm-mono font-bold text-blue-400 pb-4">{footer}</h2>
		</>
	);
}

function Site() {
	let banners = [snow];
	let banner = Math.floor(Math.random() * banners.length);

	return (
		<div
			style={{ backgroundImage: `url("${banners[banner]}")` }}
			className="font-sans leading-6 font-poppins text-left text-lg bg-image underline-offset-4"
		>
			<div className="from-zinc-900 bg-gradient-to-t flex justify-between flex-row">
				<div className="card-width flex justify-between flex-col h-screen p-8 md:p-20 text-zinc-200">
					<div />

					<div className="half-transparent rounded-t pd-4 h-auto p-4 md:-4">
						<div className="flex flex-row gap-4">
							<img
								src="fox.webp"
								className="rounded-full shadow-xl hidden sm:block"
								height={90}
								width={90}
							/>
							<div className="flex flex-col justify-center">
								<h1 className="text-4xl md:text-6xl font-bold font-ibm-mono">blackshibe</h1>
								<h2 className="text-1xl font-ibm-mono font-bold text-blue-400">foxes & text editors</h2>
							</div>
						</div>

						<br />

						<div className="text-sm sm:text-base">
							<p>
								Hi! i'm blackshibe. I'm a Polish game developer currently in high school. I mainly code
								nowadays.
							</p>
							<br />
							<p>
								Ever since I was 9, I've been playing with electronics. I started programming in 2017
								and have been busy making games since. I also play guitar now sometimes.
							</p>
							<br />
							<p>
								I'm proficient in Roblox development but have done fullstack web development and low
								level programming before. I work at Game Changer right now, with Deadline as my other
								primary focus.
							</p>
						</div>
					</div>

					<div className="no-print text-left text-white text-1xl gap-1 flex flex-col w-full">
						<SocialIcon icon={faDiscord} text="blackshibe" />
						<SocialIcon link="https://github.com/blackshibe" icon={faGithub} text="blackshibe" />
					</div>

					{/* for printed version */}
					<div className="only-print text-left text-white text-1xl gap-1 flex flex-col w-full">
						<p>Email @ blackshibe@tutanota.com</p>
						<p>Github @ github.com/blackshibe</p>
						<p>Discord @ blackshibe</p>
					</div>
				</div>
			</div>

			{/* 2nd page */}
			<div className="bg-zinc-800 flex flex-col bg-noise justify-center items-center text-white">
				<div className="experience-width gap-8 p-2 md:p-8">
					{/* projects page 1 */}
					<h1 className="no-print text-2xl p-4 font-bold font-ibm-mono text-zinc-200">
						Public stuff I've worked on
					</h1>
					<div className="h-full grid md:flex justify-center">
						<div className="p-4 flex flex-col gap-4 w-full md:w-3/6">
							<ProjectCard href="https://www.roblox.com/games/3837841034/0-21-6-Deadline">
								<img
									src="deadline.png"
									alt="promotional render of an AK74N with the logo of the game overlayed on top"
									className="from-zinc-900 bg-gradient-to-t rounded-t"
								/>
								<div className="p-4">
									<Header header="Deadline" footer="First Person Shooter" />

									<p className="text-zinc-400 text-base">
										Popular First Person Shooter with the most advanced weapon customization in the
										world, with over a thousand unique weapon parts available in-game.
									</p>

									<ul className="text-zinc-500 text-base list-disc list-inside pt-4">
										<li>AWS-hosted website with backend for ingame and discord integration</li>
										<li>Roact & Rodux (similiar to React & Redux) for state management</li>
										<li>
											Custom character controller with from-scratch netcode including a rollback
											buffer
										</li>
										<li>
											Completely custom open-source animation engine with layering and rebasing
										</li>
										<li>
											Procedural third person player animation with footplanting and inverse
											kinematics
										</li>
										<li>
											An integrated custom scripting language written in collaboration with{" "}
											<a
												href="http://github.com/phunanon"
												className="text-blue-400 text-underline"
											>
												phunanon
											</a>{" "}
											for modding the game
										</li>
									</ul>

									<ProjectTags date="2019 - Ongoing">
										<i className="devicon-lua-plain"></i>
										<i className="devicon-typescript-plain"></i>
									</ProjectTags>
								</div>
							</ProjectCard>
							<MiscProjectCard href="https://blackshibe.github.io/canim">
								<h1 className="text-2xl font-bold font-ibm-mono">Canim</h1>
								<h2 className="text-1xl font-ibm-mono font-bold text-blue-400">
									Open-source Animation library
								</h2>

								<p className="text-zinc-600 pt-2 text-base">
									Public Roblox animation library used in Deadline.
								</p>

								<ProjectTags date="2022">
									<i className="devicon-typescript-plain"></i>
								</ProjectTags>
							</MiscProjectCard>
						</div>
						<div className="p-4 flex flex-col w-full md:w-3/6 gap-4">
							<ProjectCard href="https://www.game-changer.pl/">
								<img
									src="gamechangeragency_cover.jpg"
									alt="GameChanger logo"
									className="from-zinc-900 bg-gradient-to-t rounded-t"
								/>
								<div className="p-4">
									<Header header="Game Changer" footer="Game Development & Marketing" />

									<p className="text-zinc-400 text-base">
										I was hired to work on fixing and developing Roblox games for clients under Game
										Changer in December 2023.
									</p>

									<ul className="text-zinc-500 text-base list-disc list-inside pt-4">
										<li>ING Bank Polska - minor work</li>
										<li>
											Samsung - ReactLua & Reflex powered player-customizable station and a fake
											declaratively programmed samsung phone interface with pretty looking
											animations, along with general bugfixing and optimization work
										</li>
									</ul>

									<ProjectTags date="2023-2024">
										<i className="devicon-lua-plain"></i>
									</ProjectTags>
								</div>
							</ProjectCard>
							<ProjectCard href="https://cetuspro.com/en">
								<img
									src="logo-dark.jpg"
									alt="CetusPro logo"
									className="from-zinc-900 bg-gradient-to-t rounded-t"
								/>
								<div className="p-4">
									<Header header="CetusPro" footer="Software & Technology" />

									<p className="text-zinc-400 text-base">
										I got an internship at CetusPro as part of the CetusPro Academy. I worked on
										React websites during my time there.
									</p>

									<ul className="text-zinc-500 text-base list-disc list-inside pt-4">
										<li>
											<a
												href="https://github.com/blackshibe/remind-me-notes"
												className="text-zinc-500 text-base underline "
											>
												Academy project: Remind Me Notes
											</a>
										</li>
										<li>Internship (Jan 2023 - March 2023)</li>
									</ul>

									<ProjectTags date="2023">
										<i className="devicon-typescript-plain"></i>
									</ProjectTags>
								</div>
							</ProjectCard>
						</div>
					</div>
					<h1 className="no-print text-2xl p-4 font-bold font-ibm-mono text-zinc-200">Other stuff I did</h1>
					<div className="h-full grid md:flex justify-center">
						<div className="p-4 flex flex-col gap-4 w-full md:w-2/4">
							<ProjectCard href="https://black-shibe.itch.io/shroom-rampage">
								<img
									src="jam.png"
									alt="UMP-45 with a camo"
									className="from-zinc-900 bg-gradient-to-t rounded-t"
								/>
								<div className="p-4">
									<Header header="Shroompage" footer="Godot Game Jam game" />

									<p className="text-zinc-400 text-base">
										72 hour game jam I was invited to. I was involved in:
									</p>

									<ul className="text-zinc-500 text-base list-disc list-inside pt-4">
										<li>
											Game design - I designed a forest level without prior experience with Godot
										</li>
										<li>Some of the models, made with Blender and Substance Painter</li>
										<li>
											All of the music (Composed in FL studio & partially recorded with a guitar)
										</li>
									</ul>

									<ProjectTags date="2023">
										<i className="devicon-godot-plain"></i>
										<i className="devicon-csharp-plain"></i>
									</ProjectTags>
								</div>
							</ProjectCard>

							<MiscProjectCard href="https://github.com/blackshibe/luabsge">
								<h1 className="text-2xl font-bold font-ibm-mono">LuaBSGE</h1>
								<h2 className="text-1xl font-ibm-mono font-bold text-blue-400">
									Lua+C rendering engine
								</h2>

								<p className="text-zinc-600 pt-2 text-base">
									Attempt at an OpenGL+Lua game engine. Integrates a Lua scripting API without any
									high-level libraries for making that more convenient. I'd like to learn C++ better
									someday.
								</p>

								<ProjectTags date="2022">
									<i className="devicon-c-plain"></i>
									<i className="devicon-lua-plain"></i>
									<i className="devicon-opengl-plain"></i>
								</ProjectTags>
							</MiscProjectCard>

							<ExperienceCard>
								<h1 className="text-2xl font-bold font-ibm-mono">Arduino</h1>
								<h2 className="pt-1 pb-1 font-ibm-mono font-bold text-zinc-600">C++ since 2019</h2>
								<ul className="text-zinc-500 text-base list-disc list-inside pt-4">
									<li>Soldering, putting together shitty pcb designs</li>
									<li>
										Parsing, sending and rendering .obj meshes to a TFT Display controlled by an
										ESP32
									</li>
									<li>
										a DIY RGB light setup for my PC integrating a light strip and the adafruit
										online service
									</li>
								</ul>

								<div className="pt-2 text-zinc-400 text-base">
									<ProjectTags date="">
										<i className="devicon-arduino-plain"></i>
										<i className="devicon-cplusplus-plain"></i>
										<i className="devicon-python-plain"></i>
									</ProjectTags>
								</div>
							</ExperienceCard>
						</div>
						<div className="p-4 flex flex-col gap-4 w-full md:w-2/4">
							<ExperienceCard>
								<h1 className="text-2xl font-bold font-ibm-mono">Web Development</h1>
								<h2 className="pt-1 pb-1 font-ibm-mono font-bold text-zinc-600">
									HTML+CSS & various web frameworks
								</h2>
								<div className="pt-2 text-zinc-400 text-base leading-7">
									<a
										href="https://github.com/blackshibe/ts-remind-me"
										className="text-zinc-400 text-base underline "
									>
										Reminder app written with Angular
									</a>
									<p>Simple, Sentry inspired error tracker</p>
									<p>Server hosting & upkeep with Azure & AWS for Deadline</p>

									<ProjectTags date="">
										<i className="devicon-typescript-plain"></i>
									</ProjectTags>
								</div>
							</ExperienceCard>

							<ExperienceCard>
								<h1 className="text-2xl font-bold font-ibm-mono">Roblox</h1>
								<h2 className="pt-1 pb-1 font-ibm-mono font-bold text-zinc-600">Luau since 2017</h2>
								<div className="pt-2 text-zinc-400 text-base leading-7">
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

									<ProjectTags date="">
										<i className="devicon-lua-plain"></i>
										<i className="devicon-python-plain"></i>
									</ProjectTags>
								</div>
							</ExperienceCard>

							<ExperienceCard>
								<h1 className="text-2xl font-bold font-ibm-mono">Unity</h1>
								<ul className="pt-2  text-zinc-600 text-base">
									<p>TCP networking from scratch with C# core libraries for tonk-warfare</p>
								</ul>
							</ExperienceCard>

							<ExperienceCard>
								<h1 className="text-2xl font-bold font-ibm-mono">Other</h1>
								<ul className="pt-2 text-zinc-600 text-base">
									<p>General experience with Git & Github CI pipelines</p>
									<p>Occasional experience with Mariadb & MySQL</p>
									<p>General experience with Linux for server hosting and personal use</p>
									<p>Basics of self-compiling Android, TWRP device recovery bringup</p>
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
