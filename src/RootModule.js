/**
 * Class lives as long as application persists.
 */
class RootModule {
  set(module) {
    for (const key of Object.keys(module)) {
      if (key in this) {
        throw new Error(`${key} is already defined higher up in the hierarchy.`);
      }
      this[key] = module[key];
    }
  }

  unset(module) {
    for (const key of Object.keys(module)) {
      delete this[key];
    }
  }
}
export default new RootModule();
