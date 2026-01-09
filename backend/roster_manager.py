"""
backend/roster_manager.py

Standalone roster utilities (Python).

This file is NOT part of the Node backend runtime. It can be used independently
for generating sample rosters/coaches.

Run:
  python backend/roster_manager.py
"""

from __future__ import annotations

import os
import sys
import random
from dataclasses import dataclass
from typing import List

# Ensure project root is on sys.path so we can import utils/*
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from utils.name_generator import NameGenerator  # noqa: E402


# Initialize the name generator once
name_gen = NameGenerator()


@dataclass
class Player:
    name: str
    position: str
    year: str
    rating: int

    def __str__(self) -> str:
        return f"{self.name} ({self.position}, {self.year}) - OVR: {self.rating}"


@dataclass
class Coach:
    name: str
    role: str
    salary: int

    def __str__(self) -> str:
        return f"{self.role}: {self.name} (Salary: ${self.salary:,})"


def generate_roster(num_players: int = 85) -> List[Player]:
    """Generate a list of Player objects."""
    roster: List[Player] = []
    POSITIONS = ["QB", "RB", "WR", "TE", "OL", "DL", "LB", "DB", "K", "P"]
    YEARS = ["Fr", "So", "Jr", "Sr"]

    for _ in range(num_players):
        name = name_gen.generate_name()
        position = random.choice(POSITIONS)
        year = random.choice(YEARS)
        rating = random.randint(60, 95)

        roster.append(Player(name=name, position=position, year=year, rating=rating))

    return roster


def generate_coaching_staff() -> List[Coach]:
    """Generate a basic coaching staff."""
    roles = [
        ("Head Coach", (2_500_000, 9_500_000)),
        ("Offensive Coordinator", (750_000, 2_500_000)),
        ("Defensive Coordinator", (750_000, 2_500_000)),
        ("Special Teams", (250_000, 900_000)),
        ("Strength & Conditioning", (150_000, 650_000)),
        ("Recruiting Coordinator", (200_000, 900_000)),
    ]

    staff: List[Coach] = []
    for role, (lo, hi) in roles:
        staff.append(
            Coach(
                name=name_gen.generate_name(),
                role=role,
                salary=random.randint(lo, hi),
            )
        )

    return staff


if __name__ == "__main__":
    print("Sample roster (first 10):")
    r = generate_roster(85)
    for p in r[:10]:
        print(" -", p)

    print("\nSample coaching staff:")
    for c in generate_coaching_staff():
        print(" -", c)

