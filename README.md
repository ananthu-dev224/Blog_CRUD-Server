Blog CRUD - Backend

This is the backend for a Blog CRUD platform where users can register, log in, create, update, and delete blog posts. Authentication is handled via JWT (JSON Web Token), and blog images are stored on AWS S3. The platform uses MongoDB as the database, Express.js for the server, bcrypt for password hashing, and AWS for hosting, with HTTPS security enabled.

Features
User Registration & Login: Users can register and log in using JWT for authentication.
Create, Read, Update, Delete (CRUD) Blogs: Authenticated users can create, update, and delete their blog posts.
Image Uploads: Blog images are uploaded to and served from AWS S3.
Secure Authentication: Passwords are hashed using bcrypt and token-based authentication is used.
AWS Hosting: The backend is hosted on an AWS EC2 instance with HTTPS enabled for secure communication.

Prerequisites
Before running the backend locally, ensure you have the following installed on your machine:

Node.js (v14.x or higher)
npm (v6.x or higher)
MongoDB (locally or cloud MongoDB Atlas)
AWS S3 Bucket for image storage (optional for local development)

Getting Started (Local Setup)
'Follow these instructions to set up the backend server locally.

1. Clone the repository
git clone <repository-url>
cd backend

2. Install Dependencies
npm install

3. Set Up Environment Variables
Create a .env file in the root directory and add the necessary environmental variables.

4. Start the Development Server
npm start (install nodemon)

AWS S3 Configuration (Optional for Local Development)
If you want to test image uploads using AWS S3 locally, make sure you've created an S3 bucket and configure the following settings:

Create an S3 bucket in your AWS account.
Update your .env file with your AWS credentials and bucket name.
Ensure your S3 bucket has the correct policies for public read access.

Deployed Version
The backend is deployed and hosted on AWS EC2 with HTTPS enabled. You can access the deployed backend via the following URL:

https://blogger.ananthuks.online

Running Tests
To run tests for the backend, you can use the following command:
npm test

Deployment Instructions
To deploy the backend on AWS EC2:

Provision an EC2 instance (Ubuntu 20.04 or similar).
Install Node.js and MongoDB on the EC2 instance.
Set up Nginx as a reverse proxy for HTTPS using Let's Encrypt for SSL certificates.
Deploy the application on the EC2 instance:
Pull the repository.
Install the dependencies (npm install).
Set up environment variables.
Start the application using a process manager like PM2.
Ensure that your MongoDB URI points to a production database (e.g., MongoDB Atlas).
Configure AWS S3 for image uploads.

Contact
For any queries or issues, please contact:

Email: ananthudev224@gmail.com