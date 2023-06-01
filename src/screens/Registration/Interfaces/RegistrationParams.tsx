interface RegistrationParams {
    "m.enroll.bsspeke-ecc.oprf": {
        curve: string,
        hash_function: string,
        phf_params: {
            name: string,
            blocks: number,
            iterations: number,
        }
    }
    "m.enroll.password": {
        minimum_length: number;
    }
    "m.login.terms": {
        policies: [
            {
                en: {
                    markdown_url: string,
                    name: string,
                    url: string,
                }
                name: string,
                version: string
            },
            {
                en: {
                    markdown_url: string,
                    name: string,
                    url: string,
                }
                name: string,
                version: string
            }
        ];
    }
}

export default RegistrationParams;