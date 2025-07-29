/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "multiparty" {
  interface Form {
    parse(
      req: any,
      callback: (err: Error | null, fields: any, files: any) => void
    ): void;
  }
  const form: { new (): Form };
  export = form;
}
