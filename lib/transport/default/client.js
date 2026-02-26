export const clientFactory = ({name, url}) => async (body = "", fetch_opts = {}) => {
  const response = await fetch(url + "/" + name, {
    ...fetch_opts,
    method: "POST",
    body: JSON.stringify(body),
  });
  const result = await response.json();

  return result;
};
