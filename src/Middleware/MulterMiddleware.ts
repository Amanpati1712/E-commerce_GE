import { Storage } from "@google-cloud/storage";
import path from "path";
import { Request } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

// Initialize Google Cloud Storage
//This line creates a Google Cloud Storage instance.
const storage = new Storage({
    keyFilename: path.resolve(__dirname, "../../key.json"), // Move up 2 levels
});

const bucketName = "ecommercesite123";
const bucket = storage.bucket(bucketName);

// multer configuration
const upload = multer({
    storage: multer.memoryStorage()
});


//--->getting from GCP-->

const getSignedUrl = async (fileName: string): Promise<string> => {
    const file = bucket.file(fileName);

    const [url] = await file.getSignedUrl({
        action: "read",
        expires: "2100-01-01T00:00:00Z", // Expires in 100+ years
    });

    return url;
};


// upload to GCP---->

const uploadToGCP = async (file: Express.Multer.File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const fileName = `profilePictures/${uuidv4()}${path.extname(file.originalname)}`;

        const fileUpload = bucket.file(fileName);

        const stream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            },
        });

        stream.on("error", (err) => reject(err));

        stream.on("finish", async () => {
            try {
                const url = await getSignedUrl(fileName); // Pass fileName
                resolve(url);
            } catch (err) {
                reject(err);
            }
        });

        stream.end(file.buffer);
    });
};

export { upload, uploadToGCP };
