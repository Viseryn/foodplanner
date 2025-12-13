<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251213170650 extends AbstractMigration {
    public function getDescription(): string {
        return '';
    }

    public function up(Schema $schema): void {
        $this->addSql('CREATE TABLE meal_recipe (meal_id INT NOT NULL, recipe_id INT NOT NULL, INDEX IDX_B5820C3E639666D6 (meal_id), INDEX IDX_B5820C3E59D8A214 (recipe_id), PRIMARY KEY(meal_id, recipe_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE meal_recipe ADD CONSTRAINT FK_B5820C3E639666D6 FOREIGN KEY (meal_id) REFERENCES meal (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE meal_recipe ADD CONSTRAINT FK_B5820C3E59D8A214 FOREIGN KEY (recipe_id) REFERENCES recipe (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void {
        $this->addSql('ALTER TABLE meal_recipe DROP FOREIGN KEY FK_B5820C3E639666D6');
        $this->addSql('ALTER TABLE meal_recipe DROP FOREIGN KEY FK_B5820C3E59D8A214');
        $this->addSql('DROP TABLE meal_recipe');
    }
}
