

export async function getBreeds(secondsToReturn: number = 0) {

    const response = await fetch("https://dog.ceo/api/breeds/list/all")

    if (secondsToReturn > 0) {
        await new Promise((resolve) => setTimeout(resolve, secondsToReturn*1000));
    }

    if (!response.ok) {
        return undefined
    }

    const breeds = await response.json();   
    if (!breeds.message) {
        return undefined
    }

    return breeds;
}