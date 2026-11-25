import { redirect } from "next/navigation";

// Contact now lives in the "Say hello" section of the home page.
export default function ContactPage() {
  redirect("/#contact");
}
