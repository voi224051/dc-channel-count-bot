import "jsr:@std/dotenv/load";

const getEnv = (key: string): string => {
    const env = Deno.env.get(key);
    if (env == undefined) {
        console.error(`Can't find key ${key}!`);
        return "";
    }
    return env;
}

const getBotToken = () => getEnv("TOKEN")
const getClientID = () => getEnv("CLIENT_ID")
const getDCApiToken = () => getEnv("API_TOKEN")

export default {getBotToken, getClientID, getDCApiToken};