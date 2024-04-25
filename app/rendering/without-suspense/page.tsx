import DogBreedViewerClientComponent from "../components/DogBreedViewer.client";
import { getBreeds } from "../server/breeds";

export default async function Page() {
    const breeds = await getBreeds();
    if (!breeds) {
        return <p>Failed to load breeds</p>;
    }
    return (<DogBreedViewerClientComponent breeds={Object.keys(breeds.message)} />);
}