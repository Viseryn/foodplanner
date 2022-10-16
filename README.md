# foodplanner

To deploy the foodplanner app, follow these steps:


Override db credentials in .env.local.

Import SQL backup to production database.

Point root directory to /foodplanner/public/.

Run 'npm install' to install dependencies.

Run 'npm run watch' to build css/js files.

Run 'composer dump-env prod'.

Run 'php bin/console cache:clear'.
