import {useEffect, useMemo, useState} from "react";
import rootModule from "./Internal/RootModule";

/**
 * Inserts a `props.module` into the component.
 * The module provides access to objects which persist outside the component scope.
 * Modules must have at least a `construct` and `destruct` method.
 * You may pass in 0 to N modules to have them constructed at this level in the component scope.
 */
export default function withModule(WrappedComponent, newModules = []) {
  return props => {
    if (!newModules) {
      newModules = [];
    }

    if (!Array.isArray(newModules)) {
      newModules = [newModules];
    }

    const [areModulesReady, setAreModulesReady] = useState(newModules.length === 0);

    useEffect(() => {
      const modules = [];
      for (const newModule of newModules) {
        const module = new newModule(rootModule);
        module.construct();
        modules.push(module);
      }
      setAreModulesReady(true);

      return () => {
        for (const module of modules) {
          module.destruct();
        }
      }
    }, []);

    const content = useMemo(() => {
      if (!areModulesReady) {
        return null;
      }
      return <WrappedComponent {...props} module={rootModule}/>;
    }, [props, areModulesReady]);

    return content;
  };
}
