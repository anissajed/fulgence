export default class ModuleA {
  constructor ({api}) {
    this.api = api;
  }

  async addAttributes(input) {
    console.log(`Run ModuleA.addAttributes() on chunk "${process.env.CHUNK_NAME}"`);
    const res = await this.api.b.addBCAttributes(input);
    return {...res, a: "a"};
  }
}
