import { redirect } from "next/navigation";

// The profile now lives in the "A bit about me" section of the home page.
export default function ProfilePage() {
  redirect("/#about");
}
