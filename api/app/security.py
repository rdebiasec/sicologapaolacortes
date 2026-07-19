from __future__ import annotations

import hashlib

from fastapi import Request


def client_ip(request: Request) -> str:
    forwarded = request.headers.get('x-forwarded-for', '')
    if forwarded:
        return forwarded.split(',')[0].strip()
    if request.client:
        return request.client.host
    return '0.0.0.0'


def hash_ip(ip: str, salt: str) -> str:
    raw = f'{salt}:{ip}'.encode('utf-8')
    return hashlib.sha256(raw).hexdigest()


def normalized_header(value: str, limit: int = 255) -> str:
    return ' '.join(str(value or '').split())[:limit]
