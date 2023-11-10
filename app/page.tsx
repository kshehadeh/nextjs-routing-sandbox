import React from "react";

const HEIGHT = "350px";

const frameTree = {
    "Pages Router": {
        "Non-Dynamic": {
            Direct: {
                Client: "/pages-router/non-dynamic/client",
                Static: "/pages-router/non-dynamic/static",
            },
            Rewritten: {
                Client: "/pages-router/rewritten/non-dynamic/client",
                Server: "/pages-router/rewritten/non-dynamic/static",
            },
        },
        Dynamic: {
            Direct: {
                Client: "/pages-router/dynamic/1/client",
                Static: "/pages-router/dynamic/1/static",
            },
            Rewritten: {
                Client: "/pages-router/rewritten/dynamic/1/client",
                Server: "/pages-router/rewritten/dynamic/1/static",
            },
        },
    },
    "App Router": {
        "Non-Dynamic": {
            Direct: {
                Server: "/app-router/non-dynamic/server",
            },
            Rewritten: {
                Server: "/app-router/rewritten/non-dynamic/server",
            },
        },
        Dynamic: {
            Direct: {
                Server: "/app-router/dynamic/1/server",
            },
            Rewritten: {
                Server: "/app-router/rewritten/dynamic/1/server",
            },
        },
    },
} satisfies Tree;

interface Tree {
    [key: string]: Tree | string;
}

function getPages(tree: Tree, level = 0): React.ReactNode[] {
    let pages: React.ReactNode[] = [];
    for (const [key, value] of Object.entries(tree)) {
        if (typeof value === "object") {
            const header =
                level === 0 ? (
                    <h2 className="text-xl font-bold border-b-2 border-color-black">{key}</h2>
                ) : level === 1 ? (
                    <h3  className="text-lg font-bold p-2 bg-gray-100">{key}</h3>
                ) : (
                    <h4 className="text-base font-bold">{key}</h4>
                );
            const container = (
                <div
                    key={key}
                    className={`p-3 m-3 ${level > 1 ? "border-2" : ""} border-color-gray-100`}
                >
                    {header}
                    <div className="grid grid-flow-col auto-cols-max">{...getPages(value, level + 1)}</div>
                </div>
            );
            pages.push(container);
        } else {
            pages.push(
                <div>
                  <h4>{key}</h4>
                  <iframe src={value} height={HEIGHT} className="bg-white" />,
                </div>
                
            );
        }
    }
    return pages;
}

export default function NavigationHome() {
    return <div className="grid">{getPages(frameTree)}</div>;
}
