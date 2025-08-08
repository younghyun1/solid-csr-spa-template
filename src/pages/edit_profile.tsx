import { createSignal, Show } from "solid-js";
import { uploadWithProgress } from "../services/upload_with_progress";

function EditProfilePage() {
  const [profileImage, setProfileImage] = createSignal<File | null>(null);
  const [uploading, setUploading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [profilePicUrl, setProfilePicUrl] = createSignal<string | null>(null);
  const [progress, setProgress] = createSignal<number>(0);

  const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      setProfileImage(target.files[0]);
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
      if (resp && resp.profile_picture_url) {
        setProfilePicUrl(resp.profile_picture_url);
        setProfileImage(null);
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
        <Show when={profilePicUrl()}>
          <img
            src={profilePicUrl()!}
            alt="Profile"
            style={{
              width: "120px",
              height: "120px",
              "border-radius": "60px",
              "object-fit": "cover",
            }}
          />
        </Show>
        <Show when={!profilePicUrl()}>
          <div
            style={{
              width: "120px",
              height: "120px",
              "border-radius": "60px",
              background: "#eee",
              display: "flex",
              "align-items": "center",
              "justify-content": "center",
            }}
          >
            No Image
          </div>
        </Show>
      </div>
      <div class="upload-section">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={uploading()}>
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
