import { v2 as cloudinary } from 'cloudinary'
import env from '#start/env'

cloudinary.config({
  cloud_name: env.get('CLOUDINARY_CLOUD_NAME'),
  api_key: env.get('CLOUDINARY_API_KEY'),
  api_secret: env.get('CLOUDINARY_API_SECRET'),
  secure: true,
})

export async function uploadToCloudinary(tmpPath: string, folder = 'notes'): Promise<string> {
  const result = await cloudinary.uploader.upload(tmpPath, {
    folder,
    resource_type: 'image',
    transformation: [{ quality: 'auto', fetch_format: 'auto', width: 1200, crop: 'limit' }],
  })

  return result.secure_url
}

export async function deleteFromCloudinary(secureUrl: string): Promise<void> {
  const match = secureUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i)
  if (!match) return
  await cloudinary.uploader.destroy(match[1])
}
