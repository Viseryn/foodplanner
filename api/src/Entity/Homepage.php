<?php

namespace App\Entity;

enum Homepage: string {
    case PLANNER = "PLANNER";
    case RECIPES = "RECIPES";
    case SHOPPING_LIST = "SHOPPING_LIST";
    case PANTRY = "PANTRY";
}
