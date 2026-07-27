export default function Footer(){
    return (
        <footer className="w-full py-4 flex flex-col items-center gap-3 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Luca Mawyin</p>

            <div className="flex gap-4">
                <a href="mailto:lucamawyin@gmail.com">Email</a>
                <a href="/resume" target="_blank">Resume</a>
                <a href="https://github.com/LucaMawyin" target="_blank">GitHub</a>
                <a href="https://www.linkedin.com/in/lucamawyin" target="_blank">LinkedIn</a>
            </div>
        </footer>
    );
}