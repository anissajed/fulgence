import {default as baseClient} from "fulgence/transport/client/default";

const objectOrientedRequester = ({requester}) => {
  const proxy = new Proxy({}, {
    get: function (target, prop) {
      if (prop == "then") return undefined;

      return (arg) => requester({
        operation: prop,
        arg,
      });
    },
  });
  return proxy;
};

const objectOrientedClient = ({baseClient}) => {
  const clientInstance = ({name, url}) => {
    const requester = baseClient({name, url});
    return objectOrientedRequester({requester});
  };

  const clientClass = new Proxy(class {}, {
    construct: function (target, args) {
      return clientInstance;
    },
  });
  return clientClass;
};

const newClient = objectOrientedClient({baseClient});
export default newClient;
