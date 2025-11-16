import {
    convexAuthNextjsMiddleware,
    createRouteMatcher,
    nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
import { isBypassRoutes, isPublicRoutes, isProtectedRoutes } from "./lib/permissions";

const BypassMatcher = createRouteMatcher(isBypassRoutes);
const PublicMatcher = createRouteMatcher(isPublicRoutes);
const ProtectedMatcher = createRouteMatcher(isProtectedRoutes);

export default convexAuthNextjsMiddleware(
    async (req, { convexAuth }) => {
        if (BypassMatcher(req)) return;
        const authed = await convexAuth.isAuthenticated();
        if (PublicMatcher(req) && authed) {
            return nextjsMiddlewareRedirect(req, "/dashboard");
        }

        if (ProtectedMatcher(req) && !authed) {
            return nextjsMiddlewareRedirect(req, "/auth/login");
        }

        return;
    },
    {
        cookieConfig: { maxAge: 60 * 60 * 24 * 30 }, // 30 days
    }
);

export const config = {
    // The following matcher runs middleware on all routes
    // except static assets.
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
