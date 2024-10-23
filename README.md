# FoodPlanner

Current version: v1.6.7-snapshot

---

## About

**FoodPlanner** is a Web App for managing your meal plans for the week, your recipes, your shopping list and your pantry
ingredients. You can find more screenshots at the bottom of the page.

<img src="https://foodplanner.yusel.net/img/screenshots/mobile-8.png" width="200" alt="" /> <img src="https://foodplanner.yusel.net/img/screenshots/mobile-1.png" width="200" alt="" />

---
## How to install and setup FoodPlanner

You need to follow these steps to install FoodPlanner.

1. Download the repository in your project root folder.
2. Create a file `.env.local` in the project root folder. Override the db credentials found in `.env`. If you want to
   install the app on your production server, set `APP_ENV=prod`. (See Symfony Documentation.)
3. Your webserver should point to `/public/`. This is the folder where all publically available assets, i.e.
   JavaScript files, images, etc. are located.
4. Run `composer install` and `npm install` to install dependencies.
5. Run `npm run watch` to build the CSS/JavaScript files. They should appear in `/public/build/`. If not, check the
   TypeScript and Webpack Encore configurations.
6. If you want to install the app on your production server, run `composer dump-env prod`, which will produce a file 
   called `.env.local.php`.
7. Run `php bin/console cache:clear`.
8. Run `php bin/console doctrine:migrations:migrate`.
9. In a development environment, run `symfony server:start` to run the app.

There is not much that is left to set up.
1. Open the app. You should automatically be redirected to the installation page, located at `https://localhost/install`.
2. Follow the installation steps and sign in afterward.

Enjoy using FoodPlanner!

## How to update FoodPlanner
If there is a newer version available in the Release section, download the files and override everything in your project
folder. Usually it should be sufficient to build the new CSS/JS files with `npm run watch` and to migrate new migrations
with `php bin/console doctrine:migrations:migrate`. If there are any issues, try clearing the cache.

When updating from a version lower than v1.6 to v1.6, all image files for recipes will be renamed and reuploaded, so it
might be a good idea to create a backup of the image folder beforehand.

Also, note that v1.6.1 introduces a new migration `Version20230101000000.php` that replaces the SQL file with the 
basic database setup of earlier versions. If there are problems with migrating, consider clearing the database first,
migrating and manually re-inserting the previous data.

## How to use FoodPlanner

FoodPlanner can be used alone or in a household. If you want to use the app with more than one user, note the following:
1. Every user can register their own account with their own password.
2. In the Settings section, you can configure one or multiple *user groups*. Each group can have one or more users.
   For example, you can set up a group "Everyone" and groups for each individual person.
3. Each user can pick a favorite user group, and even a favorite meal category (breakfast, lunch, dinner).
4. When adding a new meal to the planner, you can pick the user group (not the user) the meal belongs to.

Apart from that, the app should really be self-explanatory.

---

## Contributing to FoodPlanner

Everyone is welcome to contribute to FoodPlanner. If you think of a new feature, feel free to open a new issue to
discuss your idea! There is a JIRA board for current open tasks in the project, see
https://viseryn.atlassian.net/jira/software/projects/FP/boards/1.

If you have a bug fix or cool new feature and want to merge it, create a pull request into the `develop` branch.

A new feature/bugfix/update should be implemented in a corresponding branch from `develop`, and ideally be linked to 
some JIRA ticket, e.g. `ticket/FP-xx/title-of-the-jira-ticket`.

## Planned features

See https://viseryn.atlassian.net/jira/software/projects/FP/boards/1 for all planned features and bugfixes. Among them:

- Localization, especially English (US).
- Notifications, e.g. reminders for the shopping list.
- Optimizations, e.g. generating thumbnails and improving synchronization.

## Release checklist

When all tickets for a planned released have been resolved, follow these steps:

- In the repositories' GitHub Actions panel, run the "Release Workflow". Make sure that the three required version
  numbers (last version number, new version number, next snapshot version number) are correct.
- The workflow will automatically create the release branch, update all version numbers and create the corresponding
  database migrations. After that, the release branch will automatically be merged into the `master` and `develop`
  branches. On the `develop` branch, the version number will be updated to the next snapshot version number.
- After the Release Workflow has finished, a new GitHub Release can be created in the Release section. Draft a new
  release from the release branch and create a corresponding tag (e.g. `v1.6.3`).
- Hotfixes should **not** be merged into the release branch, but the `develop` branch.
  If a hotfix is merged, then a new release (e.g. `v1.6.3-hotfix.1`) needs to be built with the same steps as above.

---

## Project structure

FoodPlanner is built with React and Symfony.

### Backend

FoodPlanner's backend is built on Symfony (https://symfony.com/what-is-symfony) for PHP. All relevant files for that are 
located in the `src` folder and can basically be divided in Controllers, Entities and Services.

#### Controllers
Each controller class represents a collection of APIs for one entity.
For example, the `RecipeController` defines RESTful APIs for GET (a list of all recipes), POST (for adding new recipes),
and so on. Each method represents one API endpoint.
One exception is the `DefaultController`, whose only task is to route every request (except API requests) to the 
React frontend.

#### Entities
Every entity class is linked to a database table and kept sync via Doctrine ORM. If an entity is supposed to be made
accessible for an API, there should be a corresponding data transfer object (DTO) that defines in a controlled way what
will be visible. Each entity also has a corresponding repository class with standard methods to retrieve data from the 
database. Some entities might have a form type class; see Symfony documentation.

#### Services
Service classes provide utility methods for controller classes and therefore contain most of the business logic.

### Frontend

The frontend is built with React. All corresponding files are located in the `/assets/` folder, and the entry point of
the app is `/assets/app.tsx`, which renders the `App` component into the root div container in the default template,
which is loaded by the `DefaultController`.

The `App` component is the main component of FoodPlanner and is located in `/assets/layouts/`. It manages global state,
such as recipes, meals, etc., and fetches the data using the `useFetch` hook. It also manages the configurations for the
sidebar (i.e., the navigation bar) and the topbar (the secondary navigation). The most important part however is the
routing. In the `BrowserRouter` component, the different page components are displayed depending on the current browser
URL. Each page component is in the folder `/assets/pages/`. For example, on the route `https://localhost/shoppinglist`,
the component `/assets/pages/ShoppingList/ShoppingList.tsx` is rendered. Each page component gets the global state
passed as props.

In the `/assets/components/` folder, all shared components, like Buttons, Cards and Form Widgets, are stored.
The `/assets/hooks/` folder is for all custom hooks like `useFetch`. The `/assets/layouts/` folder is for all components
that are related to the actual page layout, like `App`, `Sidebar` or `Topbar`. The `/assets/styles/` and `/assets/util/`
folders are for CSS and other util files.

Note that in the `/assets/` folder, there is also a `types.d.ts` file which contains all type definitions for more
complex objects.

---

## More Screenshots

### Mobile

<img src="https://foodplanner.yusel.net/img/screenshots/mobile-1.png" width="200" alt="" /> <img src="https://foodplanner.yusel.net/img/screenshots/mobile-2.png" width="200" alt="" /> <img src="https://foodplanner.yusel.net/img/screenshots/mobile-3.png" width="200" alt="" /> <img src="https://foodplanner.yusel.net/img/screenshots/mobile-4.png" width="200" alt="" /> <img src="https://foodplanner.yusel.net/img/screenshots/mobile-5.png" width="200" alt="" /> <img src="https://foodplanner.yusel.net/img/screenshots/mobile-6.png" width="200" alt="" /> <img src="https://foodplanner.yusel.net/img/screenshots/mobile-7.png" width="200" alt="" /> <img src="https://foodplanner.yusel.net/img/screenshots/mobile-8.png" width="200" alt="" />

### Dark Mode

<img src="https://foodplanner.yusel.net/img/screenshots/mobile-dark-1.png" width="200" alt="" /> <img src="https://foodplanner.yusel.net/img/screenshots/mobile-dark-2.png" width="200" alt="" />

### Desktop

<img src="https://foodplanner.yusel.net/img/screenshots/desktop-1.png" width="400" alt="" /> <img src="https://foodplanner.yusel.net/img/screenshots/desktop-dark-1.png" width="400" alt="" /> <img src="https://foodplanner.yusel.net/img/screenshots/desktop-dark-2.png" width="400" alt="" />
