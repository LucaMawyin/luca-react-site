import { getTags } from "@/lib/tags";
import { Tag } from "@/lib/types";
import CreateExperiencePage from "./CreateExperiencePage";
import { headers } from "next/headers";

export default async function Page() {
    const tagOptions = await getTags("experience") as Tag[];
    const headersList = await headers();
    const referrer = headersList.get("referer")
        ? new URL(headersList.get("referer")!).pathname
        : null;

    return (
        <CreateExperiencePage 
            tags={tagOptions} 
            referrer={referrer}
        />
    );
}