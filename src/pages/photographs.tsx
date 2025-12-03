import {
  createSignal,
  createEffect,
  onCleanup,
  For,
  Show,
  onMount,
} from "solid-js";
import { photographyApi } from "../services/all_api";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- Types ---
interface PhotographItem {
  photograph_id: string;
  user_id: string;
  photograph_shot_at?: string;
  photograph_created_at: string;
  photograph_updated_at: string;
  photograph_image_type: number;
  photograph_is_on_cloud: boolean;
  photograph_link: string;
  photograph_thumbnail_link: string;
  photograph_comments: string;
  photograph_lat: number;
  photograph_lon: number;
}

interface PaginationMeta {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

interface GetPhotographsResponse {
  items: PhotographItem[];
  pagination: PaginationMeta;
}

// --- Styles ---
const styles = `
.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1rem;
  width: 100%;
  max-width: 1600px;
}
.photo-card {
  aspect-ratio: 1;
  border-radius: 0.5rem;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  transition: transform 0.2s;
  background-color: #f3f4f6;
}
.dark .photo-card {
  background-color: #374151;
}
.photo-card:hover {
  transform: scale(1.02);
}
.photo-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
  padding: 1rem;
}
.modal-content {
  background-color: white;
  border-radius: 0.5rem;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
  position: relative;
  display: flex;
  flex-direction: column;
}
.dark .modal-content {
  background-color: #1f2937;
  color: #f3f4f6;
}
.upload-modal {
  width: 600px;
  max-width: 100%;
}
.details-modal {
  max-width: 1200px;
  width: 100%;
  flex-direction: row;
  overflow: hidden;
}
@media (max-width: 768px) {
  .details-modal {
    flex-direction: column;
    overflow-y: auto;
  }
  .details-image-container {
    width: 100%;
    height: 50vh;
  }
  .details-info {
    width: 100%;
    padding: 1rem;
  }
}
.details-image-container {
  flex: 2;
  background: black;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}
.details-image-container img {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
}
.details-info {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  min-width: 300px;
}
.map-container {
  height: 300px;
  width: 100%;
  border-radius: 0.5rem;
  margin-top: 0.5rem;
  z-index: 10;
}
.emoji-marker {
  font-size: 2rem;
  line-height: 1.2;
  text-align: center;
  transform: translateY(-10%);
}
`;

export default function Photographs() {
  // State
  const [photos, setPhotos] = createSignal<PhotographItem[]>([]);
  const [page, setPage] = createSignal(1);
  const [loading, setLoading] = createSignal(false);
  const [hasMore, setHasMore] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);

  // Modals
  const [selectedPhoto, setSelectedPhoto] = createSignal<PhotographItem | null>(
    null,
  );
  const [showUpload, setShowUpload] = createSignal(false);

  // Upload Form State
  const [uploadFile, setUploadFile] = createSignal<File | null>(null);
  const [uploadComment, setUploadComment] = createSignal("");
  const [uploadLat, setUploadLat] = createSignal<number | null>(null);
  const [uploadLon, setUploadLon] = createSignal<number | null>(null);
  const [uploading, setUploading] = createSignal(false);

  // Load photos
  const fetchPhotos = async () => {
    if (loading() || !hasMore()) return;
    setLoading(true);
    try {
      const resp = await photographyApi.getPhotographs(page(), 24);
      const data = resp.data as GetPhotographsResponse;

      if (data.items.length === 0) {
        setHasMore(false);
      } else {
        setPhotos((prev) => [...prev, ...data.items]);
        setPage((p) => p + 1);
        setHasMore(data.pagination.has_next);
      }
    } catch (err: any) {
      console.error("Failed to fetch photos:", err);
      setError("Failed to load photographs.");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  onMount(() => {
    fetchPhotos();
    // Intersection observer for infinite scroll
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore() && !loading()) {
          fetchPhotos();
        }
      },
      { threshold: 0.5 },
    );

    const sentinel = document.getElementById("scroll-sentinel");
    if (sentinel) observer.observe(sentinel);

    onCleanup(() => observer.disconnect());
  });

  // Handle Upload
  const handleUpload = async (e: Event) => {
    e.preventDefault();
    if (!uploadFile()) return;
    if (uploadLat() === null || uploadLon() === null) {
      alert("Please select a location on the map.");
      return;
    }
    if (!uploadComment()) {
      alert("Please enter a comment.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadFile()!);
      formData.append("comments", uploadComment());
      formData.append("lat", String(uploadLat()));
      formData.append("lon", String(uploadLon()));

      await photographyApi.uploadPhotograph(formData);

      // Reset and reload
      setShowUpload(false);
      setUploadFile(null);
      setUploadComment("");
      setUploadLat(null);
      setUploadLon(null);
      setPhotos([]);
      setPage(1);
      setHasMore(true);
      fetchPhotos();
    } catch (err: any) {
      console.error("Upload failed:", err);
      alert("Failed to upload photo.");
    } finally {
      setUploading(false);
    }
  };

  // Map Component for Upload
  const UploadMap = () => {
    let mapDiv: HTMLDivElement | undefined;
    let map: L.Map | null = null;
    let marker: L.Marker | null = null;

    onMount(() => {
      // Default to roughly London or center of world
      const initialPos: [number, number] = [20, 0];
      const zoom = 2;

      map = L.map(mapDiv!).setView(initialPos, zoom);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const emojiIcon = L.divIcon({
        className: "emoji-marker",
        html: "📍",
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });

      // Click handler
      map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        setUploadLat(lat);
        setUploadLon(lng);

        if (marker) {
          marker.setLatLng([lat, lng]);
        } else {
          marker = L.marker([lat, lng], { icon: emojiIcon }).addTo(map!);
        }
      });

      // Restore existing selection if any (e.g. if modal closed/reopened, state persists)
      if (uploadLat() !== null && uploadLon() !== null) {
        marker = L.marker([uploadLat()!, uploadLon()!], {
          icon: emojiIcon,
        }).addTo(map);
        map.setView([uploadLat()!, uploadLon()!], 10);
      }
    });

    onCleanup(() => {
      map?.remove();
    });

    return <div ref={(el) => (mapDiv = el)} class="map-container" />;
  };

  // Map Component for Details
  const DetailsMap = (props: { lat: number; lon: number }) => {
    let mapDiv: HTMLDivElement | undefined;
    let map: L.Map | null = null;

    onMount(() => {
      map = L.map(mapDiv!).setView([props.lat, props.lon], 13);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const emojiIcon = L.divIcon({
        className: "emoji-marker",
        html: "📍",
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });

      L.marker([props.lat, props.lon], { icon: emojiIcon }).addTo(map);
    });

    onCleanup(() => {
      map?.remove();
    });

    return <div ref={(el) => (mapDiv = el)} class="map-container" />;
  };

  return (
    <>
      <style>{styles}</style>
      <div class="flex flex-col items-center w-full min-h-screen bg-white dark:bg-gray-900 transition-colors duration-90">
        {/* Header / Actions */}
        <div class="w-full max-w-[1600px] p-4 flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Photographs
          </h1>
          <button
            onClick={() => setShowUpload(true)}
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Upload Photo
          </button>
        </div>

        {/* Error Message */}
        <Show when={error()}>
          <div class="p-4 mb-4 text-red-600 bg-red-100 rounded">{error()}</div>
        </Show>

        {/* Photo Grid */}
        <div class="photo-grid">
          <For each={photos()}>
            {(photo) => (
              <div
                class="photo-card"
                onClick={() => setSelectedPhoto(photo)}
                title={photo.photograph_comments}
              >
                <img
                  src={photo.photograph_thumbnail_link || photo.photograph_link}
                  alt={photo.photograph_comments}
                  loading="lazy"
                />
              </div>
            )}
          </For>
        </div>

        {/* Loading / Sentinel */}
        <div id="scroll-sentinel" class="h-10 w-full flex justify-center p-4">
          <Show when={loading()}>
            <span class="text-gray-500 dark:text-gray-400">
              Loading more...
            </span>
          </Show>
          <Show when={!hasMore() && photos().length > 0}>
            <span class="text-gray-400 dark:text-gray-600">No more photos</span>
          </Show>
        </div>
      </div>

      {/* Upload Modal */}
      <Show when={showUpload()}>
        <div
          class="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowUpload(false);
          }}
        >
          <div class="modal-content upload-modal p-6">
            <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Upload New Photograph
            </h2>
            <form onSubmit={handleUpload} class="flex flex-col gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Select Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setUploadFile(e.currentTarget.files?.[0] || null)
                  }
                  required
                  class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-300"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Comments
                </label>
                <textarea
                  value={uploadComment()}
                  onInput={(e) => setUploadComment(e.currentTarget.value)}
                  required
                  rows={3}
                  class="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                  placeholder="Describe your photo..."
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location (Click on map)
                </label>
                <Show when={uploadLat() !== null}>
                  <p class="text-xs text-green-600 mb-1">
                    Selected: {uploadLat()?.toFixed(4)},{" "}
                    {uploadLon()?.toFixed(4)}
                  </p>
                </Show>
                <UploadMap />
              </div>

              <div class="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowUpload(false)}
                  class="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading()}
                  class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading() ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Show>

      {/* Details Modal */}
      <Show when={selectedPhoto()}>
        <div
          class="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedPhoto(null);
          }}
        >
          <div class="modal-content details-modal">
            <button
              onClick={() => setSelectedPhoto(null)}
              class="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
            >
              ✕
            </button>
            <div class="details-image-container">
              <img
                src={selectedPhoto()!.photograph_link}
                alt={selectedPhoto()!.photograph_comments}
              />
            </div>
            <div class="details-info bg-white dark:bg-gray-800">
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">
                  Comments
                </h3>
                <p class="text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-wrap">
                  {selectedPhoto()!.photograph_comments}
                </p>
              </div>

              <div>
                <h3 class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Taken At
                </h3>
                <p class="text-gray-900 dark:text-gray-100">
                  {selectedPhoto()!.photograph_shot_at
                    ? new Date(
                        selectedPhoto()!.photograph_shot_at!,
                      ).toLocaleString()
                    : "Unknown date"}
                </p>
              </div>

              <div>
                <h3 class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Location
                </h3>
                <div class="mt-2 h-[200px] rounded overflow-hidden">
                  <DetailsMap
                    lat={selectedPhoto()!.photograph_lat}
                    lon={selectedPhoto()!.photograph_lon}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </>
  );
}
