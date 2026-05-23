export default function Footer(){
    return (
        <footer className="w-full py-10 flex flex-col items-center gap-3 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Luca Mawyin</p>

            <div className="flex gap-4">
                <a href="mailto:you@email.com">Email</a>
                <a href="https://github.com/yourname" target="_blank">GitHub</a>
                <a href="https://linkedin.com/in/yourname" target="_blank">LinkedIn</a>
            </div>
        </footer>
    );
}