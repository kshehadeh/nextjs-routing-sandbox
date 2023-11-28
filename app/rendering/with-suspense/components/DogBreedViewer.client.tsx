/* eslint-disable @next/next/no-img-element */
"use client"

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function DogBreedViewerClientComponent({
    breeds,
}: Readonly<{
    breeds: string[];
}>) {
    const params = useSearchParams()
        
    const [breedImage, setBreedImage] = useState<string>();
    const [selectedBreed, setSelectedBreed] = useState<string|null>(params?.has("breed") ? params.get("breed") : "");

    function onBreedChanged(event: React.ChangeEvent<HTMLSelectElement>) {
        const breed = event.target.value;
        setSelectedBreed(breed)
        fetch(`https://dog.ceo/api/breed/${breed}/images/random`)
            .then((response) => response.json())
            .then((data) => {
                setBreedImage(data.message);
            });
    }

    return (
        <div>
            <h1 className="text-xl">Dog Breed Viewer</h1>
            <select onChange={onBreedChanged} className="bg-gray-50 border border-gray-300 p-2">
                {!selectedBreed && <option key={"none"}>Select a breed</option>}
                {breeds.map((breed) => (
                    <option key={breed} selected={selectedBreed===breed}>{breed}</option>
                ))}
            </select>

            {breedImage && <img src={breedImage} alt="Dog" />}
            {!breedImage && <p>Select a breed to see an image</p>}
        </div>
    );
}
