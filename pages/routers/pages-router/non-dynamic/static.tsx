import ShowPagesRouter from "@/components/shared/ShowPagesRouter";
import { GetStaticPropsContext } from "next";

export default function PageWithDynamicSegment() {
    return <ShowPagesRouter />;
}

export function getStaticProps(context: GetStaticPropsContext<{path: string}>) {
    return {
        props: {},
    };
}