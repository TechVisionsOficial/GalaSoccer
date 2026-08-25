import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AccountNav } from "@/components/account-nav";
import { ProfileForm } from "@/components/profile-form";
import { getCurrentCustomer } from "@/lib/current-customer";

export default async function AccountPage() {
  const customer = await getCurrentCustomer();

  if (!customer) {
    redirect("/login");
  }

  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col bg-white">
        <div className="mx-auto w-full max-w-2xl px-6 py-10">
          <h1 className="mb-6 text-2xl font-bold text-neutral-900">
            Minha conta
          </h1>

          <AccountNav active="profile" />

          <div className="max-w-sm rounded-lg border border-neutral-200 p-5">
            <h2 className="mb-3 text-sm font-semibold text-neutral-900">
              Seus dados
            </h2>
            <ProfileForm
              name={customer.name}
              phone={customer.phone}
              email={customer.email}
            />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
