import os

from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()  # Load environment variables from a .env file

# Determine the base directory of the project (two levels up from this file)
DATABASE_URL = os.getenv("DATABASE_URL")


# Defines the main settings class for the application
class Settings(BaseSettings):
    # Database connection string, defaults to a SQLite database in the project directory
    db_url: str = DATABASE_URL

    # Flag to enable/disable SQL statement logging for debugging, defaults to False
    db_echo: bool = False


# Initialize the main settings instance
settings = Settings()
