## react-hoc-di


Wrap your component in `withModule` to have `props.module` injected into your components.

Objects in the module may persist outside the component scope.

Avoids needless piping of objects through the props of components.

You may pass in additional modules into `withModule` to have the lifecycle
of the given modules bound to the component.

`props.module` is a composite of all added modules.

Import looks like:

`import {withModule} from "react-hoc-di";`

Usage often looks like this:

`export default withModule(MyScreen, MyModule);`

or 

`export default withModule(MyComponent);`

or

`export default withModule(MyComponent, [MyModule1, MyModule2]);`

### Modules

Modules always call `set` and `unset` on the rootModule.

The shell of a module looks like this:

```
const MyModule = (rootModule) => {
  const module = {
  };

  return [
    module,
    () => {}
  ]
}

export default MyModule;
```

### For Developer

Remember to npm run build before deploying.
