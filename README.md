# Todos App UI
This is the frontend user interface for the Todos app, built using React & Tailwindcss.

## Installation
1. Clone the repository:
`git clone https://github.com/visheshism/todosapp.git`

2. Navigate to the project directory:
`cd todosapp`

3. Install dependencies:
`npm install`

## Build
To build the app for production, run the following command:

`npm run build` 

The built files will be placed in the build directory.

## Backend Repository
The backend repository for the Todos app can be found at [backend-repo](https://github.com/visheshism/todoapp_backend).

## Deployment Strategy

We have implemented a deployment strategy that combines the use of two platforms, Vercel and Render, to optimize performance and email functionality. 

- Vercel Deployment: By default, our application is set up to use Vercel for backend deployment. Vercel provides exceptional speed and efficiency, ensuring a fast and responsive user experience for most parts of the application.

- Render Deployment: Additionally, we have integrated Render specifically for email-related endpoints. Render offers reliable email functionality, ensuring proper email delivery, which is crucial for applications that rely heavily on email communications.

This deployment strategy has been implemented based on our specific requirements, but you have the freedom to customize and use a single deployment that meets your specific needs. If you prioritize both speed and email functionality, we recommend deploying the application on a platform that provides the necessary performance and reliable email services.


## Functionality
The Todos app UI provides the following functionality:

- CRUD Operations for Todos: Create, Read, Update, and Delete Todos.
- CRUD Operations for Categories: Create, Read, Update, and Delete Categories.
- Search Query: Search for specific Todos using keywords or phrases.
- Filters on Todos: Apply filters to display Todos based on completion.
- Change Name: Change the name associated with your account.
- Change Password: Update your account password.
- Delete Account: Permanently delete your account and all associated data.
- Profile Page: View and update your profile information.
Please refer to the codebase for detailed implementation details of these functionalities.

## Acknowledgments
This project was developed by [Vishesh Singh](https://github.com/visheshism).

## License
This project is licensed under the (MIT License)[LICENSE].

Feel free to contribute to this project by making a pull request.