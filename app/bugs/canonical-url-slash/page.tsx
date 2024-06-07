import { Metadata } from "next"

export function generateMetadata(): Metadata {
    return {
        title: "Dog Breed Viewer",
        // Note that the bug will only happen if the metadataBase is set and if the resolved URL of 
        //  of the page is the same as the metadataBase.  So you can only observe the bug with this
        //  code if running locally.
        metadataBase: new URL("https://localhost:3000"),
        description: "View images of different dog breeds",
        alternates: {			
			canonical: '/p/12345.html',
		}
    }
}

export default function CanonicalUrlBugPage() {
    return <h1>Canonical ends with trailing slash</h1>
}