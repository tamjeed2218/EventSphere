**EventSphere**

The purpose of this repository is to provide a complete web application project titled EventSphere, developed using the MERN Stack (MongoDB, Express.js, React.js, and Node.js).

_Note: This project is currently under development and is not yet complete. Additional features, improvements, and refinements will be added in future updates._

**Environment Variables**

For security reasons, the .env file is included in .gitignore and is not committed to this repository.

After cloning the project, create a new .env file inside:

./EventSphere/server/

Add the following environment variables to the file:

PORT=5000

MONGO_URI=YOUR_MONGO_DB_CONNECTION_STRING_HERE

JWT_SECRET=YOUR_SUPER_SECRET_KEY

**Configuration**

Replace the following placeholders with your actual values:

YOUR_MONGO_DB_CONNECTION_STRING_HERE — Your MongoDB connection string.
YOUR_SUPER_SECRET_KEY — A secure secret key used for JWT authentication.
Example
PORT=5000

MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/EventSphere

JWT_SECRET=your_secure_secret_key

_Security Notice: Never commit your .env file or expose your MongoDB connection string and JWT secret publicly. The .env file is intentionally ignored by Git to protect sensitive configuration data._
