import GenerationService from "./generation/generation_pb_service";
import Generation from "./generation/generation_pb";
import { grpc } from "@improbable-eng/grpc-web";
import { NodeHttpTransport } from "@improbable-eng/grpc-web-node-http-transport";
import * as dotenv from "dotenv";

dotenv.config();

grpc.setDefaultTransport(NodeHttpTransport());

// // Set up image parameters
// const imageParams = new Generation.ImageParameters();
// imageParams.setWidth(512);
// imageParams.setHeight(512);
// imageParams.addSeed(1234);
// imageParams.setSamples(1);
// imageParams.setSteps(50);

// // Use the `k-dpmpp-2` sampler
// const transformType = new Generation.TransformType();
// transformType.setDiffusion(Generation.DiffusionSampler.SAMPLER_K_DPMPP_2M);
// imageParams.setTransform(transformType);

// // Use Stable Diffusion 2.0
// const request = new Generation.Request();
// request.setEngineId("stable-diffusion-512-v2-1");
// request.setRequestedType(Generation.ArtifactType.ARTIFACT_IMAGE);
// request.setClassifier(new Generation.ClassifierParameters());

// // Use a CFG scale of `13`
// const samplerParams = new Generation.SamplerParameters();
// samplerParams.setCfgScale(13);

// const stepParams = new Generation.StepParameter();
// const scheduleParameters = new Generation.ScheduleParameters();

// // Set the schedule to `0`, this changes when doing on intital image generation
// stepParams.setScaledStep(0);
// stepParams.setSampler(samplerParams);
// stepParams.setSchedule(scheduleParameters);

// imageParams.addParameters(stepParams);
// request.setImage(imageParams);

// // Set our text prompt
// const promptText = new Generation.Prompt();
// promptText.setText(
//   "A dream of a distant galaxy, by Caspar David Friedrich, matte painting trending on artstation HQ"
// );

// request.addPrompt(promptText);

// // Authenticate using your API key, don't commit your key to a public repository!
// const metadata = new grpc.Metadata();
// metadata.set("Authorization", "Bearer " + process.env.STABILITY_KEY);

// // Create a generation client
// const generationClient = new GenerationService.GenerationServiceClient(
//   "https://grpc.stability.ai",
//   {}
// );

// // Send the request using the `metadata` with our key from earlier
// const generataion = generationClient.generate(request, metadata);

// // Set up a callback to handle data being returned
// generataion.on("data", (data) => {
//   data.getArtifactsList().forEach((artifact) => {
//     // Oh, no! We were filteed by the NSFW classifier!
//     if (
//       artifact.getType() === Generation.ArtifactType.ARTIFACT_TEXT &&
//       artifact.getFinishReason() === Generation.FinishReason.FILTER
//     ) {
//       return console.error("Your image was filtered by the NSFW classifier.");
//     }

//     // Make sure we have an image
//     if (artifact.getType() !== Generation.ArtifactType.ARTIFACT_IMAGE) return;

//     // You can convert the raw binary into a base64 string
//     // const base64Image0 = Buffer.from(artifact.getBinary() as string, 'base64')
//     const base64Image = Buffer.from(
//       new Uint8Array(artifact.getBinary() as Uint8Array).reduce(
//         (data, byte) => data + String.fromCodePoint(byte),
//         ""
//       ),
//       "base64"
//     );
//     // const base64Image = btoa(
//     //   new Uint8Array(artifact.getBinary() as Uint8Array).reduce(
//     //     (data, byte) => data + String.fromCodePoint(byte),
//     //     ""
//     //   )
//     // );

//     // Here's how you get the seed back if you set it to `0` (random)
//     const seed = artifact.getSeed();

//     // // We're done!
//     // someFunctionToCallWhenFinished({ seed, base64Image });
//   });
// });

// // Anything other than `status.code === 0` is an error
// generataion.on("status", (status) => {
//   if (status.code === 0) return;

//   console.error(
//     "Your image could not be generated. You might not have enough credits."
//   );
// });

// // const someFunctionToCallWhenFinished = ({
// //   seed,
// //   base64Image,
// // }: {
// //   seed: number;
// //   base64Image: Buffer;
// // }) => {
// //   const image = document.createElement("image");
// //   image.src = `data:image/png;base64,${base64Image}`;
// //   document.body.appendChild(image);
// // };

export const getImageFromPrompt = async (
  prompt: string,
  imgNumber?: number,
  imgHeight?: number,
  imgWidth?: number
) => {
  // let base64Image: Buffer | undefined;
  let base64Image: string | undefined;
  let seed: number | undefined;

  // Set up image parameters
  const imageParams = new Generation.ImageParameters();
  imageParams.setWidth(imgWidth ?? 512);
  imageParams.setHeight(imgHeight ?? 512);
  // imageParams.addSeed(1234);
  imageParams.setSamples(imgNumber ?? 1);
  imageParams.setSteps(50);

  // Use the `k-dpmpp-2` sampler
  const transformType = new Generation.TransformType();
  transformType.setDiffusion(Generation.DiffusionSampler.SAMPLER_K_DPMPP_2M);
  imageParams.setTransform(transformType);

  // Use Stable Diffusion 2.0
  const request = new Generation.Request();
  request.setEngineId("stable-diffusion-512-v2-1");
  request.setRequestedType(Generation.ArtifactType.ARTIFACT_IMAGE);
  request.setClassifier(new Generation.ClassifierParameters());

  // Use a CFG scale of `13`
  const samplerParams = new Generation.SamplerParameters();
  samplerParams.setCfgScale(13);

  const stepParams = new Generation.StepParameter();
  const scheduleParameters = new Generation.ScheduleParameters();

  // Set the schedule to `0`, this changes when doing on intital image generation
  stepParams.setScaledStep(0);
  stepParams.setSampler(samplerParams);
  stepParams.setSchedule(scheduleParameters);

  imageParams.addParameters(stepParams);
  request.setImage(imageParams);

  // Set our text prompt
  const promptText = new Generation.Prompt();
  promptText.setText(
    // "A dream of a distant galaxy, by Caspar David Friedrich, matte painting trending on artstation HQ"
    prompt
  );

  request.addPrompt(promptText);

  // Authenticate using your API key, don't commit your key to a public repository!
  const metadata = new grpc.Metadata();
  metadata.set("Authorization", "Bearer " + process.env.STABILITY_KEY);

  // Create a generation client
  const generationClient = new GenerationService.GenerationServiceClient(
    "https://grpc.stability.ai",
    {}
  );

  // Send the request using the `metadata` with our key from earlier
  const generataion = generationClient.generate(request, metadata);

  const result = await new Promise(
    (resolve: (value: boolean) => void, reject) => {
      // Set up a callback to handle data being returned
      generataion.on("data", (data) => {
        data.getArtifactsList().forEach((artifact) => {
          // Oh, no! We were filteed by the NSFW classifier!
          if (
            artifact.getType() === Generation.ArtifactType.ARTIFACT_TEXT &&
            artifact.getFinishReason() === Generation.FinishReason.FILTER
          ) {
            return console.error(
              "Your image was filtered by the NSFW classifier."
            );
          }

          // Make sure we have an image
          if (artifact.getType() !== Generation.ArtifactType.ARTIFACT_IMAGE)
            return;

          // You can convert the raw binary into a base64 string
          // const base64Image0 = Buffer.from(artifact.getBinary() as string, 'base64')
          // const base64Image = Buffer.from(
          // base64Image = Buffer.from(
          //   new Uint8Array(artifact.getBinary() as Uint8Array).reduce(
          //     (data, byte) => data + String.fromCodePoint(byte),
          //     ""
          //   ),
          //   "base64"
          // ).toString("base64");
          // const base64Image = btoa(
          base64Image = btoa(
            new Uint8Array(artifact.getBinary() as Uint8Array).reduce(
              (data, byte) => data + String.fromCodePoint(byte),
              ""
            )
          );

          // Here's how you get the seed back if you set it to `0` (random)
          // const seed = artifact.getSeed();
          seed = artifact.getSeed();

          if (
            typeof base64Image === "undefined" ||
            typeof seed === "undefined"
          ) {
            reject("base64Image is undefined or seed is undefined");
          }
          resolve(true);

          // // We're done!
          // someFunctionToCallWhenFinished({ seed, base64Image });
        });
      });
    }
  );

  // // Set up a callback to handle data being returned
  // generataion.on("data", (data) => {
  //   data.getArtifactsList().forEach((artifact) => {
  //     // Oh, no! We were filteed by the NSFW classifier!
  //     if (
  //       artifact.getType() === Generation.ArtifactType.ARTIFACT_TEXT &&
  //       artifact.getFinishReason() === Generation.FinishReason.FILTER
  //     ) {
  //       return console.error("Your image was filtered by the NSFW classifier.");
  //     }

  //     // Make sure we have an image
  //     if (artifact.getType() !== Generation.ArtifactType.ARTIFACT_IMAGE) return;

  //     // You can convert the raw binary into a base64 string
  //     // const base64Image0 = Buffer.from(artifact.getBinary() as string, 'base64')
  //     // const base64Image = Buffer.from(
  //     base64Image = Buffer.from(
  //       new Uint8Array(artifact.getBinary() as Uint8Array).reduce(
  //         (data, byte) => data + String.fromCodePoint(byte),
  //         ""
  //       ),
  //       "base64"
  //     );
  //     // const base64Image = btoa(
  //     //   new Uint8Array(artifact.getBinary() as Uint8Array).reduce(
  //     //     (data, byte) => data + String.fromCodePoint(byte),
  //     //     ""
  //     //   )
  //     // );

  //     // Here's how you get the seed back if you set it to `0` (random)
  //     // const seed = artifact.getSeed();
  //     seed = artifact.getSeed();

  //     // // We're done!
  //     // someFunctionToCallWhenFinished({ seed, base64Image });
  //   });
  // });

  // Anything other than `status.code === 0` is an error
  generataion.on("status", (status) => {
    if (status.code === 0) return;

    console.error(
      "Your image could not be generated. You might not have enough credits."
    );
  });

  // const someFunctionToCallWhenFinished = ({
  //   seed,
  //   base64Image,
  // }: {
  //   seed: number;
  //   base64Image: Buffer;
  // }) => {
  //   const image = document.createElement("image");
  //   image.src = `data:image/png;base64,${base64Image}`;
  //   document.body.appendChild(image);
  // };

  return {
    base64Image,
    seed,
  };
};
