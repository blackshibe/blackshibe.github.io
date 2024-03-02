import { faDiscord, faGithub, IconDefinition } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import "./index.css";

import snow from "./wallpaper/wallpaper_02.jpg";

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
				<div className="card-width flex justify-between flex-col h-screen p-8 md:p-20 text-zinc-200"></div>
			</div>
			<div className="min-h-screen flex items-center p-40 bg-zinc-900 text-zinc-200">
				<p>everything good ends eventually.</p>
			</div>
		</div>
	);
}

export default Site;
