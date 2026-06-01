import { Page } from "./types";

// Getting href for links (combines section and href)
export const getHref = (page : Page) => {
    if (page.section) return (page.href + "#" + page.section);
    return page.href;
}