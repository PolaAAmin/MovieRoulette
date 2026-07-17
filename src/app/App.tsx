import { appProviders as AppProviders } from "@/app/providers";
import { appRoutes as AppRoutes } from "@/app/routes";
import Layout from "@/app/Layout";
import { Analytics } from "@vercel/analytics/react";

export default function App() {
  return (
    <AppProviders>
      <Analytics />
      <Layout>
        <AppRoutes />
      </Layout>
    </AppProviders>
  );
}