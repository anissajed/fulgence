const taskProxy = ({task}) => {
  const proxy = new Proxy(task, {
    get: function (target, prop) {
      return (arg) => target({
        operation: prop,
        arg,
      });
    },
  });
  return proxy;
};

export const objectOrientedApi = ({api}) => {
  const proxy = new Proxy(api, {
    get: function (target, prop) {
      if (!target[prop]) return undefined;

      return taskProxy({task: target[prop]});
    },
  });
  return proxy;
};
