<?php


declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250622155100 extends AbstractMigration {
    public function getDescription(): string {
        return '';
    }

    public function up(Schema $schema): void {
        $this->addSql("ALTER TABLE meal ADD date DATE NOT NULL DEFAULT '2000-01-01'");
        $this->addSql("UPDATE meal m JOIN day d ON m.day_id = d.id SET m.date = FROM_UNIXTIME(d.timestamp, '%Y-%m-%d')");
        $this->addSql('ALTER TABLE meal DROP FOREIGN KEY FK_9EF68E9C9C24126');
        $this->addSql('ALTER TABLE meal DROP INDEX IDX_9EF68E9C9C24126');
        $this->addSql('ALTER TABLE meal DROP COLUMN day_id');
        $this->addSql('DROP TABLE day');
        $this->addSql('ALTER TABLE meal CHANGE date date DATE NOT NULL');
    }
}
