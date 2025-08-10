import {
  createSignal,
  Show,
  onCleanup,
  createResource,
  createMemo,
} from "solid-js";
import { uploadWithProgress } from "../services/upload_with_progress";
import { user, setUser } from "../state/auth";
import { authApi, dropdownApi } from "../services/all_api";

const MAX_SIZE_OF_UPLOADABLE_PROFILE_PICTURE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES: string[] = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/x-portable-anymap",
  "image/tiff",
  "image/x-tga",
  "image/vnd-ms.dds",
  "image/bmp",
  "image/vnd.microsoft.icon",
  "image/vnd.radiance",
  "image/x-exr",
  "image/farbfeld",
  "image/avif",
  "image/qoi",
  "image/vnd.zbrush.pcx",
];

function EditProfilePage() {
  const [profileImage, setProfileImage] = createSignal<File | null>(null);
  const [uploading, setUploading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [profilePicUrl, setProfilePicUrl] = createSignal<string | null>(
    user()?.user_profile_picture?.user_profile_picture_link ?? null,
  );
  const [progress, setProgress] = createSignal<number>(0);
  const [selectedPreviewUrl, setSelectedPreviewUrl] = createSignal<
    string | null
  >(null);

  const userCountryId = () => user()?.user_info?.user_country;
  const userSubdivisionId = () => user()?.user_info?.user_subdivision;

  // Load dropdown caches/resources
  const [countries] = createResource(
    async () => await dropdownApi.countryList(),
  );
  const [languages] = createResource(
    async () => await dropdownApi.languageList(),
  );
  const [subdivisions] = createResource(userCountryId, async (cid) => {
    if (cid === null || cid === undefined) return [];
    try {
      const res: any = await dropdownApi.countrySubdivisions(Number(cid));
      if (Array.isArray(res?.data)) return res.data;
      if (Array.isArray(res)) return res;
      return [];
    } catch {
      return [];
    }
  });

  // Build lookup maps
  const countryMap = createMemo(() => {
    const res: any = countries();
    const list = Array.isArray(res?.data?.countries)
      ? res.data.countries
      : Array.isArray(res?.data)
        ? res.data
        : (res?.countries ?? []);
    const m: Record<number, any> = {};
    for (const c of list) {
      m[Number(c.country_code)] = c;
    }
    return m;
  });
  const languageMap = createMemo(() => {
    const res: any = languages();
    const list = Array.isArray(res?.data)
      ? res.data
      : Array.isArray(res)
        ? res
        : [];
    const m: Record<number, any> = {};
    for (const l of list) {
      m[Number(l.language_code)] = l;
    }
    return m;
  });
  const subdivisionMap = createMemo(() => {
    const res: any = subdivisions();
    const list = Array.isArray(res?.data)
      ? res.data
      : Array.isArray(res)
        ? res
        : [];
    const m: Record<number, any> = {};
    for (const s of list) {
      m[Number(s.subdivision_id)] = s;
    }
    return m;
  });

  // Formatters
  const formatCountry = (code: any) => {
    if (code === null || code === undefined) return "";
    const c = countryMap()[Number(code)];
    if (!c) return String(code);
    const flag = c.country_flag ? c.country_flag + " " : "";
    const name = c.country_eng_name ?? c.country_name ?? "";
    return `${flag}${name || code}`.trim();
  };
  const formatLanguage = (code: any) => {
    if (code === null || code === undefined) return "";
    const l = languageMap()[Number(code)];
    if (!l) return String(code);
    return l.language_eng_name ?? l.language_name ?? String(code);
  };
  const formatSubdivision = (id: any) => {
    if (id === null || id === undefined) return "No Subdivision / N/A";
    const s = subdivisionMap()[Number(id)];
    if (!s) return String(id);
    return s.subdivision_name ?? String(id);
  };

  let fileInputRef: HTMLInputElement | undefined;

  onCleanup(() => {
    const url = selectedPreviewUrl();
    if (url) URL.revokeObjectURL(url);
  });

  const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];

      setError(null);

      if (file.size > MAX_SIZE_OF_UPLOADABLE_PROFILE_PICTURE) {
        setProfileImage(null);
        setSelectedPreviewUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return null;
        });
        setError("File is too big. Maximum size is 10MB.");
        return;
      }

      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        setProfileImage(null);
        setSelectedPreviewUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return null;
        });
        setError("Unsupported image type. Please choose a valid image.");
        return;
      }

      setProfileImage(file);
      setSelectedPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(file);
      });
    }
  };

  const clearSelection = () => {
    setProfileImage(null);
    setSelectedPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setError(null);
  };

  const handleUpload = async () => {
    if (!profileImage()) {
      setError("Please select an image to upload.");
      return;
    }
    setUploading(true);
    setError(null);
    setProgress(0);

    const formData = new FormData();
    formData.append("profile_picture", profileImage() as File);

    try {
      // Use XMLHttpRequest-based utility for progress
      const resp = await uploadWithProgress({
        url: "/api/user/upload-profile-picture",
        formData,
        onProgress: setProgress,
      });
      if (resp && resp.success) {
        try {
          const me = await authApi.me();
          if (me?.success && me.data) {
            setUser(me.data);
            setProfilePicUrl(
              me.data.user_profile_picture?.user_profile_picture_link ?? null,
            );
            setProfileImage(null);
            setSelectedPreviewUrl((prev) => {
              if (prev) URL.revokeObjectURL(prev);
              return null;
            });
          } else {
            setError("Upload succeeded, but failed to refresh profile.");
          }
        } catch (e: any) {
          setError(e?.message ?? "Failed to refresh profile.");
        }
      } else {
        setError("Upload failed. Please try again.");
      }
    } catch (err: any) {
      setError(err.message ?? "Unknown error during upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <section class="px-4 py-8 md:py-10 bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100 transition-colors duration-100 min-h-[60vh]">
      <div class="max-w-3xl mx-auto">
        <h1 class="text-2xl font-bold mb-6">Edit Profile</h1>

        <div class="space-y-10">
          <section>
            <h2 class="text-lg font-semibold">Change Profile Picture</h2>
            <hr class="my-3 border-gray-200 dark:border-gray-800" />
            <div class="flex items-start gap-6">
              <div class="w-32 h-32 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700 shadow">
                <img
                  src={
                    selectedPreviewUrl() ||
                    profilePicUrl() ||
                    user()?.user_profile_picture?.user_profile_picture_link ||
                    "/default-profile.png"
                  }
                  alt="Profile"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  class="hidden"
                />

                <div class="flex gap-2 mt-1 flex-wrap">
                  <button
                    type="button"
                    onClick={() => fileInputRef?.click()}
                    disabled={uploading()}
                    class="px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-60"
                  >
                    Choose Image
                  </button>

                  <button
                    onClick={handleUpload}
                    disabled={uploading() || !profileImage()}
                    class="px-4 py-2 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-60"
                  >
                    {uploading() ? "Uploading..." : "Upload"}
                  </button>
                </div>

                <div class="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  Common formats (PNG, JPG, GIF, WEBP). Max 10MB.
                </div>

                <Show when={uploading()}>
                  <div class="w-full mt-4">
                    <div class="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        class="h-full bg-blue-600 transition-all"
                        style={{ width: `${progress()}%` }}
                      />
                    </div>
                    <div class="text-xs mt-1 text-gray-600 dark:text-gray-300">
                      {progress()}%
                    </div>
                  </div>
                </Show>

                <Show when={error()}>
                  <div
                    class="mt-3 text-sm bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded px-3 py-2"
                    aria-live="polite"
                  >
                    {error()}
                  </div>
                </Show>
              </div>
            </div>
          </section>

          <section>
            <h2 class="text-lg font-semibold">Profile Info</h2>
            <hr class="my-3 border-gray-200 dark:border-gray-800" />
            <div class="space-y-4">
              <div class="grid grid-cols-12 items-center gap-3">
                <div class="col-span-4 text-sm text-gray-600 dark:text-gray-300">
                  Display name
                </div>
                <div class="col-span-8">
                  <input
                    disabled
                    value={user()?.user_info?.user_name ?? ""}
                    class="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                  />
                </div>
              </div>
              <div class="grid grid-cols-12 items-center gap-3">
                <div class="col-span-4 text-sm text-gray-600 dark:text-gray-300">
                  Email
                </div>
                <div class="col-span-8">
                  <input
                    disabled
                    value={user()?.user_info?.user_email ?? ""}
                    class="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                  />
                </div>
              </div>
              <div class="grid grid-cols-12 items-center gap-3">
                <div class="col-span-4 text-sm text-gray-600 dark:text-gray-300">
                  User ID
                </div>
                <div class="col-span-8">
                  <input
                    disabled
                    value={user()?.user_info?.user_id ?? ""}
                    class="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                  />
                </div>
              </div>
              <div class="grid grid-cols-12 items-center gap-3">
                <div class="col-span-4 text-sm text-gray-600 dark:text-gray-300">
                  Email Verified
                </div>
                <div class="col-span-8">
                  <input
                    disabled
                    value={
                      user()?.user_info?.user_is_email_verified ? "Yes" : "No"
                    }
                    class="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                  />
                </div>
              </div>
              <div class="grid grid-cols-12 items-center gap-3">
                <div class="col-span-4 text-sm text-gray-600 dark:text-gray-300">
                  Country
                </div>
                <div class="col-span-8">
                  <input
                    disabled
                    value={formatCountry(user()?.user_info?.user_country)}
                    class="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                  />
                </div>
              </div>
              <div class="grid grid-cols-12 items-center gap-3">
                <div class="col-span-4 text-sm text-gray-600 dark:text-gray-300">
                  Language
                </div>
                <div class="col-span-8">
                  <input
                    disabled
                    value={formatLanguage(user()?.user_info?.user_language)}
                    class="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                  />
                </div>
              </div>
              <div class="grid grid-cols-12 items-center gap-3">
                <div class="col-span-4 text-sm text-gray-600 dark:text-gray-300">
                  Subdivision
                </div>
                <div class="col-span-8">
                  <input
                    disabled
                    value={formatSubdivision(
                      user()?.user_info?.user_subdivision,
                    )}
                    class="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

export default EditProfilePage;
