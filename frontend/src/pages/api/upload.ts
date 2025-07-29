import type { NextApiRequest, NextApiResponse } from "next";
import Busboy from "busboy";
import pinata from "@/utils/pinataConfig";

export const config = { api: { bodyParser: false } };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const fields: Record<string, string> = {};
  const chunks: Uint8Array[] = [];

  await new Promise<void>((resolve, reject) => {
    const bb = Busboy({ headers: req.headers });
    bb.on("file", (_, stream) =>
      stream.on("data", (chunk) => chunks.push(chunk))
    );
    bb.on("field", (name, val) => {
      fields[name] = val;
    });
    bb.on("finish", resolve);
    bb.on("error", reject);
    req.pipe(bb);
  });

  const buffer = Buffer.concat(chunks);
  const imageFile = new File([buffer], fields.filename ?? "upload.png", {
    type: fields.mimetype ?? "image/png",
  });

  try {
    // 1️⃣ Upload image with metadata tags
    const fileRes = await pinata.upload.public
      .file(imageFile)
      .name(fields.name)
      .keyvalues({
        description: fields.description,
        price: fields.price,
      });

    const imageCid = fileRes.cid;
    const imageUri = `ipfs://${imageCid}`;

    // 2️⃣ Build structured metadata JSON
    const metadata = {
      name: fields.name,
      description: fields.description,
      image: imageUri,
      price: fields.price,
    };

    // 3️⃣ Pin JSON metadata using V2 SDK
    const jsonRes = await pinata.upload.public.json(metadata);

    const tokenURI = `ipfs://${jsonRes.cid}`;
    return res.status(200).json({ tokenURI, metadata });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: "Upload failed" });
  }
}
