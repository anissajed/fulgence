const fetchWrapper = (url) => async (opts) => {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(opts),
  });
  const {error, result} = await response.json();
  if (error) {
    throw new Error(error);
  }

  return result;
};

export default fetchWrapper;
