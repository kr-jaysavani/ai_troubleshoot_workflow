
import { NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(req:Request) {
    // Simulate processing delay
    // await new Promise(resolve => setTimeout(resolve, 1500));
    //INTEGRATE ROBOFLOW
     const workspaceName = "learning-sx9ew";
    const workflowId = "custom-workflow-2"
    const request = await req.json();
    const inputData = request.inputData;
    if(!inputData) {
      return NextResponse.json({ error: 'No input data provided'}, { status: 400})
    }
    const imageResponse = await fetch(inputData.image);
      if (!imageResponse.ok) {
        return NextResponse.json({ error: "Failed to fetch Image"}, { status: 400})
      }                                                  

      const originalBuffer = Buffer.from(
        await imageResponse.arrayBuffer()
      );

      const compressedBuffer = await sharp(originalBuffer)
        .resize({
          width: 640,
          height: 640,
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({
          quality: 70,
          mozjpeg: true,
        })
        .toBuffer();

      const base64Image = compressedBuffer.toString("base64");

      const base64SizeKB = (base64Image.length * 0.75) / 1024;
      if (base64SizeKB > 1300) {
        return {
          error: `Compressed image too large (${Math.round(
            base64SizeKB
          )} KB). Reduce size.`,
        };
      }


      //   // Check if input is a URL or base64


      let url;
      if (process.env.IS_ROBOFLOW_LOCAL === "true") {
        url = `https://zfpjfyxnxnaon7ittmpqmb5s7i.srv.us/${workspaceName}/${workflowId}`;
      } else {
        url = `https://detect.roboflow.com/infer/workflows/${workspaceName}/${workflowId}`;
      }

      const payload = {
        api_key: process.env.ROBOFLOW_API_KEY,
        inputs: {
          image: {
            type: "base64",
            value: base64Image,
          },
          parameter: "some-value"
        },
      };

      const response = await fetch(`${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          //    "Authorization": "Bearer " + process.env.ROBOFLOW_API_KEY,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json({ error: errorText}, { status: 400})
      }
      const data = await response.json();

    // Mock response as requested
    return NextResponse.json(data?.outputs[0]?.predictions?.predictions || []);
}
                                           