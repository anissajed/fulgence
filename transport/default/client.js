export const clientFactory = ({name, url}) => async (body = "", fetch_opts = {}) => {
  const response = await fetch(url + "/" + name, {
    method: "POST",
    ...fetch_opts,
    body: JSON.stringify(body),
  });
  const {error, result} = await response.json();
  if (error) {
    throw new Error(error);
  }

  return result;
};
