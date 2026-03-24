from typing import Any
from fastapi import status, HTTPException

def success_response(data: Any = None, message: str = "Request successful", status_code: int = status.HTTP_200_OK) -> dict:
    """Standardized success response to match core project."""
    return dict(status=True, status_code=status_code, message=message, data=data, error=None)

def error_response(
    data: Any = None, message: str = "An error occurred", status_code: int = status.HTTP_400_BAD_REQUEST
) -> dict:
    """Standardized error response to match core project."""
    raise HTTPException(
        status_code=status_code,
        detail={
            "success": False,
            "status_code": status_code,
            "message": message,
            "error": data,
            "data": None
        }
    )
