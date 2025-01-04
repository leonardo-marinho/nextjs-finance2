interface MetadataType {
  argName: string;
  parameterIndex: number;
}

const Args = (argName: string) => {
  return function (
    target: Record<string, MetadataType[]>,
    propertyKey: string,
    parameterIndex: number,
  ): void {
    const existingArgsMetadata: MetadataType[] =
      target?.[`${propertyKey}}`] || [];
    existingArgsMetadata.push({ argName, parameterIndex } as MetadataType);
    target[`__args_${propertyKey}`] = existingArgsMetadata;
  };
};

export default Args;
