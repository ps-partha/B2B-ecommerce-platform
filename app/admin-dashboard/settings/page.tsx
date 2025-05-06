import { redirect } from "next/navigation"

export default function SettingsPage() {
  // Redirect to the general settings page
  redirect("/admin/settings/general")
}
