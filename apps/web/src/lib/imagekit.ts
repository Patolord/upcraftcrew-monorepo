import { env } from "@up-craft-crew-app/env/web";

export const imagekitConfig = {
  publicKey: env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
  authenticationEndpoint: "/api/imagekit/auth",
};

export type ImageKitUploadResponse = {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  height: number;
  width: number;
  size: number;
  filePath: string;
  fileType: string;
};

/**
 * Get authentication parameters for ImageKit upload
 */
export async function getImageKitAuthParams() {
  const response = await fetch("/api/imagekit/auth");
  if (!response.ok) {
    throw new Error("Failed to get ImageKit auth params");
  }
  return response.json();
}

/**
 * Upload file to ImageKit using client-side upload
 */
export async function uploadToImageKit(
  file: File,
  options?: {
    folder?: string;
    fileName?: string;
    tags?: string[];
  },
): Promise<ImageKitUploadResponse> {
  if (!imagekitConfig.publicKey) {
    throw new Error("ImageKit public key is not configured");
  }

  const authParams = await getImageKitAuthParams();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", options?.fileName || file.name);
  formData.append("publicKey", imagekitConfig.publicKey);
  formData.append("signature", authParams.signature);
  formData.append("expire", authParams.expire.toString());
  formData.append("token", authParams.token);

  if (options?.folder) {
    formData.append("folder", options.folder);
  }

  if (options?.tags && options.tags.length > 0) {
    formData.append("tags", options.tags.join(","));
  }

  const response = await fetch("https://upload.imagekit.io/api/v2/files/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ImageKit upload failed: ${error}`);
  }

  return response.json();
}

/**
 * Get optimized image URL with transformations
 */
export function getImageKitUrl(
  path: string,
  transformations?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "auto" | "webp" | "jpg" | "png";
  },
): string {
  const baseUrl = imagekitConfig.urlEndpoint;
  if (!baseUrl) {
    return path; // Return original path if ImageKit not configured
  }
  const transforms: string[] = [];

  if (transformations?.width) {
    transforms.push(`w-${transformations.width}`);
  }
  if (transformations?.height) {
    transforms.push(`h-${transformations.height}`);
  }
  if (transformations?.quality) {
    transforms.push(`q-${transformations.quality}`);
  }
  if (transformations?.format) {
    transforms.push(`f-${transformations.format}`);
  }

  const transformString = transforms.length > 0 ? `tr:${transforms.join(",")}/` : "";

  // Handle both full URLs and paths
  if (path.startsWith("http")) {
    // Extract the path from full URL if it's from ImageKit
    if (baseUrl && path.includes(baseUrl)) {
      path = path.replace(baseUrl, "").replace(/^\//, "");
    } else {
      return path; // Return as-is if external URL
    }
  }

  return `${baseUrl}/${transformString}${path}`;
}
