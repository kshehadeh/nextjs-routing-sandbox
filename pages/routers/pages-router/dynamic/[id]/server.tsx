import ShowPagesRouter from "@/components/shared/ShowPagesRouter";
import { GetServerSidePropsContext } from "next";

export default function PageWithDynamicSegment({ url }: Readonly<{ url: string}>) {
    return <ShowPagesRouter serverUrl={url}/>;
}

export function getServerSideProps(context: GetServerSidePropsContext) {
    return {
        props: {
            url: context.resolvedUrl,
        },
    };
}