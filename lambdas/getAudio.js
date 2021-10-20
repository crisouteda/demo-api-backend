import { returnError } from "../helpers/returnError";

const apiaudio = require("apiaudio").default;

const apiKey = process.env.APIKEY;

export const handler = async (event) => {
  const parsedBody = JSON.parse(event?.body);
  console.log("parsedBody", parsedBody);

  const scriptText = parsedBody?.scriptText || "Hello World";
  const voice = parsedBody?.voice || "linda";
  const soundTemplate = parsedBody?.soundTemplate || "copacabana";
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

  try {
    const script = await apiaudio.Script.create({ scriptText });
    await apiaudio.Speech.create({
      scriptId: script["scriptId"],
      voice,
    });
    const response = await apiaudio.Mastering.create({
      scriptId: script["scriptId"],
      soundTemplate: soundTemplate,
    });
    console.log({ response });
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(response),
    };
  } catch (e) {
    console.log(e);
    return returnError({
      statusCode: 500,
      message: "Problem mastering the audio.",
    });
  }
};
