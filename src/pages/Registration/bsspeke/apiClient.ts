import RegistrationParams from "../Interfaces/RegistrationParams";
import { REGISTRATION_URL } from "../RegistrationConstants";
import Client from "./BSSpekeWrapper";
import { fromByteArray, toByteArray } from "base64-js";
import { AuthStages, RegistrationResponse } from "../../../state-management/auth/store";


// Executes m.enroll.bsspeke-ecc.oprf request
export function oprfRequest(client: Client, setPasswordParams: RegistrationParams["m.enroll.bsspeke-ecc.oprf"], stages: AuthStages, setLoading: (loading: boolean) => void, setPassword: (password: boolean) => void, setFeedback: React.Dispatch<React.SetStateAction<string>>, setRegistrationResponse: (regResponse: RegistrationResponse) => void) {
//TODO: Finish up adding parameters to the request from useAuthStore
    const blind = client.generateBlind();
    const blindBase64 = fromByteArray(blind);

    // // btoa is a base64 encoding function that creates a Base64-encoded ASCII string from a binary string
    console.log("Blind (base 64): ", blindBase64);
    let authBody = {
        "auth": {
            "type": "m.enroll.bsspeke-ecc.oprf",
            "session": stages.sessionId,
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
                // page["password"] = true;
                // pageUpdate({ ...page, "password": true, "loading": false });
                setPassword(true);
                setLoading(false);

                const { PArray, VArray } = client.generatePAndV(decodedSalt, setPasswordParams["phf_params"]);
                const encodedP = fromByteArray(PArray);
                const encodedV = fromByteArray(VArray);

                // Bsspeke .save request
                let authBody2 = {
                    "auth": {
                        "type": "m.enroll.bsspeke-ecc.save",
                        "session": stages.sessionId,
                        "P": encodedP,
                        "V": encodedV,
                        "phf_params": setPasswordParams.phf_params,
                    }
                }
                // pageUpdate({ ...page, "loading": true });
                setLoading(true);
                saveRequest(authBody2, setLoading, setPassword, setFeedback, setRegistrationResponse);
            }
        })
        .catch((error) => {
            console.log(error);
            setFeedback("Error: " + error);
            // pageUpdate({ ...page, "loading": false });
            setLoading(false);
        });
}

// Executes m.enroll.bsspeke-ecc.save request
function saveRequest(authBody2: any, setLoading: (loading: boolean) => void, setPassword: (password: boolean) => void, setFeedback: React.Dispatch<React.SetStateAction<string>>, setRegistrationResponse: React.Dispatch<React.SetStateAction<any>>) {
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
                // page["password"] = true;
                // pageUpdate({ ...page, "password": true, "loading": false });
                setPassword(true);
                setLoading(false);
                setRegistrationResponse(json);
            }
        })
        .catch((error) => {
            console.log("Error: ", error);
            setFeedback("Error: " + error);
            // pageUpdate({ ...page, "loading": false });
            setLoading(false);
        });
}