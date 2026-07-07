// Redirecciona al panel principal de la aplicación.

import { redirect } from "next/navigation";

// Componente principal.

export default function Home() {

  // Redirecciona automáticamente al dashboard.

  redirect("/dashboard");

}