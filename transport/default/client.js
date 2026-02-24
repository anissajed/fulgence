export const fetchEndpoint = ({name, url}) => async (opts) => {
  const response = await fetch(url + "/" + name, {
    method: "POST",
    body: JSON.stringify(opts),
  });
  const {error, result} = await response.json();
  if (error) {
    throw new Error(error);
  }

  return result;
};
