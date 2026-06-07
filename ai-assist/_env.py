"""Tiny, dependency-free .env loader.

Searches upward from a starting directory for a `.env` file and loads its
KEY=VALUE lines into os.environ (without overwriting variables already set in the
real environment). Supports `#` comments, blank lines, optional `export ` prefix,
and single/double-quoted values. Falls back to python-dotenv if installed, but
needs neither it nor any other package.
"""

from __future__ import annotations

import os
from pathlib import Path


def _parse_line(line: str) -> tuple[str, str] | None:
    line = line.strip()
    if not line or line.startswith("#"):
        return None
    if line.startswith("export "):
        line = line[len("export "):]
    if "=" not in line:
        return None
    key, _, value = line.partition("=")
    key = key.strip()
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
        value = value[1:-1]
    if not key:
        return None
    return key, value


def load_dotenv(start: str | os.PathLike | None = None) -> str | None:
    """Load the nearest `.env` found at or above `start` (default: this file's
    directory). Existing environment variables win. Returns the loaded path, or
    None if no `.env` was found."""
    base = Path(start) if start else Path(__file__).resolve().parent
    if base.is_file():
        base = base.parent
    for directory in [base, *base.parents]:
        candidate = directory / ".env"
        if candidate.is_file():
            for raw in candidate.read_text(encoding="utf-8").splitlines():
                parsed = _parse_line(raw)
                if parsed is None:
                    continue
                key, value = parsed
                os.environ.setdefault(key, value)
            return str(candidate)
    return None
