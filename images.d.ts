declare module '*.svg' {
  const content: React.FunctionComponent<
    React.SVGAttributes<SVGElement> & {testID?: string}
  >;
  export default content;
}
