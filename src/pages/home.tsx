import HostStatsDashboard from "../components/HostStatsDashboard";

export default function Home() {
  // If your API expects API key in ws URL, you could fetch from env or import from config
  // Otherwise can omit `apiKey` prop
  return <HostStatsDashboard />;
}
