"use client";
import useNavigation from "@/shared/useNavigation";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

export default function ShowRouter() {
    const pathname = usePathname()
    const routeInfo = useNavigation();

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div>
                <div>
                    <h1 className="p-3 text-base font-bold bg-gray">{pathname}</h1>
                    <dl className="p-5 text-sm bg-white">
                        <dt className="font-bold">Is App Router</dt>
                        <dd>{routeInfo.isAppRoute ? "Yes" : "No"}</dd>

                        <dt className="font-bold">router.pathname</dt>
                        <dd>{routeInfo.pathname}</dd>
                        <dt className="font-bold">router.query</dt>
                        <dd>{JSON.stringify(routeInfo.query)}</dd>
                        <dt className="font-bold">router.asPath</dt>
                        <dd>{routeInfo.asPath}</dd>
                        <dt className="font-bold">Dynamic Segments</dt>
                        <dd>{JSON.stringify(routeInfo.dynamicSegments)}</dd>
                        <dt className="font-bold">User Facing Full Path</dt>
                        <dd>{routeInfo.getUserFacingAsPath()}</dd>
                    </dl>
                </div>
            </div>
        </Suspense>
    );
}
