<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230820114443 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL, available_at DATETIME NOT NULL, delivered_at DATETIME DEFAULT NULL, INDEX IDX_75EA56E0FB7336F0 (queue_name), INDEX IDX_75EA56E0E3BD61CE (available_at), INDEX IDX_75EA56E016BA31DB (delivered_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE meal_category DROP standard');
        $this->addSql('ALTER TABLE settings ADD standard_user_group_id INT DEFAULT NULL, ADD standard_meal_category_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE settings ADD CONSTRAINT FK_E545A0C51D47EF25 FOREIGN KEY (standard_user_group_id) REFERENCES user_group (id)');
        $this->addSql('ALTER TABLE settings ADD CONSTRAINT FK_E545A0C5F0569DF9 FOREIGN KEY (standard_meal_category_id) REFERENCES meal_category (id)');
        $this->addSql('CREATE INDEX IDX_E545A0C51D47EF25 ON settings (standard_user_group_id)');
        $this->addSql('CREATE INDEX IDX_E545A0C5F0569DF9 ON settings (standard_meal_category_id)');
        $this->addSql('ALTER TABLE user_group DROP standard');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE messenger_messages');
        $this->addSql('ALTER TABLE meal_category ADD standard TINYINT(1) NOT NULL');
        $this->addSql('ALTER TABLE settings DROP FOREIGN KEY FK_E545A0C51D47EF25');
        $this->addSql('ALTER TABLE settings DROP FOREIGN KEY FK_E545A0C5F0569DF9');
        $this->addSql('DROP INDEX IDX_E545A0C51D47EF25 ON settings');
        $this->addSql('DROP INDEX IDX_E545A0C5F0569DF9 ON settings');
        $this->addSql('ALTER TABLE settings DROP standard_user_group_id, DROP standard_meal_category_id');
        $this->addSql('ALTER TABLE user_group ADD standard TINYINT(1) DEFAULT NULL');
    }
}
