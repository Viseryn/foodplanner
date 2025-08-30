<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250830163042 extends AbstractMigration {
    public function getDescription(): string {
        return '';
    }

    public function up(Schema $schema): void {
        $this->addSql('ALTER TABLE installation_status CHANGE version api_version VARCHAR(64) NOT NULL');
        $this->addSql('UPDATE installation_status SET api_version = \'1.8\' WHERE id = 1');
    }
}
