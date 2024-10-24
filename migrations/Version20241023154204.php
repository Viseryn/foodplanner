<?php 

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20241023154204 extends AbstractMigration
{
  public function getDescription(): string
    {
      return '';
    }

  public function up(Schema $schema): void
    {
      // this up() migration is auto-generated, please modify it to your needs
      $this->addSql('UPDATE installation_status SET version = \'v1.6.6\' WHERE id = 1');
    }

  public function down(Schema $schema): void
    {
      // this down() migration is auto-generated, please modify it to your needs
      $this->addSql('UPDATE installation_status SET version = \'v1.6.5\' WHERE id = 1');
    }
}
