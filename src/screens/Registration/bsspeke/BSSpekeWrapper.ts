import RegistrationParams from "../Interfaces/RegistrationParams";

function encodeUTF8(str: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

// Class to wrap the bsspeke client and interact with emscripten compiled code
class Client {
  private ctx;

  constructor(user_id: string, server_id: string, password: string) {
    const uid_utf8 = encodeUTF8(user_id);
    const sid_utf8 = encodeUTF8(server_id);
    const pwd_utf8 = encodeUTF8(password);

    // Calling emscriten compiled bsspeke code to generate client
    this.ctx = Module.ccall("generate_client", "number", [], []);
    Module.ccall("bsspeke_client_init", "number", ["number", "string", "number", "string", "number", "string", "number"], [this.ctx, String(uid_utf8), uid_utf8.length, String(sid_utf8), sid_utf8.length, String(pwd_utf8), pwd_utf8.length]);
  }

  generateBlind(): Uint8Array {

    const blindPointer = Module.ccall("bsspeke_client_generate_blind", "number", ["array", "number"], [new Uint8Array(32), this.ctx]);
    const blind = new Uint8Array(Module.HEAPU8.buffer, blindPointer, 32);
    return blind;

  }

  generatePAndV(blind_salt: Uint8Array, passwordParams: RegistrationParams["m.enroll.bsspeke-ecc.oprf"]["phf_params"]): { PArray: Uint8Array; VArray: Uint8Array } {
    const P = Module._malloc(32);
    const V = Module._malloc(32);
    const blocks = passwordParams["blocks"];
    const iterations = passwordParams["iterations"];

    Module.ccall("bsspeke_client_generate_P_and_V", "number", ["number", "number", "array", "number", "number", "number"], [P, V, blind_salt, blocks, iterations, this.ctx]);

    const PArray = new Uint8Array(Module.HEAPU8.buffer, P, 32);
    const VArray = new Uint8Array(Module.HEAPU8.buffer, V, 32);
    Module._free(P);
    Module._free(V);

    return { PArray, VArray };
  }
}

export default Client;
