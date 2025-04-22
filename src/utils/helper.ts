import { EMAIL_REGEX } from "../constants"

export const validateEmail = (email: string) => {
    return EMAIL_REGEX.test(email);
}