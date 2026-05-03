import axios from 'axios';

export const uploadToImgBB = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error('ImgBB API key is missing');
  }

  const response = await axios.post(
    `https://api.imgbb.com/1/upload?key=${apiKey}`,
    formData
  );

  if (response.data && response.data.data && response.data.data.url) {
    return response.data.data.url;
  }

  throw new Error('Image upload failed');
};
