from __future__ import annotations

from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

import yaml

ROOT = Path(__file__).resolve().parents[2]
SIGNAL_ROOT = ROOT / "tools" / "signal_desk"
CONFIG_DIR = SIGNAL_ROOT / "config"
STORE_DIR = ROOT / "store" / "output"
PUBLIC_DATA_DIR = ROOT / "public" / "data" / "signal-desk"


def load_yaml(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        return yaml.safe_load(handle) or {}


def load_feeds() -> list[dict[str, Any]]:
    return list(load_yaml(CONFIG_DIR / "feeds.yaml").get("feeds", []))


def load_framework_config() -> dict[str, Any]:
    return load_yaml(CONFIG_DIR / "frameworks.yaml")


def load_optional_config(name: str) -> dict[str, Any]:
    path = CONFIG_DIR / name
    if not path.exists():
        return {}
    return load_yaml(path)


def resolve_project_path(value: str) -> Path:
    path = Path(value).expanduser()
    if path.is_absolute():
        return path
    return ROOT / path


def parse_since(value: str) -> datetime:
    if value.endswith("h"):
        hours = int(value[:-1])
        return datetime.now(timezone.utc) - timedelta(hours=hours)
    if value.endswith("d"):
        days = int(value[:-1])
        return datetime.now(timezone.utc) - timedelta(days=days)
    return datetime.fromisoformat(value.replace("Z", "+00:00"))
