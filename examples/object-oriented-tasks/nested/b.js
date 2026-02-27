export default class ModuleB {
  constructor ({api}) {
    this.api = api;
  }

  async addBCAttributes(input) {
    console.log(`Run ModuleB.addBCAttributes() on chunk "${process.env.CHUNK_NAME}"`);
    const res = await this.api.c.addCAttribute(input);
    return {...res, b: "b"};
  }
}
