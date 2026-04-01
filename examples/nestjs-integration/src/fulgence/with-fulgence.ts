import {config} from "./config.js";
import {api_handler, initApi} from "./api.js";
import {ClassDecorator, ArrayDictHandler} from "./utils.js";

// withReplacedMethods: the returned class methods proxy BaseClass methods, each (new BaseClass).method will be replaced by replacement().method. If replacement() does not exist yet, an error will be thrown.
export interface SpecificOnDoTaskArgInput {
  operation: string;
  arg: unknown;
};
type GetReplacement = () => ((opts: SpecificOnDoTaskArgInput) => unknown) | undefined | null;
type WithReplacedMethods = (options: {getReplacement: GetReplacement}) => ClassDecorator;
const withReplacedMethods: WithReplacedMethods = ({getReplacement}) => (BaseClass) => {
  const proxy = new Proxy(BaseClass, {
    get(target, prop) {
      const replacement = getReplacement();
      if (!replacement?.[prop]) {
        return target[prop];
      }

      return replacement[prop]; // Note: no(t yet?) bind to "this" here
    }
  });

  return proxy;
};

type WithInstances = (options: {onInstance: (instance: any) => void}) => ClassDecorator;
const withInstances: WithInstances = ({onInstance}) => (BaseClass) => {
  return new Proxy(BaseClass, {
    construct(Target, args) {
      const instance = new Target(...args);
      onInstance(instance);
      return instance;
    }
  }) as any;
};

export const instances_handler = new ArrayDictHandler();

const config_tasks_names = Object.keys(config.tasks);

const onInstanceFactory = ({name, BaseClass, onApiBuilt}) => async (instance) => {
  if (!config_tasks_names.includes(name)) {
    throw new Error("Unregistered task name");
  }

  instances_handler.addForType({type: name, item: instance});
  api_handler.addCallback(onApiBuilt);

  if (instances_handler.nbTypes() == config_tasks_names.length && !api_handler.get()) {
    const api = await initApi();
    await api_handler.set(api);
  }
}

export const withFulgence = ({task_name}) => (BaseClass) => {
  const onInstance = onInstanceFactory({
    name: task_name,
    BaseClass,
    onApiBuilt: () => {},
  });
  const InstanceInterceptor = withInstances({onInstance})(BaseClass);

  @withReplacedMethods({
    getReplacement: () => {
      const task = api_handler.get()?.[task_name];
      return task;
    }
  })
  class DerivedClass extends InstanceInterceptor {};

  return DerivedClass;
}
