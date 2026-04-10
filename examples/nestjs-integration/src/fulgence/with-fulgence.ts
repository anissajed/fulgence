import {config} from "./config.js";
import {api_handler, initApi} from "./api.js";
import {ClassDecorator, ArrayDictHandler} from "./utils.js";

let BaseService_original_instance: any = null;
Error.stackTraceLimit = 20;

// withReplacedMethods: the returned class methods proxy BaseClass methods, each (new BaseClass).method will be replaced by replacement().method, if replacement() exists when method will be called.
export interface SpecificOnDoTaskArgInput {
  operation: string;
  arg: unknown;
};
type GetReplacement = () => ((opts: SpecificOnDoTaskArgInput) => unknown) | undefined | null;
type WithReplacedMethods = (options: {getReplacement: GetReplacement}) => ClassDecorator;
const withReplacedMethods: WithReplacedMethods = ({getReplacement}) => (BaseClass) => {
  const proxy = new Proxy(BaseClass, {
    get(target, prop, receiver) {
      const replacement = getReplacement();

      if (!replacement?.[prop]) {
        const value = Reflect.get(target, prop, receiver);
        return typeof value == 'function' ? value.bind(target) : value;
      }

      const value = Reflect.get(replacement, prop, receiver);
      return typeof value == 'function' ? value.bind(target) : value;
    },
  });

console.log("withReplacedMethods", {
  BaseClass,
  //proxy_prototypes_methods: Object.getOwnPropertyNames(Object.getPrototypeOf(new proxy())),
  BaseClass_prototypes_methods: Object.getOwnPropertyNames(Object.getPrototypeOf(new BaseClass())),
});
  return proxy;
};

type WithInstances = (options: {onInstance: (instance: any) => void}) => ClassDecorator;
const withInstances: WithInstances = ({onInstance}) => (BaseClass) => {
  const proxy = new Proxy(BaseClass, {
    construct(Target, args) {
      const instance = new Target(...args);
console.log("withInstances", {
  instance,
  Target,
  instance_prototypes_methods: Object.getOwnPropertyNames(Object.getPrototypeOf(instance)),
})
      onInstance(instance);
      return instance;
    }
  }) as any;

console.log("withInstances", {
  // proxy_prototypes_methods: Object.getOwnPropertyNames(Object.getPrototypeOf(new proxy())),
  BaseClass_prototypes_methods: Object.getOwnPropertyNames(Object.getPrototypeOf(new BaseClass())),
})
  return proxy;
};

export const instances_handler = new ArrayDictHandler();

const config_tasks_names = Object.keys(config.tasks);

const onInstanceFactory = ({name, BaseClass, onApiBuilt}) => async (instance) => {
if (name == "BaseService") {
  BaseService_original_instance = instance;

  console.log("onInstanceFactory", {
    BaseService_original_instance,
    BaseClass_vs_instance_equal: BaseClass === BaseService_original_instance,
  })
}

  if (!config_tasks_names.includes(name)) {
console.log("onInstanceFactory", {name, config_tasks_names});
    throw new Error("Unregistered task name");
  }

  instances_handler.addForType({type: name, item: instance});
  api_handler.addCallback(onApiBuilt);

  if (instances_handler.nbTypes() == config_tasks_names.length && !api_handler.get()) {
console.log("onInstanceFactory", {name, equality: true});
    const api = await initApi();
    await api_handler.set(api);
console.log("onInstanceFactory", {name, value: api_handler.get()});
  }
}

export const withFulgence = ({task_name}) => (BaseClass) => {
//console.log("withFulgence", {
//  BaseClass,
//  ownProto: Object.getOwnPropertyNames(BaseClass.prototype),
//  api: api_handler.get(),
//})
  const onInstance = onInstanceFactory({
    name: task_name,
    BaseClass,
    onApiBuilt: () => {},
  });
  const InstanceInterceptor = withInstances({onInstance})(BaseClass);

  @withReplacedMethods({
    getReplacement: () => {
      const task = api_handler.get()?.[task_name];
//console.log("getReplacement", {task_name});
      return task;
    }
  })
  class DerivedClass extends InstanceInterceptor {};

  return DerivedClass;
}
