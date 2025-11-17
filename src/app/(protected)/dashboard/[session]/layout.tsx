import Navbar from "@/components/navbar";
import { SubscriptionEntitlementQuery } from "@/convex/query.config";
import { combinedSlug } from "@/lib/utils";
import { redirect } from "next/navigation";

type Props = {
    children: React.ReactNode;
};

export default async function Layout({ children }: Props) {
    const { entitlement, profileName } = await SubscriptionEntitlementQuery();
    // TODO: Remove billing hardcoded path
    // if (!entitlement._valueJSON) redirect(`/dashboard/${combinedSlug(profileName!)}`);

    return (
        <div>
            <Navbar />
            {children}
        </div>
    );
}
