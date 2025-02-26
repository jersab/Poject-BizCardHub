import { UnnormalizedUserUpdate } from "../interfaces/users/UnnormalizedUserUpdate";
import { User } from "../interfaces/users/User";

export function normalizeUserUpdate(values: UnnormalizedUserUpdate): Partial<User> {
    return {
        name: {
            first: values.first,
            middle: values.middle,
            last: values.last,
        },
        phone: values.phone,
        image: {
            url: values.image,
            alt: values.alt,
        },
        address: {
            state: values.state,
            country: values.country,
            city: values.city,
            street: values.street,
            houseNumber: values.houseNumber,
            zip: values.zip
        }
    };
}