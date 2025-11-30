import { createSignal, Show } from "solid-js";
import { geoIpApi } from "../services/all_api";
import { A } from "@solidjs/router";

interface IpInfo {
  ip: string;
  country_code: string;
  country_name: string;
  state: string;
  city: string;
  postal: string;
  latitude: number;
  longitude: number;
}

export default function GeoIpInfo() {
  const [ipInput, setIpInput] = createSignal("");
  const [ipInfo, setIpInfo] = createSignal<IpInfo | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  const handleLookup = async (e: Event) => {
    e.preventDefault();
    if (!ipInput().trim()) return;

    setLoading(true);
    setError(null);
    setIpInfo(null);

    try {
      const response = await geoIpApi.getGeoIpInfo(ipInput().trim());
      // Expecting { success: true, data: IpInfo, meta: ... } or similar structure
      // Adjust based on actual response wrapper if needed.
      // Based on typical requests.get wrapper in this project, it might return the data directly or wrapped.
      // Assuming 'data' field holds the IpInfo based on prompt description.
      if (response && response.data) {
        setIpInfo(response.data);
      } else {
        // If response structure is flattened or different
        setIpInfo(response as unknown as IpInfo);
      }
    } catch (err: any) {
      setError(err.message || "Failed to lookup IP information");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main class="max-w-3xl mx-auto py-12 px-6">
      <h1 class="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100 text-center">
        Geo-IP Database Lookup
      </h1>

      <form onSubmit={handleLookup} class="mb-10 max-w-lg mx-auto">
        <div class="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={ipInput()}
            onInput={(e) => setIpInput(e.currentTarget.value)}
            placeholder="Enter IPv4 or IPv6 address..."
            class="flex-1 px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          <button
            type="submit"
            disabled={loading() || !ipInput().trim()}
            class="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading() ? "Searching..." : "Lookup"}
          </button>
        </div>
        <Show when={error()}>
          <div class="mt-3 text-red-600 dark:text-red-400 text-sm text-center">
            {error()}
          </div>
        </Show>
      </form>

      <Show when={ipInfo()}>
        <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6 sm:p-8">
          <h2 class="text-xl font-bold mb-6 text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-800 pb-2">
            Results for {ipInfo()?.ip}
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
            <div>
              <span class="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                Country
              </span>
              <span class="text-lg text-gray-900 dark:text-gray-100 font-medium">
                {ipInfo()?.country_name}{" "}
                <span class="text-sm text-gray-500">
                  ({ipInfo()?.country_code})
                </span>
              </span>
            </div>

            <div>
              <span class="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                Region / State
              </span>
              <span class="text-lg text-gray-900 dark:text-gray-100 font-medium">
                {ipInfo()?.state || "N/A"}
              </span>
            </div>

            <div>
              <span class="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                City
              </span>
              <span class="text-lg text-gray-900 dark:text-gray-100 font-medium">
                {ipInfo()?.city || "N/A"}
              </span>
            </div>

            <div>
              <span class="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                Postal Code
              </span>
              <span class="text-lg text-gray-900 dark:text-gray-100 font-medium">
                {ipInfo()?.postal || "N/A"}
              </span>
            </div>

            <div class="sm:col-span-2 mt-2 pt-4 border-t border-gray-100 dark:border-gray-800">
              <span class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Coordinates
              </span>
              <div class="flex items-center gap-4">
                <span class="text-gray-900 dark:text-gray-100 font-mono bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                  Lat: {ipInfo()?.latitude}
                </span>
                <span class="text-gray-900 dark:text-gray-100 font-mono bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                  Long: {ipInfo()?.longitude}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Show>

      <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Related Resources
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <A
            href="/visitor-board"
            class="block p-4 rounded border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
          >
            <div class="font-medium text-blue-600 dark:text-blue-400 mb-1">
              Visitor Board
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              See where recent visitors are connecting from.
            </div>
          </A>
          <A
            href="/about-blog"
            class="block p-4 rounded border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
          >
            <div class="font-medium text-blue-600 dark:text-blue-400 mb-1">
              About The Blog
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Learn more about how this site is built.
            </div>
          </A>
        </div>
      </div>
    </main>
  );
}
