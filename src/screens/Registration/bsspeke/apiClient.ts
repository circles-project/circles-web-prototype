import RegistrationParams from "../Interfaces/RegistrationParams";
import RegistrationProps from "../Interfaces/RegistrationProps";
import { REGISTRATION_URL } from "../RegistrationConstants";
import Client from "./BSSpekeWrapper";
import { fromByteArray, toByteArray } from "base64-js";

// Executes m.enroll.bsspeke-ecc.oprf request
export function oprfRequest(client: Client, setPasswordParams: RegistrationParams["m.enroll.bsspeke-ecc.oprf"], page: RegistrationProps, pageUpdate: React.Dispatch<React.SetStateAction<RegistrationProps>>, setFeedback: React.Dispatch<React.SetStateAction<string>>, setRegistrationResponse: React.Dispatch<React.SetStateAction<any>>) {

    const blind = client.generateBlind();
    const blindBase64 = fromByteArray(blind);

    // // btoa is a base64 encoding function that creates a Base64-encoded ASCII string from a binary string
    console.log("Blind (base 64): ", blindBase64);
    let authBody = {
        "auth": {
            "type": "m.enroll.bsspeke-ecc.oprf",
            "session": page.session_id,
            "curve": setPasswordParams.curve,
            "blind": blindBase64,
        }
    }
    console.log(authBody);
    fetch(REGISTRATION_URL, {
        method: "POST",
        body: JSON.stringify(authBody),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
        .then((response) => response.json())
        .then(json => {

            if (json.error) {
                console.log("Error: " + json.error);
                setFeedback("Error: " + json.error);
            } else {
                console.log(json);

                const decodedSalt = toByteArray(json.params["m.enroll.bsspeke-ecc.save"].blind_salt);
                page["password"] = true;
                pageUpdate({ ...page, "password": true, "loading": false });
                const { PArray, VArray } = client.generatePAndV(decodedSalt, setPasswordParams["phf_params"]);
                const encodedP = fromByteArray(PArray);
                const encodedV = fromByteArray(VArray);

                // Bsspeke .save request
                let authBody2 = {
                    "auth": {
                        "type": "m.enroll.bsspeke-ecc.save",
                        "session": page.session_id,
                        "P": encodedP,
                        "V": encodedV,
                        "phf_params": setPasswordParams.phf_params,
                    }
                }
                pageUpdate({ ...page, "loading": true });
                saveRequest(authBody2, page, pageUpdate, setFeedback, setRegistrationResponse);
            }
        })
        .catch((error) => {
            console.log(error);
            setFeedback("Error: " + error);
            pageUpdate({ ...page, "loading": false });
        });
}

// Executes m.enroll.bsspeke-ecc.save request
function saveRequest(authBody2: any, page: RegistrationProps, pageUpdate: React.Dispatch<React.SetStateAction<RegistrationProps>>, setFeedback: React.Dispatch<React.SetStateAction<string>>, setRegistrationResponse: React.Dispatch<React.SetStateAction<any>>) {
    fetch(REGISTRATION_URL, {
        method: "POST",
        body: JSON.stringify(authBody2),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
        .then((response) => response.json())
        .then(json => {

            if (json.error) {
                console.log("Error: " + json.error);
                setFeedback("Error: " + json.error);
            } else {
                console.log(json);
                page["password"] = true;
                pageUpdate({ ...page, "password": true, "loading": false });
                setRegistrationResponse(json);
            }
        })
        .catch((error) => {
            console.log("Error: ", error);
            setFeedback("Error: " + error);
            pageUpdate({ ...page, "loading": false });
        });
}