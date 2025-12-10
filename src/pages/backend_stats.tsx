import { createResource, Show } from "solid-js";
import HostStatsDashboard from "../components/HostStatsDashboard";
import { healthApi } from "../services/all_api";

export default function BackendStats() {
  const [fastfetch] = createResource(async () => {
    try {
      const res = await healthApi.fastfetch();
      return res.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  });

  return (
    <div class="w-full min-h-full p-4 sm:p-8 flex flex-col xl:flex-row items-center xl:items-start justify-center gap-8">
      <HostStatsDashboard />

      <Show when={fastfetch()}>
        <div class="w-full max-w-7xl xl:w-auto bg-black text-white p-6 rounded-xl shadow-2xl font-mono text-xs sm:text-sm overflow-x-auto border border-gray-800">
          <pre innerHTML={fastfetch()} />
        </div>
      </Show>
    </div>
  );
}
