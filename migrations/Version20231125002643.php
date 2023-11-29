<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231125002643 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user_group ADD readonly TINYINT(1) NOT NULL, ADD position INT NOT NULL, ADD hidden TINYINT(1) NOT NULL');
        $this->addSql('UPDATE user_group SET position = id');
        $this->addSql('UPDATE user_group SET hidden = false');
        $this->addSql('INSERT INTO user_group (name, position, icon, readonly, hidden) VALUES (\'Alle\', 0, \'diversity_1\', true, false)');
        $this->addSql('INSERT INTO user_group (name, position, icon, readonly, hidden) SELECT user.username, (SELECT MAX(position) FROM user_group) + ROW_NUMBER() OVER (ORDER BY user.id), \'face\', true, false FROM user');
        $this->addSql('INSERT INTO user_group_user (user_group_id, user_id) SELECT user_group.id, user.id FROM user_group JOIN user ON user_group.name = user.username WHERE user_group.readonly = true');
        $this->addSql('INSERT INTO user_group_user (user_group_id, user_id) SELECT user_group.id, user.id FROM user JOIN user_group ON user_group.position = 0');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user_group DROP readonly, DROP position, DROP hidden');
    }
}
