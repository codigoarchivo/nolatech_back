import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';

const userImageCloudinary = async (req: Request, res: Response) => {
  try {
    const user = req.body;
    const tempFilePath = (req.files as any).file.tempFilePath;
    const folder = 'nolatech'

    // Clear Previous Images
    await clearPreviousImage(user.profile_image, folder);
    // Resize the image
    const resizedImageBuffer = await resizeImage(tempFilePath, 150, 150);
    // Upload the resized image to Cloudinary
    const imageUrl = await uploadImage(resizedImageBuffer, folder);
    // Delete the temporary image file
    deleteTempImage(tempFilePath);

    return res.status(200).json({
      msg: 'Image uploaded successfully',
      image: imageUrl,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
};

const clearPreviousImage = async (oldImage: string, folder: string) => {
  if (oldImage) {
    const nombreArr = oldImage.split('/');
    const [public_id] = nombreArr[nombreArr.length - 1].split('.');
    await cloudinary.uploader.destroy(`${folder}/${public_id}`);
  }
};

const uploadImage = async (resizedImageBuffer: Buffer,  folder: string) => {
  const tempImagePath = path.join(__dirname, 'temp-profile_image.jpg');

  const [, result] = await Promise.all([
    sharp(resizedImageBuffer).toFile(tempImagePath),
    cloudinary.uploader.upload(tempImagePath, { folder: folder }),
  ]);

  return result.secure_url;
};

const deleteTempImage = (imagePath: string) => {
  fs.unlinkSync(imagePath);
};

const resizeImage = async (
  imageBuffer: Buffer,
  sizeX: number,
  sizeY: number
) => {
  try {
    const resizedImageBuffer = await sharp(imageBuffer)
      .resize(sizeX, sizeY)
      .toBuffer();

    return resizedImageBuffer;
  } catch (error) {
    console.error('Error resizing image:', error);
    throw error; // Propagate the error
  }
};

export default userImageCloudinary;
