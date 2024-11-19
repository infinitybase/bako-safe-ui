import { hexlify } from "fuels";

import { fromBase64, hexToASCII } from "./bytes";
import { getSignature, sha256 } from "./crypto";
import { splitCLientData } from "bakosafe";

export async function signChallange(
  id: string,
  challenge: string,
  publicKey?: string,
) {
  const challangeBytesInASCII = hexToASCII(challenge);

  const authentication = await navigator.credentials.get({
    publicKey: {
      challenge: fromBase64(challenge.slice(2)),
      rpId: window.location.hostname,
      allowCredentials: [
        {
          id: fromBase64(id),
          type: "public-key",
          transports: ["hybrid", "internal"],
        },
      ],
      userVerification: "required",
      timeout: 60000,
    },
  });

  const response = (authentication as any).response;
  const authData = new Uint8Array(response.authenticatorData);
  const clientHash = await sha256(response.clientDataJSON);
  const digest = await sha256(new Uint8Array([...authData, ...clientHash]));

  return {
    ...getSignature(response.signature, digest, publicKey),
    ...splitCLientData(response.clientDataJSON, challangeBytesInASCII),
    authData: hexlify(authData),
  };
}
