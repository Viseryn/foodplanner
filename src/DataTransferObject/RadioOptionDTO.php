<?php namespace App\DataTransferObject;

class RadioOptionDTO implements FormOptionFieldDTO
{
    private ?string $id;
    private ?string $label;
    private ?string $icon;
    private ?bool $checked;
    private ?string $value;

    public function __construct(
        ?string $id,
        ?string $label,
        ?string $icon,
        ?bool $checked,
        ?string $value,
    ) {
        $this->id = $id;
        $this->label = $label;
        $this->icon = $icon;
        $this->checked = $checked;
        $this->value = $value;
    }

    public function getId(): ?string
    {
        return $this->id;
    }

    public function getLabel(): ?string
    {
        return $this->label;
    }

    public function getIcon(): ?string
    {
        return $this->icon;
    }

    public function getChecked(): ?bool
    {
        return $this->checked;
    }

    public function getValue(): ?string
    {
        return $this->value;
    }
}
