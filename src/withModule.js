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
      const createdModules = [];
      const removeRefs = [];
      for (const newModule of newModules) {
        const [createdModule, removeRef] = newModule(rootModule);
        for (const key of Object.keys(createdModule)) {
          if (key in rootModule) {
            throw new Error(`${key} is already defined higher up in the hierarchy.`);
          }
          rootModule[key] = createdModule[key];
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
            delete rootModule[key];
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
