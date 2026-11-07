"""Vercel serverless entrypoint for the BriefKit Senior PM API."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from main import app  # noqa: E402

__all__ = ["app"]
