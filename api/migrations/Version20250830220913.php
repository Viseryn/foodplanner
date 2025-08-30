<?php 

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250830220913 extends AbstractMigration
{
  public function getDescription(): string
    {
      return '';
    }

  public function up(Schema $schema): void
    {
      // this up() migration is auto-generated
      $this->addSql('UPDATE installation_status SET api_version = \'1.8\' WHERE id = 1');
    }
}
