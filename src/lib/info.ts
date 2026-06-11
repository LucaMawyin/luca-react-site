export const pages = [
    {title:"home", href:"/", requireLogin : false, mobile : true},
    { title:"about", href:"/", section : "about", requireLogin : false },
    { title: "projects", href:"/", section : "projects", requireLogin : false },
    { title: "Tech I Use", href:"/", section : "tech", requireLogin : false },
    { title: "resume", href:"/resume", requireLogin : false, newTab : true },
    { title: "settings", href:"/settings", requireLogin : true },
    { title: "logout", href: "/logout", requireLogin : true },
]

export const icons = [
    { title:"email", href:"mailto:lucamawyin@gmail.com" },
    { title:"github", href:"https://github.com/LucaMawyin" },
    { title: "linkedin", href:"https://www.linkedin.com/in/lucamawyin/" }
]