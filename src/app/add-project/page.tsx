import { getTags } from "@/lib/tags";
import CreateProjectPage from "./CreateProjectPage";

export default async function Page() {
    const tagOptions = await getTags();

    return <CreateProjectPage tags={tagOptions} />;
}