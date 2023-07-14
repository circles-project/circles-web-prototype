import { create } from "zustand";

export interface AuthStages {
    sessionId: number;
    termsAccepted: boolean;
    username: string;
    email: boolean;
    correctCode: boolean;
    password: boolean;
    loading: boolean;
}

export interface RegistrationResponse {
    user_id: string;
    home_server: string;
    access_token: string;
    device_id: string;
}

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

interface AuthStore {
    stages: AuthStages;
    registrationParams: RegistrationParams;
    registrationResponse: RegistrationResponse;
    isRegistering: boolean;
    setSessionId: (sessionId: number) => void;
    setTermsAccepted: (termsAccepted: boolean) => void;
    setUsername: (username: string) => void;
    setEmail: (email: boolean) => void;
    setCorrectCode: (correctCode: boolean) => void;
    setPassword: (password: boolean) => void;
    setLoading: (loading: boolean) => void;
    setRegistrationParams: (regParams: RegistrationParams) => void;
    setRegistrationResponse: (regResponse: RegistrationResponse) => void;
    setIsRegistering: (isRegistering: boolean) => void;
    reset: () => void;
}

const useAuthStore = create<AuthStore>(
    (set) => ({
        stages: {
            sessionId: 0,
            termsAccepted: false,
            username: "",
            email: false,
            correctCode: false,
            password: false,
            loading: false,
        },
        registrationParams: {} as RegistrationParams,
        registrationResponse: {} as RegistrationResponse,
        isRegistering: false,
        setSessionId: (sessionId: number) => set((state) => ({ stages: { ...state.stages, sessionId: sessionId } })),
        setTermsAccepted: (termsAccepted: boolean) => set((state) => ({ stages: { ...state.stages, termsAccepted: termsAccepted } })),
        setUsername: (username: string) => set((state) => ({ stages: { ...state.stages, username: username } })),
        setEmail: (email: boolean) => set((state) => ({ stages: { ...state.stages, email: email } })),
        setCorrectCode: (correctCode: boolean) => set((state) => ({ stages: { ...state.stages, correctCode: correctCode } })),
        setPassword: (password: boolean) => set((state) => ({ stages: { ...state.stages, password: password } })),
        setLoading: (loading: boolean) => set((state) => ({ stages: { ...state.stages, loading: loading } })),
        setRegistrationParams: (regParams: RegistrationParams) => set(() => ({ registrationParams: regParams })),
        setRegistrationResponse: (regResponse: RegistrationResponse) => set(() => ({ registrationResponse: regResponse })),
        setIsRegistering: (isRegistering: boolean) => set(() => ({ isRegistering: isRegistering })),
        reset: () =>
            set(() => ({
                stages: {
                    sessionId: 0,
                    termsAccepted: false,
                    username: "",
                    email: false,
                    correctCode: false,
                    password: false,
                    loading: false,
                },
            }))
    }),
);

export default useAuthStore;
