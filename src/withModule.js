import {useEffect, useMemo, useState} from "react";
import React from 'react';

// Global singleton which acts as the composite module which gets injected into components.
if (!globalThis.hoc_di_module) {
  globalThis.hoc_di_module = {};
}

/**
 * Inserts a `props.module` into the component.
 * The module provides access to objects which persist outside the component scope.
 * Modules must have at least a `construct` and `destruct` method.
 * You may pass in 0 to N modules to have them constructed at this level in the component scope.
 */
export default function withModule(WrappedComponent, newModules = []) {
  return props => {
    const rootModule = globalThis.hoc_di_module;

    if (!newModules) {
      newModules = [];
    }

    if (!Array.isArray(newModules)) {
      newModules = [newModules];
    }

    const [areModulesReady, setAreModulesReady] = useState(newModules.length === 0);

    useEffect(() => {
      const createdModules = [];
      const removeRefs = [];
      const ignoredKeys = [];
      for (const newModule of newModules) {
        const [createdModule, removeRef] = newModule(rootModule);
        for (const key of Object.keys(createdModule)) {
          if (key in rootModule) {
            console.warn(`${key} is already defined higher up in the hierarchy.`);
            ignoredKeys.push(key);
          } else {
            rootModule[key] = createdModule[key];
          }
        }
        createdModules.push(createdModule);
        removeRefs.push(removeRef);
      }
      setAreModulesReady(true);

      return () => {
        for (let i = 0; i < createdModules.length; i++) {
          const createdModule = createdModules[i];
          const removeRef = removeRefs[i];
          for (const key of Object.keys(createdModule)) {
            if (!ignoredKeys.includes(key)) {
              delete rootModule[key];
            }
          }
          if (removeRef) {
            removeRef();
          }
        }
      }
    }, []);

    return useMemo(() => {
      if (!areModulesReady) {
        return null;
      }
      return <WrappedComponent {...props} module={rootModule}/>;
    }, [props, areModulesReady]);
  };
}
