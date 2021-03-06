from collections.abc import Generator
from typing import Any

class PaginatedCollection:
    def __init__(self, method) -> None: ...
    @property
    def items(self) -> Generator[Any, None, None]: ...
    def __iter__(self): ...
