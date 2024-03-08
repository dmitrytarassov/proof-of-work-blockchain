export function postJson(
  url: string,
  data: {
    [key: string]: unknown;
  }
) {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}
