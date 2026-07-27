import { getTags } from "@/lib/tags";
import CreateProjectPage from "./CreateProjectPage";
import { Tag } from "@/lib/types";
import { headers } from "next/headers";

export default async function Page() {
    const tagOptions = await getTags("project") as Tag[];

    const headersList = await headers();
    const referrer = headersList.get("referer")
        ? new URL(headersList.get("referer")!).pathname
        : "/";

    return (
        <CreateProjectPage 
            tags={tagOptions} 
            referrer={referrer}
        />
    );
}