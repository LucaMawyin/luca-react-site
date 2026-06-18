export const pages = [
    {title:"home", href:"/", requireLogin : false, mobile : true, show: true },
    { title:"about", href:"/", section : "about", requireLogin : false, show: true },
    { title:"experience", href:"/", section : "experience", requireLogin : false, show: true },
    { title: "tech i use", href:"/", section : "tech", requireLogin : false, show: true },
    { title: "projects", href:"/", section : "projects", requireLogin : false, show: true },
    { title: "resume", href:"/resume", requireLogin : false, newTab : true, show: true },
    { title: "settings", href:"/settings", requireLogin : true, show: true },
    { title: "logout", href: "/logout", requireLogin : true, show: true },
    { title: "edit-tech", href: "/edit-tech", requireLogin : true, show: false },
    { title: "add-project", href: "/add-project", requireLogin : true, show: false },
]

export const icons = [
    { title:"email", href:"mailto:lucamawyin@gmail.com" },
    { title:"github", href:"https://github.com/LucaMawyin" },
    { title: "linkedin", href:"https://www.linkedin.com/in/lucamawyin/" }
]