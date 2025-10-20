from abc import ABC, abstractmethod
from fastapi import UploadFile
import os

class StorageService(ABC):
    @abstractmethod
    async def save(self, file: UploadFile, filename: str) -> str:
        """Save file and return its accessible URL."""
        pass

    @abstractmethod
    async def delete(self, file_url: str):
        """Delete the file from storage."""
        pass


class LocalStorageService(StorageService):
    def __init__(self, upload_dir="uploads", base_url="/static"):
        self.upload_dir = upload_dir
        self.base_url = base_url
        os.makedirs(self.upload_dir, exist_ok=True)

    async def save(self, file: UploadFile, filename: str) -> str:
        file_path = os.path.join(self.upload_dir, filename)
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())
        return f"{self.base_url}/{filename}"

    async def delete(self, file_url: str):
        # Convert URL back to local path
        filename = file_url.replace(f"{self.base_url}/", "")
        file_path = os.path.join(self.upload_dir, filename)
        try:
            os.remove(file_path)
        except FileNotFoundError:
            pass  # File already deleted


"""
    For future work to use S3
"""
# import boto3
#
# class S3StorageService(StorageService):
#     def __init__(self, bucket_name: str):
#         self.s3 = boto3.client('s3')
#         self.bucket = bucket_name
#
#     def save(self, file: UploadFile, filename: str) -> str:
#         self.s3.upload_fileobj(file.file, self.bucket, filename)
#         return f"https://{self.bucket}.s3.amazonaws.com/{filename}"