<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20221009183550 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE recipe ADD image_id INT DEFAULT NULL, DROP image_filename');
        $this->addSql('ALTER TABLE recipe ADD CONSTRAINT FK_DA88B1373DA5256D FOREIGN KEY (image_id) REFERENCES file (id)');
        $this->addSql('CREATE INDEX IDX_DA88B1373DA5256D ON recipe (image_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE recipe DROP FOREIGN KEY FK_DA88B1373DA5256D');
        $this->addSql('DROP INDEX IDX_DA88B1373DA5256D ON recipe');
        $this->addSql('ALTER TABLE recipe ADD image_filename LONGTEXT DEFAULT NULL, DROP image_id');
    }
}
