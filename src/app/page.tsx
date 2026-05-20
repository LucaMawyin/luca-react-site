"use client";

import NavBar from "@/components/NavBar";
import { CapitalizeTitle } from "@/lib/CapitalizeTitle";
import { icons, pages } from "@/lib/info"; 
import { useEffect, useState } from "react";

export default function Home(){

	const [loaded, setLoaded] = useState(false);
	const [showNav, setShowNav] = useState(false);
	const [showArrow, setShowArrow] = useState(false);

	useEffect(() => {
		setLoaded(true);
	}, []);

	// Changing url path & showing nav dynamically on home page
	useEffect(() => {
		const sections = Array.from(document.querySelectorAll<HTMLElement>("section[id]"));

		if (!sections.length) return;

		const observer = new IntersectionObserver(() => {

				let bestSection: HTMLElement | null = null;
				let bestRatio = 0;

				// Detect which section is most present on screen
				for (const section of sections) {
					const rect = section.getBoundingClientRect();

					const height = window.innerHeight;
					const visibleHeight =
						Math.min(rect.bottom, height) - Math.max(rect.top, 0);

					const ratio = Math.max(0, visibleHeight / height);

					if (ratio > bestRatio) {
						bestRatio = ratio;
						bestSection = section;
					}
				}

				// Change state to id unless it's hero
				if (bestSection?.id && bestRatio > 0.4 && bestSection?.id !== "hero") {
					window.history.replaceState(null, "", `#${bestSection.id}`);
					setShowNav(true);
					setShowArrow(false);
				} else {
					window.history.replaceState(null, "", "/");
					setShowNav(false);
				}
			},
			{
				threshold: [0, 0.1, 0.5, 1],
			}
		);

		sections.forEach((section) => observer.observe(section));

		return () => observer.disconnect();
	}, []);

	useEffect(() => {
	const onScroll = () => {
		setShowArrow(window.scrollY < 50);
	};

	window.addEventListener("scroll", onScroll);
	return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<>
			<NavBar visible={showNav}/>

			{/* Hero */}
			<section 
				id="hero"
				className="
					min-h-full
					w-full
					flex justify-center items-center
			">
				<div className="w-fit">

					{/* Icon Row on hero */}
					<div className="flex flex-row gap-6">
						{icons.map((icon) => (
							<a
								key={icon.title}
								href={icon.href}
								target="_blank"
								className={`
									flex items-center justify-center
									transition-all duration-(--transition-duration) ease-out

									hover:scale-(--link-scale)

									${loaded 
										? "opacity-100 translate-y-0" 
										: "opacity-0 translate-y-4"
									}
								`}
							>
								<img
									src={`/icons/${icon.title}.svg`}
									className="h-[clamp(3rem,5vw,4rem)]"
								/>
							</a>
						))}
					</div>

					{/* Hero name */}
					<h1 
						className={`
							mb-2
							sm:mb-0
							transition-all duration-700 ease-out
							${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
					`}>
						Luca Mawyin
					</h1>

					{/* Hero links */}
					<div className="
						flex flex-col
						w-fit
						text-2xl
					">
						{pages.map((page, index) => (
							<a
								key={page.title}
								href={page.href}
								target={page.href.endsWith(".pdf") ? "_blank" : undefined}
								className={`
									relative w-fit
									ml-0
									m-4
									sm:m-4
									sm:ml-0

									after:content-['']
									after:absolute after:left-0 after:bottom-0
									after:h-0.5 after:w-full
									after:scale-x-0
									after:origin-left
									after:bg-black
									after:transition-transform
									after:duration-300

									hover:after:scale-x-100
									transition-all duration-500 ease-out
									${loaded 
										? "opacity-100 translate-y-0" 
										: "opacity-0 translate-y-4"
									}
								`}
								style={{
									transitionDelay: `${(index+1) * 200}ms`
								}}
							>
								{`${CapitalizeTitle(page.title)}`}
							</a>
						))}				
					</div>

				</div>

				<a href="#about" className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 animate-arrow-entry">
					<div className="animate-bounce-slow">
						<svg
							className="w-6 h-6 text-black"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</div>
				</a>
			</section>

			{/* About me */}
			<section id="about" >
				<div className="
					w-full
					min-h-[90vh]
					flex flex-wrap-reverse
					p-[15%]
					sm:p-[10%]
					justify-between
				">
					<div className="
						basis-full
						w-full lg:basis-1/2
						text-center sm:text-left
					">
						<h1 className="py-2">About Me</h1>
						<p className="mb-8">Hi, my name is Luca Mawyin. I am currently a second year Computer Science student at McMaster University. I enjoy creating full stack web applications, with a focus on clean responsive UI, and seamless backend integration. Other areas of interest include algorithm design and machine learning.</p>
						<p>I am interested in sports, especially hockey, listening to and writing music, and researching and learning about human anatomy and physiology. I love meeting new people and trying to make a meaningful positive impact on the world.</p>
					</div>

					<div className="
						overflow-hidden
						basis-full lg:basis-1/4
						flex justify-center lg:justify-end
						rounded-2xl
					">
					<img
						src="/images/headshot.png"
						className="w-full h-auto object-contain"

					/>
					</div>					
				</div>

			</section>	

			{/* Projects */}
			<section id="projects">
				<div
					className="min-h-[90vh]"
				>Projects

				</div>
			</section>		
		</>

	);

}