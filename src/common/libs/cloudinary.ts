import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

export const uploadImage = async (file: string[]) => {
  const uploadedImages = await Promise.all(
    file.map(async (image) => {
      const { secure_url, public_id } = await cloudinary.uploader.upload(image, {folder: 'products'});
      return { secure_url, public_id }
    })
  )

  return uploadedImages;
}
