from sqlalchemy.dialects.mysql import CHAR
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from app.models.BaseModel import BaseModelMixin
import os


def get_database_url():
    current_path = os.path.abspath(__file__)
    
    if 'deepcodegroup.com' in current_path:
        # Production connection string
        return 'mysql+aiomysql://root:kx_LCMVqsquv8@localhost:3306/capitalfm_system_db'
    else:
        # Local development connection string
        return 'mysql+aiomysql://root@localhost:3306/capitalfm_system_db'
# Database URL - Consider moving this to environment variables
URL_DATABASE = get_database_url()
# Create async engine with proper configuration
engine = create_async_engine(
    URL_DATABASE,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    echo=True,  # Set to False in production
)

# Create async session maker with explicit configuration
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

# Create base model


# Improved database dependency
async def get_database() -> AsyncGenerator[AsyncSession, None]:
    session = AsyncSessionLocal()
    try:
        yield session
    finally:
        await session.close()

# Initialization function
async def init_models():
    async with engine.begin() as conn:
        # Uncomment if you need to create tables
        # await conn.run_sync(Base.metadata.create_all)
        pass

# Cleanup function
async def close_models():
    await engine.dispose()