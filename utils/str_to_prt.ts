const encoder = new TextEncoder();

export function strToPtr(str: string): Deno.PointerValue {
   return Deno.UnsafePointer.of(encoder.encode(str + "\0"));
}
