# FoodPlanner

Current version: v1.3.1b

## About

**FoodPlanner** is a Web App for managing your meal plans for the week, your recipes, your shopping list and your pantry ingredients. You can find more screenshots at the bottom of the page.

<img src="https://foodplanner.yusel.net/img/screenshots/mobile-8.png" width="200" /> <img src="https://foodplanner.yusel.net/img/screenshots/mobile-1.png" width="200" />

## Project structure

FoodPlanner is built with TypeScript and React for the frontend and with PHP and Symfony for the backend.

### Frontend 

All TypeScript files (i.e., all UI related files) are put in the `assets` folder. The entrypoint of the app is `/assets/app.tsx`, which just renders the `App` component into the root div container in the default template (which is explained later). 

The `App` component is the main component of FoodPlanner and is located in `/assets/layouts/`. It manages global state, such as recipes, meals, etc., and fetches the data using the `useFetch` hook. It also manages the configurations for the sidebar (i.e., the navigation bar) and the topbar (the secondary navigation). The most important part however is the routing. In the `BrowserRouter` component, the different page components are displayed depending on the current browser URL. Each page component is in the folder `/assets/pages/`. For example, on the route `.../foodplanner/shoppinglist`, the component `/assets/pages/ShoppingList/ShoppingList.tsx` is rendered. Each page component gets the global state passed as props.

In the `/assets/components/` folder, all shared components, like Buttons, Cards and Form Widgets, are stored. The `/assets/hooks/` folder is for all custom hooks like `useFetch`. The `/assets/layouts/` folder is for all components that are related to the actual page layout, like `App`, `Sidebar` or `Topbar`. The `/assets/styles/` and `/assets/util/` folders are for CSS and other util files.

Note that in the `/assets/` folder, there is also a `types.d.ts` file which contains all type definitions for more complex objects.

### Backend

The most important files for the backend are stored in the `src` folder. Since the App runs on Symfony, the project structure is as one would expect from a Symfony App. In the `/src/Controller/` folder, all API controllers are stored. Note that `DefaultController.php` is actually matching _every route_ and renders a template file called `/templates/default.html.twig`. This is the basic HTML scaffolding for every page and contains the meta data, loads necessary assets (e.g. `app.tsx`, all done by Webpack Encore) and provides a single div. This is the div mentioned earlier that the React components are being rendered into.

Since every route is managed by the `DefaultController.php`, the React App can now freely decide what to render based on the route.

Every kind of data, be it a meal, a recipe or even an ingredient, is stored in the database. Each of these entities are modelled by a class in the `/src/Entity/` folder. The Doctrine ORM is responsible for the connection between database tables and PHP objects.

The `/src/Service/` folder is the place for all util classes and (most of) the business logic, since the controllers should aim to have as few logic as possible.

## Deploying FoodPlanner

To deploy the FoodPlanner app, follow these steps in order:

1. Create a file called `.env.local` in the root folder. Override the db credentials found in `.env`. Set `APP_ENV=prod`. (See Symfony Documentation for details.)
2. Point the root directory of your webserver to `/foodplanner/public/`. This is the output folder for all assets. Publically available images can be uploaded to this directory.
3. Run `npm install` to install dependencies.
4. Run `npm run watch` to build the CSS/JavaScript files. They should be in the `/public/build/` folder. (If not, check your TypeScript and Webpack Encore configurations.)
5. Run `composer dump-env prod`. This should produce a file called `.env.local.php`.
6. Run `php bin/console cache:clear`.
7. Import the SQL backup (`foodplanner.sql`) to your production database.
8. Open the app on your webserver and go to the registration page. There should be a link in the sidebar drawer, or just visit `.../foodplanner/register`. You should create your main user with a strong password. **Do not** sign in yet.
9. Go to `.../foodplanner/api/install` for the installation procedure, which will give your account admin rights and create a default UserGroup. The installation file will self-destruct.
10. You can now sign in or create more users. In the settings, you can add more UserGroups to your liking. Note that new users need to be given admin rights as well. As of v1.3.1, there is no way to do this except adding the role `ROLE_ADMIN` to the user in the database entry.

Enjoy using FoodPlanner!

## More Screenshots

### Mobile

<img src="https://foodplanner.yusel.net/img/screenshots/mobile-1.png" width="200" /> <img src="https://foodplanner.yusel.net/img/screenshots/mobile-2.png" width="200" /> <img src="https://foodplanner.yusel.net/img/screenshots/mobile-3.png" width="200" /> <img src="https://foodplanner.yusel.net/img/screenshots/mobile-4.png" width="200" /> <img src="https://foodplanner.yusel.net/img/screenshots/mobile-5.png" width="200" /> <img src="https://foodplanner.yusel.net/img/screenshots/mobile-6.png" width="200" /> <img src="https://foodplanner.yusel.net/img/screenshots/mobile-7.png" width="200" /> <img src="https://foodplanner.yusel.net/img/screenshots/mobile-8.png" width="200" />

### Dark Mode

<img src="https://foodplanner.yusel.net/img/screenshots/mobile-dark-1.png" width="200" /> <img src="https://foodplanner.yusel.net/img/screenshots/mobile-dark-2.png" width="200" />

### Desktop

<img src="https://foodplanner.yusel.net/img/screenshots/desktop-1.png" width="400" /> <img src="https://foodplanner.yusel.net/img/screenshots/desktop-dark-1.png" width="400" /> <img src="https://foodplanner.yusel.net/img/screenshots/desktop-dark-2.png" width="400" />
