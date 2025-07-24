 <img src="https://github.com/user-attachments/assets/5f8d33ce-fed8-438a-935c-a9916afef26e" width="150">
 
 <dive></dive>
 
# HBnB - Part 2: Core Business Logic

##  Objective

Implement the core business logic layer of the HBnB application, which includes defining and implementing the primary entities used across the system: `User`, `Place`, `Review`, and `Amenity`.

##  Implemented Classes

Each class inherits from a shared `BaseModel`, which provides:

- Unique UUID (`id`)
- Timestamps (`created_at`, `updated_at`)
- `.save()` and `.update()` methods

###  User
- Attributes: `first_name`, `last_name`, `email`, `is_admin`
- Validations: name length, valid email format
- Example:
```python
User("Nour", "Salem", "nour@example.com")
