import React from "react";

export default function NavigationHome() {
    return (
    <div className="grid m-10">
        <h1 className="text-xl font-bold border-b-2 border-color-black">Experiments</h1>
        <ul>
            <li><a href="/routers">App and Page Router Experiments</a></li>
            <li><a href="/rendering/with-suspense">Client Component <em>With</em> Suspense Boundary and RSC Wrapper</a></li>
            <li><a href="/rendering/without-suspense">Client Component <em>Without</em> Suspense Boundary and Direct Use of Client Component</a></li>
        </ul>
    </div>
    )
        
}
