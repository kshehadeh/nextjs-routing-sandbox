import { Suspense } from "react";
import DogBreedViewerClientComponent from "./components/DogBreedViewer.client";


export default async function WithSuspenseServerComponent() {    
    
    const response = await fetch("https://dog.ceo/api/breeds/list/all")

    if (!response.ok) {
        return <p>Failed to load breeds</p>;
    }

    const breeds = await response.json();    
    if (!breeds.message) {
        return <p>Failed to load breeds</p>;
    }

    return (
        <Suspense fallback={(<p>Loading breeds...</p>)}>
            <DogBreedViewerClientComponent breeds={Object.keys(breeds.message)} />
        </Suspense>
    );
}