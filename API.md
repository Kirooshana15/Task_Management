# ServiceFlow API Documentation

All endpoints are relative to: `http://localhost:5000/api/v1`

---

## 🔐 Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **POST** | `/auth/login` | Log in and receive a JWT. | No |
| **POST** | `/auth/logout` | Log out and invalidate the token server-side. | Yes |
| **GET** | `/auth/me` | Fetch the current user profile. | Yes |
| **GET** | `/auth/users` | List all system users for assignments. | Yes |

### 🛠️ Login Request Body:
```json
{
  "email": "sarah@gmail.com",
  "password": "Admin@123"
}
```

---

## 📋 Service Request Endpoints

| Method | Endpoint | Description | Permissions |
| :--- | :--- | :--- | :--- |
| **GET** | `/requests` | List all service requests. | Admin, Coordinator |
| **GET** | `/requests/:id` | Fetch specific request details. | Admin, Coordinator |
| **POST** | `/requests` | Create a new service request. | Admin, Coordinator |
| **PUT** | `/requests/:id` | Update service request fields. | Admin, Coordinator |
| **PATCH** | `/requests/:id/status` | Advance lifecycle status. | Admin, Coordinator |

### 🔍 Request Fields:
- `clientName` (string)
- `serviceType` ("Website", "Branding", "Marketing")
- `title` (string)
- `description` (string)
- `preferredDeadline` (ISO Date)

---

## 🔨 Work Item Endpoints

| Method | Endpoint | Description | Permissions |
| :--- | :--- | :--- | :--- |
| **GET** | `/work-items` | Map of assigned tasks. | Admin, Coordinator, Developer (filtered) |
| **GET** | `/work-items/:id` | Specific task details. | Admin, Coordinator, Owner |
| **POST** | `/work-items` | Convert approved request to tasks. | Admin, Coordinator |
| **PUT** | `/work-items/:id` | Modify task scope/assignment. | Admin, Coordinator |
| **PATCH** | `/work-items/:id/status`| Update status (Todo -> Done). | Admin, Coordinator, Owner |
| **POST** | `/work-items/:id/notes` | Add progress notes. | Admin, Coordinator, Owner |

### 🔍 Work Item Fields:
- `title` (string)
- `requestId` (ObjectId)
- `assigneeId` (ObjectId)
- `priority` ("Low", "Medium", "High")
- `dueDate` (ISO Date)

---

## 🛑 Error Responses

| Code | Status | Description |
| :--- | :--- | :--- |
| **401** | `Unauthorized` | Token missing, invalid, or expired. |
| **403** | `Forbidden` | User's role lacks permission for the endpoint. |
| **422** | `Validation Error` | Data format mismatch (Joi validation failed). |
| **404** | `Not Found` | Resource (Request/Item) does not exist. |
| **500** | `Server Error` | General server-side failure. |
