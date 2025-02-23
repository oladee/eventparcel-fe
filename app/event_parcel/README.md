# README.md

# Event Parcel

Event Parcel is a React application designed to help users create and manage events. The application provides a user-friendly interface for entering event details, uploading images, and submitting event information.

## Features

- **Event Form**: Users can fill out a comprehensive form to provide details about their event, including name, date, time, location, and description.
- **Image Upload**: Users can upload an event cover image through drag-and-drop functionality or by selecting from their device.
- **Success Message**: After successful form submission, users receive a confirmation message.
- **Responsive Design**: The application is designed to work seamlessly on both desktop and mobile devices.

## Project Structure

```
event_parcel
├── app
│   ├── (pages)
│   │   └── about
│   │       ├── page.tsx         # Main About page component
│   └── components
│       ├── EventForm.tsx        # Component for the event form
│       ├── EventImagePicker.tsx  # Component for image selection
│       ├── EventSuccess.tsx      # Component for success message
│       ├── FormField.tsx         # Component for individual form fields
│       ├── ImagePickerModal.tsx   # Modal for image source selection
│       └── PersonalDetails.tsx    # Component for personal details input
├── package.json                   # npm configuration file
├── tsconfig.json                  # TypeScript configuration file
└── README.md                      # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd event_parcel
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

To start the development server, run:
```
npm run dev
```
Open your browser and navigate to `http://localhost:3000` to view the application.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.