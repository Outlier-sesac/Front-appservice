import { redirect } from "next/navigation";

export default function StatisticsRedirectPage() {
  redirect("https://outlier-profile.koreacentral.cloudapp.azure.com/");
  return null;
}