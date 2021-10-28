import { returnError } from "../helpers/returnError";

const apiaudio = require("apiaudio").default;
const { Script } = apiaudio;
const apiKey = process.env.APIKEY;

export const handler = async (event) => {
  const parsedBody = JSON.parse(event?.body);

  const category = parsedBody?.category || "";

  const debug = parsedBody?.debug || false;

  //configure aflr package
  if (apiaudio.isInitialized) {
    apiaudio.reset();
  }
  try {
    apiaudio.configure({
      apiKey,
      debug,
    });
  } catch (e) {
    console.log(e);
    return returnError({
      statusCode: 500,
      message: "Problem configuring the aflr package.",
    });
  }

  let randomScript;
  try {
    console.log({ category });
    randomScript = await Script.getRandomText(category);
  } catch (e) {
    console.log(e);
    return returnError({
      statusCode: 500,
      message: "Problem retrieving the random scripts.",
    });
  }
  console.log("after master");
  // return TTS URL
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(randomScript),
  };
};
