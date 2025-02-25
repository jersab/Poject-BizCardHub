import { Card } from "../../interfaces/cards/Cards";
import { UnnormalizedCard } from "../../interfaces/cards/UnnormalizedCard";

export function normalizeCard(valuse: UnnormalizedCard): Card {
    return {
        title: valuse.title,
        subtitle: valuse.subtitle,
        description: valuse.description,
        phone: valuse.phone,
        email: valuse.email,
        wed: valuse.wed,
        image: {
            url: valuse.url,
            alt: valuse.alt,
        },
        address: {
            state: valuse.state,
            country: valuse.country,
            city: valuse.city,
            street: valuse.street,
            houseNumber: valuse.houseNumber,
            zip: valuse.zip,
        }
    };
}