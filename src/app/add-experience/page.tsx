import { getTags } from "@/lib/tags";
import { Tag } from "@/lib/types";
import CreateExperiencePage from "./CreateExperiencePage";

export default async function Page() {
    const tagOptions = await getTags("experience") as Tag[];

    return <CreateExperiencePage tags={tagOptions} />;
}