import redis
import json
from config.specifications import REDIS_URL


class RedisClient:
    def __init__(self, redis_url: str = REDIS_URL):
        self.client = redis.Redis.from_url(redis_url, decode_responses=True)

    def set_value(self, key: str, value: str, expiry: int = None):
        """Set or update a key in Redis."""
        if expiry:
            self.client.setex(key, expiry, value)  # Set key with expiration
        else:
            self.client.set(key, value)  # Set key without expiration
        return {"message": f"Key '{key}' stored successfully"}

    def get_value(self, key: str):
        """Get a value from Redis."""
        value = self.client.get(key)
        return {"key": key, "value": value if value else None}

    def update_value(self, key: str, value: str, expiry: int = None):
        """Update a key in Redis (overwrite if exists)."""
        if self.client.exists(key):
            return self.set_value(key, value, expiry)
        return {"error": "Key does not exist"}

    def delete_value(self, key: str):
        """Delete a key from Redis."""
        deleted = self.client.delete(key)
        return (
            {"message": f"Key '{key}' deleted successfully"}
            if deleted
            else {"error": "Key not found"}
        )

    def set_json(self, key: str, value: dict, expiry: int = None):
        """Store JSON data in Redis."""
        return self.set_value(key, json.dumps(value), expiry)

    def get_json(self, key: str):
        """Retrieve JSON data from Redis."""
        value = self.client.get(key)
        return json.loads(value) if value else {"error": "Key not found"}


# Initialize Redis client
# redis_client = RedisClient() # Exported at module level if needed
