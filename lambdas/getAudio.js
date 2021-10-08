import { returnError } from "../helpers/returnError";

const apiaudio = require("apiaudio").default;

const apiKey = process.env.APIKEY;

export const handler = async (event) => {
  const parsedBody = JSON.parse(event?.body);

  const scriptText = parsedBody?.scriptText || {};
  const voice = parsedBody?.voice || {};
  const soundTemplate = parsedBody?.soundTemplate || {};

  const debug = parsedBody?.debug || false;

  //configure aflr package
  if (apiaudio.isInitialized()) {
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

  let voices;
  try {
    if (scriptText) {
      const script = await apiaudio.Script.create({ scriptText });
      apiaudio.Speech.create({ scriptId: script["scriptId"], voice: voice });
      const response = apiaudio.Mastering.create({
        scriptId: script["scriptId"],
        soundTemplate: soundTemplate,
      });
      return response;
    }
  } catch (e) {
    console.log(e);
    return returnError({
      statusCode: 500,
      message: "Problem retrieving the voices.",
    });
  }

  // return TTS URL
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(voices),
  };
};
