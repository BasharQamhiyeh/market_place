from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


# ---------------------
# Category Model
# ---------------------
class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False)
    description = Column(Text, nullable=True)

    # Relationships
    attributes = relationship(
        "Attribute",
        back_populates="category",
        cascade="all, delete-orphan",
        lazy="selectin"
    )
    items = relationship(
        "Item",
        back_populates="category",
        cascade="all, delete-orphan"
    )


# ---------------------
# Attribute Model
# ---------------------
class Attribute(Base):
    __tablename__ = "attributes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    input_type = Column(String(50), nullable=True)
    is_required = Column(Boolean, default=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="CASCADE"), nullable=False)

    # Relationships
    category = relationship("Category", back_populates="attributes")
    options = relationship(
        "AttributeOption",
        back_populates="attribute",
        cascade="all, delete-orphan",
        lazy="selectin"
    )
    item_values = relationship("ItemAttributeValue", back_populates="attribute")


# ---------------------
# Attribute Option Model
# ---------------------
class AttributeOption(Base):
    __tablename__ = "attribute_options"

    id = Column(Integer, primary_key=True, index=True)
    value = Column(String(255), nullable=False)
    attribute_id = Column(Integer, ForeignKey("attributes.id", ondelete="CASCADE"), nullable=False)

    # Relationships
    attribute = relationship("Attribute", back_populates="options")
