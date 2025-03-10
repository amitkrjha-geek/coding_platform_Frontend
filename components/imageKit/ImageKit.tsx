import React from "react";
import { ImageKitProvider, IKUpload } from "imagekitio-next";
import toast from "react-hot-toast";
const url = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT as string
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY as string

interface AuthResponse {
  signature: string;
  expire: number;
  token: string;
}

const authenticator = async (): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINTS}/api/image/auth`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error: any) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

const onError = (err: any) => {
  console.error(err);
  toast.error(err?.message
    ? `An error occurred while uploading image: ${err.message}`
    : "Something went wrong during the image upload process. Please try again later."
  );
};

interface ImagekitProps {
  id: string;
  multiple?: boolean;
  onSuccess: (res: any) => void;
}

const Imagekit: React.FC<ImagekitProps> = ({ id, multiple, onSuccess }) => {
  return (
    <div className="hidden cursor-pointer">
      <ImageKitProvider
        urlEndpoint={url}
        publicKey={publicKey}
        authenticator={authenticator}
      >
        <IKUpload
          onError={onError}
          onSuccess={onSuccess}
          id={id}
          multiple={multiple || false}
        />
      </ImageKitProvider>
    </div>
  );
};

export default Imagekit;
