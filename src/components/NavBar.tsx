import { CapitalizeTitle } from "@/lib/CapitalizeTitle";
import { pages } from "@/lib/pages";

export default function NavBar(props : {visible : boolean}){
    return (
        <div className={`
                bg-(--primary-colour)
                h-[10vh]
                fixed top-0 z-50
                w-full 
                flex items-center
                shadow-sm

                transition-all duration-150 ease-out
                ${props.visible 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 -translate-y-4 pointer-events-none"
                }
        `}>
            <div className="
                m-8
                flex gap-8
            ">  
                <a
                    href="/"
                    className="
                        transition-transform duration-(--transition-duration)
                        hover:scale-110
                    "
                >
                    Luca Mawyin
                </a>
                {pages.map((page) => (
                    <a
                        key={page.title}
                        href={page.href}
                        className="
                            transition-transform duration-(--transition-duration)
                            hover:scale-110
                        "
                    >
                        {CapitalizeTitle(page.title)}
                    </a>
                ))}
            </div>
        </div>
    );
}