from __future__ import annotations

import threading
import time
from collections import defaultdict


class InMemoryRateLimiter:
    """Simple token bucket per key; enough for low-traffic MVP."""

    def __init__(self, max_requests: int, per_seconds: int = 60):
        self.max_requests = max_requests
        self.per_seconds = per_seconds
        self._lock = threading.Lock()
        self._buckets: dict[str, tuple[int, float]] = defaultdict(lambda: (0, 0.0))

    def allow(self, key: str) -> bool:
        now = time.time()
        with self._lock:
            count, reset_at = self._buckets[key]
            if now >= reset_at:
                self._buckets[key] = (1, now + self.per_seconds)
                return True
            if count >= self.max_requests:
                return False
            self._buckets[key] = (count + 1, reset_at)
            return True
