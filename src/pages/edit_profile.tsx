import { createSignal, Show, onCleanup } from "solid-js";
import { uploadWithProgress } from "../services/upload_with_progress";
import { user, setUser } from "../state/auth";
import { authApi } from "../services/all_api";

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
    <div class="edit-profile-page">
      <h2>Edit Profile</h2>
      <div class="profile-picture-section">
        <img
          src={
            selectedPreviewUrl() ||
            profilePicUrl() ||
            user()?.user_profile_picture?.user_profile_picture_link ||
            "/default-profile.png"
          }
          alt="Profile"
          style={{
            width: "120px",
            height: "120px",
            "border-radius": "60px",
            "object-fit": "cover",
          }}
        />
      </div>
      <div class="upload-section">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button
          onClick={handleUpload}
          disabled={uploading() || !profileImage()}
        >
          {uploading() ? "Uploading..." : "Upload Profile Picture"}
        </button>
        <Show when={uploading()}>
          <div
            class="progress-bar"
            style={{
              width: "100%",
              "margin-top": "12px",
              background: "#f0f0f0",
              "border-radius": "4px",
              height: "10px",
              position: "relative",
            }}
          >
            <div
              class="progress"
              style={{
                width: `${progress()}%`,
                height: "100%",
                background: "#3b82f6",
                "border-radius": "4px",
                transition: "width 0.2s",
              }}
            ></div>
            <span
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                "font-size": "12px",
                color: "#333",
              }}
            >
              {progress()}%
            </span>
          </div>
        </Show>
        <Show when={error()}>
          <div class="error-message">{error()}</div>
        </Show>
      </div>
    </div>
  );
}

export default EditProfilePage;
