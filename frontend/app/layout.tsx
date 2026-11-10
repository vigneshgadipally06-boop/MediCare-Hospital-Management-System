import "./globals.css";
export const metadata = { title: "MediCare | Hospital Management", description: "Appointments and patient queue management" };
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}
