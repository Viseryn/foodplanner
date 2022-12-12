# foodplanner

To deploy the foodplanner app, follow these steps in order (!):


Override db credentials in .env.local.

Point root directory to /foodplanner/public/.

Run 'npm install' to install dependencies.

Run 'npm run watch' to build css/js files.

Run 'composer dump-env prod'.

Run 'php bin/console cache:clear'.

Import SQL backup (foodplanner.sql) to production database.

Open the app and go to the Registration page. You should create your Main User with a strong password.

Go to /api/install for the installation procedure, which will give your account admin rights and create a UserGroup. The installation file will self-destruct.

You can now create Users and UserGroups to your liking.

Enjoy using FoodPlanner!