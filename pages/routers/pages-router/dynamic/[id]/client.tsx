import ShowPagesRouter from "@/components/shared/ShowPagesRouter";
import { PropsWithChildren } from "react";

export default function PageWithDynamicSegment(
    props: PropsWithChildren<{ params: { id: string } }>,
) {
    return <ShowPagesRouter />;
}
