import { Tree, frameTree } from "@/lib/frame-tree";
import React from "react";

export default function NavigationHome() {
    return (
    <div className="grid m-10">
        <h1 className="text-xl font-bold border-b-2 border-color-black">Experiments</h1>
        <ul>
            <li><a href="/routers">App and Page Router Experiments</a></li>
        </ul>
    </div>
    )
        
}
