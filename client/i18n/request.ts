import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
    const locale = await requestLocale;

    if (
        !locale ||
        !routing.locales.includes(locale as (typeof routing.locales)[number])
    ) {
        return {
            locale: routing.defaultLocale,
        };
    }

    const messages = {
        common: (await import(`../messages/${locale}/common.json`)).default,

        auth: (await import(`../messages/${locale}/auth.json`)).default,
    };

    return {
        locale,
        messages,
    };
});
