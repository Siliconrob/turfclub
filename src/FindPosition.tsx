import {API} from "./API.tsx";

const GeoCoderUrl = "https://geocode.search.hereapi.com/v1/geocode";

export async function findPosition(inputText: string) {
  const searchBy = {
    q: inputText,
    apiKey: API.HERE_API_KEY,
    limit: 1,
  };

  const searchUrl = `${GeoCoderUrl}?${new URLSearchParams(searchBy as unknown as Record<string, string>)}`;
  const response = await fetch(searchUrl);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
  const data = await response.json();
  console.log(data);
  return data?.items?.shift();
}