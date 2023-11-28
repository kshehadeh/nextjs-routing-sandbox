
export interface Tree {
    [key: string]: Tree | string;
}

export const frameTree = {
    "Pages Router": {
        "Non-Dynamic": {
            Direct: {
                Client: "/routers/pages-router/non-dynamic/client",
                Static: "/routers/pages-router/non-dynamic/static",
                Server: "/routers/pages-router/non-dynamic/server",
            },
            Rewritten: {
                Client: "/routers/pages-router/rewritten/non-dynamic/client",
                Static: "/routers/pages-router/rewritten/non-dynamic/static",
                Server: "/routers/pages-router/rewritten/non-dynamic/server",
            },
        },
        Dynamic: {
            Direct: {
                Client: "/routers/pages-router/dynamic/1/client",
                Static: "/routers/pages-router/dynamic/1/static",
                Server: "/routers/pages-router/dynamic/1/server",
            },
            Rewritten: {
                Client: "/routers/pages-router/rewritten/dynamic/1/client",
                Static: "/routers/pages-router/rewritten/dynamic/1/static",
                Server: "/routers/pages-router/rewritten/dynamic/1/server",
            },
        },
    },
    "App Router": {
        "Non-Dynamic": {
            Direct: {
                Client: "/routers/app-router/non-dynamic/client",
                Static: "/routers/app-router/non-dynamic/server",
            },
            Rewritten: {
                Client: "/routers/app-router/rewritten/non-dynamic/client",
                Static: "/routers/app-router/rewritten/non-dynamic/server",
            },
        },
        Dynamic: {
            Direct: {
                Client: "/routers/app-router/dynamic/1/client",
                Static: "/routers/app-router/dynamic/1/server",
            },
            Rewritten: {
                Client: "/routers/app-router/rewritten/dynamic/1/client",
                Static: "/routers/app-router/rewritten/dynamic/1/server",
            },
        },
    },
} satisfies Tree;