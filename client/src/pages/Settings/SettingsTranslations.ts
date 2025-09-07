import { Translations } from "@/hooks/useTranslation"

export const SettingsTranslations: Translations = {
    id: "settings",

    en: {
        "topbar.title": "Settings",

        "personal.settings.card.title": "Personal settings",

        "user.settings.card.title": "Account settings",
        "user.settings.description":
            "You can change your email address (e.g. in case you forget your password) and current password.",
        "user.settings.button": "Open account settings",

        "homepage.settings.card.title": "Homepage",
        "homepage.settings.description": "Which page should be opened by default when you open FoodPlanner?",

        "show.pantry.settings.card.title": "Show pantry",
        "show.pantry.settings.description":
            "You can decide whether the pantry page shall be hidden in the navigation bar." +
            " Any functionality regarding the pantry will be hidden as well.",
        "show.pantry.switch.label.true": "Pantry is shown",
        "show.pantry.switch.label.false": "Pantry is not shown",

        "standard.mealcategory.card.title": "Default meal time",
        "standard.mealcategory.description": "What time should be chosen by default when you add a new meal?",

        "standard.usergroup.card.title": "Default group for meals",
        "standard.usergroup.description": "What user group should be chosen by default when you add a new meal?",

        "system.settings.card.title": "System settings",

        "usergroups.card.title": "Manage user groups",
        "usergroups.description.1": "Here you can configure all user groups in the system. User groups can be selected when adding meals.",
        "usergroups.description.2":
            "There is a user group \"Everyone\" that every user in the system belongs to, and for each user there is an automatically created user group" +
            "just for them. You can hide user groups from the user interface that you are not using and also change a user group's icon. Furthermore, you" +
            " can create new user groups with any combination of users; these are fully configurable.",
        "usergroups.button.add": "Add new user group",

        "users.card.title": "Manage accounts",
        "users.description": "The following users have an account:",

        "version.info.card.title": "Version information",
    },

    de: {
        "topbar.title": "Einstellungen",

        "personal.settings.card.title": "Persönliche Einstellungen",

        "user.settings.card.title": "Benutzereinstellungen",
        "user.settings.description":
            "Hier kannst du deine Email-Adresse eintragen (z.B. für den Fall, dass du dein Passwort vergessen hast) und dein Passwort erneuern.",
        "user.settings.button": "Benutzereinstellungen öffnen",

        "homepage.settings.card.title": "Startseite",
        "homepage.settings.description": "Welche Seite soll standardmäßig geöffnet werden, wenn du FoodPlanner öffnest?",

        "show.pantry.settings.card.title": "Vorratskammer anzeigen",
        "show.pantry.settings.description":
            "Hier kannst du auswählen, ob die Vorratskammer in der Navigationsleiste (links bzw. unten) angezeigt" +
            " werden soll oder nicht. Damit verbundene Funktionen werden dann ebenfalls ein- oder ausgeblendet.",
        "show.pantry.switch.label.true": "Vorratskammer wird angezeigt",
        "show.pantry.switch.label.false": "Vorratskammer wird nicht angezeigt",

        "standard.mealcategory.card.title": "Standardzeit für Mahlzeiten",
        "standard.mealcategory.description": "Welche Tageszeit soll standardmäßig ausgewählt sein, wenn du eine neue Mahlzeit planst?",

        "standard.usergroup.card.title": "Standardgruppe für Mahlzeiten",
        "standard.usergroup.description": "Welche Benutzergruppe soll standardmäßig ausgewählt sein, wenn du eine neue Mahlzeit planst?",

        "system.settings.card.title": "Systemverwaltung",

        "usergroups.card.title": "Benutzergruppen verwalten",
        "usergroups.description.1": "Hier kannst du alle Benutzergruppen im System verwalten. Benutzergruppen werden bei Mahlzeiten ausgewählt.",
        "usergroups.description.2":
            "Es gibt eine Benutzergruppe \"Alle\", zu der jede*r Benutzer*in im System gehört, und für jede*n Benutzer*in gibt es" +
            " auch eine automatisch angelegte Benutzergruppe. Du kannst Benutzergruppen aus der Oberfläche ausblenden, wenn sie nicht benutzt werden, und" +
            " ihre Icons bearbeiten. Außerdem können neue Benutzergruppen mit beliebigen Benutzer*innen angelegt werden. Diese sind voll konfigurierbar.",
        "usergroups.button.add": "Neue Gruppe hinzufügen",

        "users.card.title": "Benutzer verwalten",
        "users.description": "Folgende Benutzer sind im System vorhanden:",

        "version.info.card.title": "Versionsinformationen",
    },
}
