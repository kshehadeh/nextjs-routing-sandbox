import { Suspense } from "react";
import DogBreedViewerClientComponent from "../components/DogBreedViewer.client";
import { getBreeds } from "../server/breeds";

async function DogBreedViewer() {
    const breeds = await getBreeds(2);
    if (!breeds) {
        return <p>Failed to load breeds</p>;
    }

    return <DogBreedViewerClientComponent breeds={Object.keys(breeds.message)} />;
}
export default async function Page() {    

    return (
        <Suspense fallback={(<p>Loading breeds...</p>)}>
            <DogBreedViewer />
        </Suspense>
    );
}