import time
from collections import defaultdict


class InMemoryRateLimit:
    store = defaultdict(list)

    @classmethod
    def check(cls, key: str, limit: int = 20, window: int = 60) -> bool:
        now = time.time()
        cls.store[key] = [ts for ts in cls.store[key] if now - ts < window]
        if len(cls.store[key]) >= limit:
            return False
        cls.store[key].append(now)
        return True
