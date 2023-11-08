import ShowRouter from "@/components/shared/ShowRouter";
import { GetStaticPropsContext } from "next";
import { PropsWithChildren } from "react";

export default function PageWithDynamicSegment(
    props: PropsWithChildren<{ id: string }>,
) {
    return <ShowRouter />;
}

export function getStaticPaths() {
    return {
        paths: [
            { params: { id: "1" } },
            { params: { id: "2" } },
            { params: { id: "3" } },
        ],
        fallback: false,
    };
}

export function getStaticProps(ctx: GetStaticPropsContext<{ id: string }>) {
    return {
        props: ctx.params,
    };
}
