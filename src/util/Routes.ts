
import Other from '../util/Other';
import Config from '../config.json';

const routes = {
    clientURL: Config.production ? "https://short.jean.host" : "http://localhost:3000",
    shortenedURLDomain: Config.production ? "https://short.jean.host" : "http://localhost:3000",
    _: "/",
    shortener: "/c",
    dashboard: "/dashboard",
    help: `${Other.discordSupportServer}`,
    privacy: "/privacy",
    terms: "/terms",
    signIn: "/accounts/signin",
    signUp: "/accounts/signup"
}

export default routes;