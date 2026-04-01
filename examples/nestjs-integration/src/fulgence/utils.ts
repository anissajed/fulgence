const getAllMethodNames = (prototype: object): string[] => {
  const names = new Set<string>();

  let current = prototype;
  while (current && current !== Object.prototype) {
    Object.getOwnPropertyNames(current) // TODO maybe getAmmEmthodsNames is better here?
      .filter(name => name !== 'constructor' && typeof current[name] === 'function')
      .forEach(name => names.add(name));
    current = Object.getPrototypeOf(current);
  }

  return [...names];
};

export type Constructor<T = {}> = new (...args: any[]) => T;
export type ClassDecorator = <T extends Constructor>(BaseClass: T) => T;

type ProxyFn = (opts: {name: string, original: Function}) => (...args: unknown[]) => unknown;
type WithProxyMethods = (opt: {proxyFunction: ProxyFn}) => ClassDecorator;
export const withProxyMethods: WithProxyMethods = ({proxyFunction}) => (BaseClass) => {
  return class extends BaseClass {
    constructor(...args: any[]) {
      super(...args);

      const methodNames = getAllMethodNames(BaseClass.prototype);

//console.log("withProxyMethods", {methodNames});
      for (const name of methodNames) {
        const original = (this as any)[name].bind(this);

        (this as any)[name] = proxyFunction({name, original});
      }
    }
  }
};

export class ArrayDictHandler {
  dict = {};

  addForType ({type, item}) {
    this.dict[type] = this.dict[type] ?? [];
    this.dict[type].push(item);
  }

  nbTypes () {
    return Object.keys(this.dict).length;
  }

  firstOfType (type) {
    return this.dict[type][0];
  }
}
