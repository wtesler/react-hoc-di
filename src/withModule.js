import {useEffect, useMemo, useState} from "react";
import rootModule from "./RootModule";
import React from 'react';

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
        const moduleRef = newModule(rootModule);
        modules.push(moduleRef);
      }
      setAreModulesReady(true);

      return () => {
        for (const moduleRef of modules) {
          if (moduleRef) {
            moduleRef();
          }
        }
      }
    }, []);

    return useMemo(() => {
      if (!areModulesReady) {
        return null;
      }
      return React.createElement(WrappedComponent, Object.assign({}, props, { module: rootModule }));
    }, [props, areModulesReady]);
  };
}