"use client";

import NavBar from "@/components/NavBar";
import { CapitalizeTitle } from "@/lib/CapitalizeTitle";
import { pages } from "@/lib/pages"; 
import { useEffect, useState } from "react";

export default function Home(){

	const [loaded, setLoaded] = useState(false);
	const [showNav, setShowNav] = useState(false);

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

	return (
		<>
			<NavBar visible={showNav}/>
			<section 
				id="hero"
				className="
					h-full 
					w-full
					flex justify-center items-center
					clamp(1rem, 2vw, 2rem)
			">
				<div className="w-fit">
					<h1 
						className={`
							mb-2
							sm:mb-0
							text-[clamp(3rem,5vw,5rem)]
							font-[650]
							transition-all duration-700 ease-out
							${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
					`}>
						Luca Mawyin
					</h1>
					<div className="
						flex flex-col
						w-fit
						text-xl
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
									transitionDelay: `${(index+1) * 300}ms`
								}}
							>
								{`/${CapitalizeTitle(page.title)}`}
							</a>
						))}				
					</div>

				</div>
			</section>

			<section 
				id="about"
				className="
					h-[90vh]
				"
			>
				<div>ABOUT ME</div>
			</section>	

			<section 
				id="projects"
				className="h-full"
			>
				<div>Projects</div>
			</section>		
		</>

	);

}