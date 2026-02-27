export default class ModuleC {
  constructor ({api}) {
    this.api = api;
  }

  addCAttribute(input) {
    console.log(`Run ModuleC.addCAttribute() on chunk "${process.env.CHUNK_NAME}"`);
    return {...input, c: "c"};
  }
}
