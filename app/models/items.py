from sqlalchemy import Column, Integer, Float, Text, ForeignKey, DateTime, String
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


# ---------------------
# Item Model
# ---------------------
class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(Text, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="CASCADE"), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)

    owner = relationship("User", back_populates="items")

    photos = relationship("Photo", back_populates="item")
    # Relationships
    category = relationship("Category", back_populates="items")
    attribute_values = relationship(
        "ItemAttributeValue",
        back_populates="item",
        cascade="all, delete-orphan",
        lazy="selectin"
    )


# ---------------------
# Item Attribute Value Model
# ---------------------
class ItemAttributeValue(Base):
    __tablename__ = "item_attribute_values"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("items.id", ondelete="CASCADE"), nullable=False)
    attribute_id = Column(Integer, ForeignKey("attributes.id", ondelete="CASCADE"), nullable=False)
    value = Column(String(255), nullable=False)

    # Relationships
    item = relationship("Item", back_populates="attribute_values")
    attribute = relationship("Attribute", back_populates="item_values")

    @property
    def attribute_name(self):
        return self.attribute.name if self.attribute else None


class Photo(Base):
    __tablename__ = "photos"

    photo_id = Column(Integer, primary_key=True)
    url = Column(String(300), nullable=False)
    item_id = Column(Integer, ForeignKey("items.id"))

    item = relationship("Item", back_populates="photos")
