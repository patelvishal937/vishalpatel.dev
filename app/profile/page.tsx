import { permanentRedirect } from "next/navigation";

// Old URL: the profile is the About section now.
export default function ProfilePage() {
  permanentRedirect("/about");
}
