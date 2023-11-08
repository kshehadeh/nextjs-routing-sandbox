import { useRouter as usePagesRouter } from "next/compat/router";
import { NextRouter } from "next/router";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import querystring, { ParsedUrlQuery } from "querystring";
import {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import type { MittEmitter } from "next/dist/shared/lib/mitt";
import mitt from "next/dist/shared/lib/mitt";
import {
    AppRouterContext,
    AppRouterInstance,
} from "next/dist/shared/lib/app-router-context.shared-runtime";

type RouteChangeEvents = readonly ["routeChanged"];
type RouteChangeEventType = RouteChangeEvents[number];

function extractVariablesFromUrl(
    template: string,
    url: string,
): Record<string, string> {
    // Find all the placeholders in the template
    const placeholders = template.match(/\[([^\]]+)\]/g);

    if (!placeholders) {
        return {}
    }

    // Create a regex pattern based on the template
    let regexPattern = template;
    placeholders.forEach((ph) => {
        regexPattern = regexPattern.replace(ph, "([^/]+)");
    });
    const regex = new RegExp(`^${regexPattern}$`);

    // Match the url with the regex pattern
    const match = url.match(regex);

    // If no match is found, return an empty object
    if (!match) {
        return {};
    }

    // Construct the result object
    const result: Record<string, string> = {};
    placeholders.forEach((ph, index) => {
        const key = ph.replace(/[\[\]]/g, ""); // Remove the brackets
        result[key] = match[index + 1];
    });

    return result;
}

export interface NavigationObject {
    /**
     * This will include the path and the query string (if it exists)
     * Backward compatibility with asPath as described here https://nextjs.org/docs/pages/api-reference/functions/use-router#router-object
     */
    asPath: string | null | undefined;

    /** This is true if the route was initiated from the /pages directory */
    isPagesRoute: boolean;

    /** This is true if the route was initiated from the /apps directory */
    isAppRoute: boolean;

    /** This is true if the URL bar is showing a different URL than the URL being processed */
    isRewrittenUrl: boolean;

    /** This is the app router object and will be set even if the isPagesRoute is true */
    appRouter: AppRouterInstance | null;

    /** This is the app router object and will be empty if the isPagesRoute is false */
    pagesRouter: NextRouter | null;

    /** In the pages router, this will be the pre-interpolated version of the url (e.g. /route/[id])
     *  In the app router, this will be the post-interpolated version of the url (e.g. /route/123)
     */
    pathname: string | null;

    /** This contains an object with a key for each dynamic segment variable.
     *  For example, if the route is /route/[id]/[name], this will be { id: '123', name: 'foo' }
     * 	If the route is /route/[id]/[name]?id=456, this will be { id: '456', name: 'foo' }
     *  If the route is not dynamic then this will be an empty object
     */
    dynamicSegments: ParsedUrlQuery | null;

    /** This is the query string as a ParsedUrlQuery which is a PJO */
    queryAsParsedUrlQuery?: ParsedUrlQuery | null;

    /** Backward compatibility with query as described here https://nextjs.org/docs/pages/api-reference/functions/use-router#router-object */
    query: ParsedUrlQuery | null;

    /** This is the query string as a URLSearchParams object */
    queryAsUrlSearchParams: URLSearchParams | null;

    /** If the URL is different than the internally path then this is likely a rewrite done.
     * If not, this will be undefined.    For example, if the window.location is /route/123?foo=bar
     * and the internal path is /route/foo=bar/123 then this will be /route/123?foo=bar
     */
    userFacingPath: string | null;

    /** If the URL is different than the internally path then this is likely a rewrite done.
     * If not, this will be undefined.    For example, if the window.location is /route/123?foo=bar
     * and the internal path is /route/foo=bar/123 then this will be foo=bar
     */
    userFacingQueryParams: string | null;

    /**
     * This will push a new URL onto the history stack.  It handles switching between page and app router.
     */
    push: (url: string) => void;

    /**
     * This will replace the URL on the history stack.  It handles switching between page and app router.
     */
    replace: (url: string) => void;

    /**
     * This will always return the user facing path.  If the URL is not rewritten then it will return the same
     * value as the asPath property.  If the URL is rewritten then it will return the value of the URL bar.
     */
    getUserFacingAsPath: () => string | null | undefined;
}

/**
 * This hook is meant to act as a drop-in replacement for useRouter on both app and pages router.
 * Unfortunately, they act pretty differently.  Here are some of the main differences:
 *
 * 	- pathname: On pages, this will return the name of the path as it appears inside the `pages` directory, but on the app
 * 				router this will return the value of `usePathname` which is actually the path as it appears to the browser.
 * @returns
 */
export default function useNavigation(): NavigationObject {
    const pagesRouter = usePagesRouter();
    const appRouter = useContext(AppRouterContext);
    const appRouterDynamicSegments = useParams();
    const events = useRef<MittEmitter<RouteChangeEventType>>(mitt());
    const isPagesRoute = useMemo(() => !!pagesRouter, [pagesRouter]);
    const isAppRoute = useMemo(() => !isPagesRoute, [isPagesRoute]);

    // This works with both app router and pages router  but will be undefined if the pages route isn't "ready"
    const readonlySearchParams = useSearchParams();

    // This works with both app router and pages router  but will be undefined if the pages route isn't "ready"
    //	Unfortunately, the pathname referred to here is different than the pathname property on the router object.
    //	This is because the router object's pathname is the pre-interpolated version of the path.  This is the
    //	post-interpolated version of the path.  For example, if the path is /route/[id]/[name] and the URL is
    //	/route/123/foo then the router object's pathname will be /route/[id]/[name] and this pathname will be
    //	/route/123/foo.
    const appRouterPathname = usePathname() || null;
    const pagesRouterPathname = pagesRouter?.pathname || null;

    const pathname = isPagesRoute ? pagesRouterPathname : appRouterPathname;
    const asPath = isPagesRoute ? pagesRouter?.asPath : appRouterPathname;

    // This block will prepare the query and dynamic segment parameters.  Note that this will handle differentiate
    //	the dynamic segments from query parameters.  It will also identify the searchParams segment and merge it
    //	with the query parameters (UA-specific)
    const [queryAsUrlSearchParams, queryAsParsedUrlQuery, dynamicSegments] =
        useMemo(() => {
            let dynamicSegments: ParsedUrlQuery;
            let parsedQuery;

            // The query property is meant to be a backward compatibility shim for the queryAsParsedUrlQuery property.  Note
            //	that it can never be undefined or null so we need to default it to an empty object.  There are a couple of differences
            //	as well.  We will remove the dynamic segments from the query object and put them in the dynamicSegments object.
            //	Also, we will add the searchParams to the query object.  This last is a special UA-only feature that allows us to
            //	embed query parameters in the path.  This is used for product list and product detail pages so that we can cache
            //	them in the CDN.
            if (pagesRouter) {
                parsedQuery = pagesRouter.query;
            } else if (readonlySearchParams) {
                parsedQuery = querystring.parse(
                    readonlySearchParams.toString(),
                );
            } else {
                parsedQuery = {};
            }

            // The dynamic segments are only easily available on the app router.  On the the pages router, they are merged
			//	with the query parameters or not available at all.  So we need to extract them from the URL.
            if (pagesRouter?.pathname) {
				dynamicSegments = extractVariablesFromUrl(pagesRouter.pathname, pagesRouter.asPath.split("?")[0])

				for (const key of Object.keys(dynamicSegments)) {
					delete parsedQuery[key];
                } 
            } else {
                dynamicSegments = appRouterDynamicSegments || {};
            }

            // The `searchParams` name is a convention used by UA pages to pass query parameters which impact the rendering
            //	of the page in the browser. For example, if you have a path like this: /route/[searchParams]/stuff then it will
            //	be assumed that the searchParams segment is actually just an embedded query string like this: `foo=bar&baz=qux`
            //
            //	This is used to handle the cases where we are rewriting requests to certain pages such that the query parameters
            //	are embedded in the path. At the time this was written we were doing this for product list and product detail pages
            //	because we wanted to be able to cache them in the CDN and we couldn't do that if the query parameters were in the
            //	query string. This is also used for the search page because we want to be able to cache it in the CDN and we want
            //	the query parameters to be part of the cache key.
            //
            //	IMPORTANT: If the segment name changes from `searchParams` to something else, then this will break this code.
            //
            if (dynamicSegments && "searchParams" in dynamicSegments) {
                const segmentQueryString =
                    dynamicSegments.searchParams as string;
                const segmentQueryParams =
                    querystring.parse(segmentQueryString);
                parsedQuery = { ...parsedQuery, ...segmentQueryParams };
            }

            // Now convert to a URLSearchParams object for convenience
            const urlSearch = new URLSearchParams(
                querystring.stringify(parsedQuery),
            );

            return [urlSearch, parsedQuery, dynamicSegments];
        }, [pagesRouter, readonlySearchParams, appRouterDynamicSegments]);

    const [userFacingPath, setUserFacingPath] = useState<string | null>(null);
    const [userFacingQueryParams, setUserFacingQueryParams] = useState<
        string | null
    >(null);
    const [isRewrittenUrl, setIsRewrittenUrl] = useState<boolean>(false);

    useEffect(() => {
        const clientUrl =
            typeof window !== "undefined"
                ? new URL(window.location.toString())
                : undefined;
        if (
            clientUrl?.pathname !== asPath ||
            clientUrl?.search.substring(1) !==
                queryAsUrlSearchParams?.toString()
        ) {
            setUserFacingPath(`${clientUrl?.pathname}`);
            setUserFacingQueryParams(`${clientUrl?.search.substring(1)}`);
            setIsRewrittenUrl(true);
        } else {
            setUserFacingPath(null);
            setUserFacingQueryParams(null);
            setIsRewrittenUrl(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [asPath, queryAsUrlSearchParams]);

    /**
     * This is used to send the routeChangeStart event when the app router is being used.
     * This is necessary because the app router doesn't emit the event when the route changes.
     */
    useEffect(() => {
        if (events && isAppRoute) {
            events.current.emit("routeChanged");
        }
    }, [pathname, queryAsUrlSearchParams, events, isAppRoute]);

    useEffect(() => {
        if (events && isPagesRoute) {
            // When using the pages router, rely entirely on the events that it emits.

            const handleRouteChangeStart = () => {
                events.current.emit("routeChanged");
            };

            pagesRouter?.events.on("routeChangeStart", handleRouteChangeStart);

            return () => {
                pagesRouter?.events.off(
                    "routeChangeStart",
                    handleRouteChangeStart,
                );
            };
        }

        if (events && isAppRoute) {
            // When using the app router, we need to emit the event when the page loads.  But
            //	we also have another useEffect (above) that will fire this event in cases where the
            //	a "soft" route change occurs (e.g. a SPA change occurs).
            const handleRouteChangeStart = () => {
                events.current.emit("routeChanged");
            };

            window.addEventListener("load", handleRouteChangeStart);

            return () => {
                window.removeEventListener("load", handleRouteChangeStart);
            };
        }

        return undefined;
    }, [events, isAppRoute, isPagesRoute, pagesRouter]);

    const push = useCallback(
        (url: string) => {
            if (isPagesRoute) {
                pagesRouter?.push(url);
            } else {
                appRouter?.push(url);
            }
        },
        [appRouter, isPagesRoute, pagesRouter],
    );

    const replace = useCallback(
        (url: string) => {
            if (isPagesRoute) {
                pagesRouter?.replace(url);
            } else {
                appRouter?.replace(url);
            }
        },
        [appRouter, isPagesRoute, pagesRouter],
    );

    const getUserFacingAsPath = useCallback(() => {
        if (isRewrittenUrl && userFacingPath) {
            return [userFacingPath, userFacingQueryParams].join("?");
        }
        return asPath;
    }, [asPath, isRewrittenUrl, userFacingPath, userFacingQueryParams]);

    return {
        asPath,
        isPagesRoute,
        isAppRoute,
        isRewrittenUrl,
        appRouter,
        pagesRouter,
        pathname,
        dynamicSegments,
        queryAsParsedUrlQuery,
        query: queryAsParsedUrlQuery,
        queryAsUrlSearchParams,
        userFacingPath,
        userFacingQueryParams,
        push,
        replace,
        getUserFacingAsPath,
    };
}
