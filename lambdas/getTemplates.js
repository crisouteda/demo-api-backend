import { returnError } from "../helpers/returnError";

const apiaudio = require("apiaudio").default;
const { Sound } = apiaudio;
const apiKey = process.env.APIKEY;

export const handler = async (event) => {
  const parsedBody = JSON.parse(event?.body);

  const filters = parsedBody?.filters || {};

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

  let templates;
  try {
    console.log(Object.keys(filters).length);
    if (Object.keys(filters).length !== 0) {
      templates = await Sound.list(filters);
    } else {
      templates = await Sound.list();
    }
  } catch (e) {
    console.log(e);
    return returnError({
      statusCode: 500,
      message: "Problem retrieving the sound templates.",
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
    body: JSON.stringify(templates),
  };
};
