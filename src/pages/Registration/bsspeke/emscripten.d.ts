// Type definitions for emscripten 1.38.12 for use with emscripten compiled bsspeke code
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
  