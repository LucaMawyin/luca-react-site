import { getTags } from "@/lib/tags";
import CreateProjectPage from "./CreateProjectPage";
import { Tag } from "@/lib/types";

export default async function Page() {
    const tagOptions = await getTags("project") as Tag[];

    return <CreateProjectPage tags={tagOptions} />;
}