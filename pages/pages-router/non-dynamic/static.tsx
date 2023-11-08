import ShowRouter from "@/components/shared/ShowRouter";

export default function PageWithDynamicSegment() {
    return <ShowRouter />
}

export function getStaticProps() {
    return {
        props: {}
    };
}