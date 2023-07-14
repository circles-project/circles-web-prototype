declare namespace Module {
    function ccall(
      ident: string,
      returnType: string,
      argTypes: string[],
      args: any[]
    ): any;
    const HEAPU8: any;
    function _malloc(size: number): number;
    function _free(ptr: number): void;
  }
  