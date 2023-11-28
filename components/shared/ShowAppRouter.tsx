"use client";
import { useParams, usePathname, useSearchParams } from "next/navigation";

export default function ShowAppRouter() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const params = useParams()

    if (!pathname) {
        return <div>Populating navigation info...</div>
    }

    return (
    
        <div>
            <div>
                <h1 className="p-3 text-base font-bold bg-blue">{pathname}</h1>
                <dl className="p-5 text-sm bg-white">
                    <dt className="font-bold">useParams</dt>
                    <dd>{JSON.stringify(params)}</dd>
                    <dt className="font-bold">useSearchParams</dt>
                    <dd>{searchParams?.toString()}</dd>
                </dl>
            </div>
        </div>
    );
}
