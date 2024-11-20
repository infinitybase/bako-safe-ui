function bindMethods(instance: any) {
  const methodNames = Object.getOwnPropertyNames(
    Object.getPrototypeOf(instance),
  );

  // biome-ignore lint/complexity/noForEach: <explanation>
  methodNames
    .filter(
      (methodName) =>
        methodName !== "constructor" &&
        typeof instance[methodName] === "function",
    )
    .forEach((methodName) => {
      instance[methodName] = instance[methodName].bind(instance);
    });
}

export { bindMethods };
