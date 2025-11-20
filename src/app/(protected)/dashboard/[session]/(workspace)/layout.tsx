import Navbar from "@/components/navbar";
import { SubscriptionEntitlementQuery } from "@/convex/query.config";
import { combinedSlug } from "@/lib/utils";
import { redirect } from "next/navigation";

type Props = {
    children: React.ReactNode;
};

export default async function Layout({ children }: Props) {
    const { entitlement, profileName } = await SubscriptionEntitlementQuery();
    if (!entitlement._valueJSON) redirect(`/billing/${combinedSlug(profileName!)}`);

    return (
        <div>
            <Navbar />
            {children}
        </div>
    );
}
