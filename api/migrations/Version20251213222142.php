<?php 

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20251213222142 extends AbstractMigration
{
  public function getDescription(): string
    {
      return '';
    }

  public function up(Schema $schema): void
    {
      // this up() migration is auto-generated
      $this->addSql('UPDATE installation_status SET api_version = \'1.9\' WHERE id = 1');
    }
}
