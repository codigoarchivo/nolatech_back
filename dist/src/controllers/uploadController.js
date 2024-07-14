"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cloudinary_1 = require("cloudinary");
const sharp_1 = __importDefault(require("sharp"));
const userImageCloudinary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body;
        const tempFilePath = req.files.file.tempFilePath;
        const folder = 'nolatech';
        // Clear Previous Images
        yield clearPreviousImage(user.profile_image, folder);
        // Resize the image
        const resizedImageBuffer = yield resizeImage(tempFilePath, 150, 150);
        // Upload the resized image to Cloudinary
        const imageUrl = yield uploadImage(resizedImageBuffer, folder);
        // Delete the temporary image file
        deleteTempImage(tempFilePath);
        return res.status(200).json({
            msg: 'Image uploaded successfully',
            image: imageUrl,
        });
    }
    catch (error) {
        console.error('Error uploading image:', error);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
});
const clearPreviousImage = (oldImage, folder) => __awaiter(void 0, void 0, void 0, function* () {
    if (oldImage) {
        const nombreArr = oldImage.split('/');
        const [public_id] = nombreArr[nombreArr.length - 1].split('.');
        yield cloudinary_1.v2.uploader.destroy(`${folder}/${public_id}`);
    }
});
const uploadImage = (resizedImageBuffer, folder) => __awaiter(void 0, void 0, void 0, function* () {
    const tempImagePath = path_1.default.join(__dirname, 'temp-profile_image.jpg');
    const [, result] = yield Promise.all([
        (0, sharp_1.default)(resizedImageBuffer).toFile(tempImagePath),
        cloudinary_1.v2.uploader.upload(tempImagePath, { folder: folder }),
    ]);
    console.log('URL de la imagen en Cloudinary:', result.secure_url);
    return result.secure_url;
});
const deleteTempImage = (imagePath) => {
    fs_1.default.unlinkSync(imagePath);
};
const resizeImage = (imageBuffer, sizeX, sizeY) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resizedImageBuffer = yield (0, sharp_1.default)(imageBuffer)
            .resize(sizeX, sizeY)
            .toBuffer();
        return resizedImageBuffer;
    }
    catch (error) {
        console.error('Error resizing image:', error);
        throw error; // Propagate the error
    }
});
exports.default = userImageCloudinary;
//# sourceMappingURL=uploadController.js.map