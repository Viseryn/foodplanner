# FoodPlanner

## About

**FoodPlanner** is a Web App for managing your meal plans for the week, your recipes, your shopping list and your pantry
ingredients. You can find more screenshots at the bottom of the page.

TODO: Screenshots

---
## How to host and setup FoodPlanner

You need to follow these steps to host FoodPlanner.

1. Download the repository. It consists of a `/client` and an `/api` folder.
2. To set up the client, override the `VITE_API_BASE_URL` environment variable with the base path of the API (i.e. the Symfony home page).
3. You might want to modify `/client/public/`, for example the `.htaccess` file. You need to upload a default recipe image to `/client/public/img/default.jpg`
4. In the `/client` folder, run `npm install` and `npm run build`. The resulting files are in the `/dist` folder. Use the whole content of `/dist` for your 
   client.
5. To set up the (Symfony) API, override the `DATABASE_URL`, `APP_SECRET` and `APP_ENV` environment variables to your liking. The value of `CORS_ALLOW_ORIGIN` 
   should be the base path of your client.
6. In the `/api` folder, run the following commands:
   * `composer install`
   * `php bin/console doctrine:migrations:migrate`
   * `php bin/console cache:clear`


There is not much that is left to set up.
1. Open the client. You should automatically be redirected to the installation page.
2. Follow the installation steps and sign in afterward.

Enjoy using FoodPlanner!

## How to update FoodPlanner

From version v1.8.0 on, the version numbering (`v{MAJOR}.{API}.{CLIENT}`) follows this system:
- The first digit (`{MAJOR}`) signifies a major release. There will be breaking API and client changes. Refer to the release notes for update instructions.
- The middle digit (`{API}`) signifies changes to the API. All clients from an older API version might not be compatible anymore.
  - To update to a newer API version (e.g., from `v1.8.*` to `v1.9.*`), you usually need to replace all uploaded files of your server with the contents of 
    the `/api` folder (usually `/config`, `/migrations` and `/src` only). You need to run the database migrations and clear the cache analogously to the first 
    setup. Refer to the release notes for update instructions.
  - You need to update the client as well to any compatible version (see below).
- The last digit (`{CLIENT}`) signifies changes to the client only. Every client version is compatible with its corresponding API version.
  - To update to a newer client version (e.g., from `v1.8.17` to `v1.8.19`), build a new client with `npm run build` and replace all uploaded files of your 
    client by the contents of the `/client/dist` folder.

## How to use FoodPlanner

FoodPlanner can be used alone or in a household. If you want to use the app with more than one user, note the following:
1. Every user can register their own account with their own password.
2. In the Settings section, you can configure one or multiple *user groups*. Each group can have one or more users.
   By default, there is an "Everyone" group and a group for each user. Groups can also be hidden.
3. Each user can pick a favorite user group, and even a favorite meal category (breakfast, lunch, dinner).
4. When adding a new meal to the planner, you can pick the user group (not the user) the meal belongs to.

Apart from that, the app should really be self-explanatory.

---

## Contributing to FoodPlanner

Everyone is welcome to contribute to FoodPlanner. If you think of a new feature, feel free to open a new issue to
discuss your idea!

If you have a bug fix or cool new feature and want to merge it, create a pull request into the `develop` branch.

A new feature/bugfix/update should be implemented in a corresponding branch from `develop`, and ideally be linked to 
some issue, e.g. `issue-42/title-of-the-issue`.

## Planned features

Some bigger features that are planned for future versions:

- Localization, especially English (US).
- Notifications, e.g. reminders for the shopping list.
- Optimizations, e.g. generating thumbnails and improving synchronization.
- Offline support.

## Release checklist

When all tickets for a planned released have been resolved, follow these steps:
- In the repositories' GitHub Actions panel, there are two separate workflows, either for a new API release or a new client release.
  Select the API one if there are any changes in the `/api` folder.
- Either workflow will automatically create a release brunch, update all version numbers and merge the release branch into `master`
  and `develop`. On the `develop` branch, the version number will be updated to a snapshot version number.
- After the Release Workflow has finished, a new GitHub Release can be created in the Release section. Draft a new
  release from the release branch and create a corresponding tag (e.g. `v1.6.3`).
- There are no hotfix releases. Every change has to be released in a proper version.

---

## Project structure

FoodPlanner is built with React and Symfony.

### Backend

FoodPlanner's backend is built with Symfony (https://symfony.com/what-is-symfony) for PHP using the API Platform framework. All relevant files for that are 
located in the `/api/src` folder and can (basically) be divided in Entities (ApiResources), Processors and Providers. A RESTful API is exposed and a
documentation can be found at the base API url (`https://your-server-url/api`).

### Frontend

The frontend is built with React (via Vite). All corresponding files are located in the `/client/src` folder, and the entry point of
the app is `/client/src/app.tsx`, which renders the `Application` component into the root div container in the `/client/index.html`.

The `Application` component is the main component of FoodPlanner. It manages global context and sets the base layout.

In the `/src/components` folder, all shared components, like Buttons, Cards and Form Widgets, are stored.
The `/src/hooks` folder is for all custom hooks like `useApiResource`. The `/src/layouts` folder is for all components
that are related to the actual page layout, like `Sidebar` or `Topbar`. The `/src/styles` and `/src/util`
folders are for CSS and other util files.

---

## More Screenshots

### Mobile

TODO

### Dark Mode

TODO

### Desktop

TODO