from sqlalchemy.orm import Session
import models
from pydantic import BaseModel
from typing import List
from datetime import datetime
from enum import Enum

class ChangeType(str, Enum):
    bug = "bug"
    feature = "feature"
    hotfix = "hotfix"

class ChangeCreate(BaseModel):
    title: str
    description: str | None = None
    type: ChangeType = ChangeType.feature
    risk_score: int = 50
    production_line: str = "A-SERIE"

def get_changes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Change).offset(skip).limit(limit).all()

def get_change(db: Session, change_id: int):
    return db.query(models.Change).filter(models.Change.id == change_id).first()

def create_change(db: Session, change: ChangeCreate):
    db_change = models.Change(**change.dict())
    db.add(db_change)
    db.commit()
    db.refresh(db_change)
    return db_change