"use client";

import { useRouter } from "next/router";
import React from "react";

export default function ShowPagesRouter({ serverUrl }: Readonly<{ serverUrl?: string}>) {
    const routeInfo = useRouter();

    const [clientUrl, setClientUrl] = React.useState<string>();

    React.useEffect(() => {
        setClientUrl(routeInfo.asPath);
    }, []);

    const serverRenderedPath = serverUrl ?? "[Client rendered]";

    if (!routeInfo) {
        return <div>Populating navigation info...</div>
    }

    return (
    
        <div>
            <div>
                <h1 className="p-3 text-base font-bold bg-gray">{clientUrl}</h1>
                <dl className="p-5 text-sm bg-white">
                    <dt className="font-bold">Server Rendered Path</dt>
                    <dd>{serverRenderedPath}</dd>
                    <dt className="font-bold">router.pathname</dt>
                    <dd>{routeInfo.pathname}</dd>
                    <dt className="font-bold">router.query</dt>
                    <dd>{JSON.stringify(routeInfo.query)}</dd>
                </dl>
            </div>
        </div>
    );
}
