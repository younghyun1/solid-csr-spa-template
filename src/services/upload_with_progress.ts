export function uploadWithProgress({
  url,
  formData,
  onProgress,
  headers = {},
  credentials = "include",
}: {
  url: string;
  formData: FormData;
  onProgress: (percentage: number) => void;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
}): Promise<any> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    if (credentials === "include") {
      xhr.withCredentials = true;
    }
    for (const k of Object.keys(headers)) {
      xhr.setRequestHeader(k, headers[k]);
    }

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && typeof onProgress === "function") {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch (err) {
          resolve(xhr.responseText);
        }
      } else {
        reject(new Error(xhr.responseText || "Upload failed"));
      }
    };
    xhr.onerror = () => reject(new Error("XHR upload failed"));
    xhr.send(formData);
  });
}
