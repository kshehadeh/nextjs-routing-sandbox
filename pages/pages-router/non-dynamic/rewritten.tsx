import ShowRouter from "@/components/shared/ShowRouter";
import { PropsWithChildren } from "react";

export default function PageWithDynamicSegment(
    props: PropsWithChildren<{ params: { id: string } }>,
) {
    return <ShowRouter />;
}
