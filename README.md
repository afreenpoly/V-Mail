## Overview

Vmail is an innovative email platform designed to make email communication accessible for visually impaired individuals. This project harnesses the power of voice recognition technology to create a user-friendly email experience that allows users to send and manage emails effortlessly using voice commands.

## Key Features

- **Voice-Activated Email Composing:** Vmail allows visually impaired users to compose and send emails simply by speaking. Our advanced voice recognition system accurately transcribes spoken words into text, making the process seamless.

- **Accessible User Interface:** Our user interface is thoughtfully designed to be user-friendly and accessible. We've prioritized easy navigation and incorporated screen reader support for an inclusive experience.

## Team Members

- [Afreen Poly](https://github.com/afreenpoly)
- [Aadil Mohammed Sayad](https://github.com/aadilsayad)
- [Adithyanarayanan S](https://github.com/1ce-one)
- [Aswin K](https://github.com/Asterdev-03)
<!--- [Dhinoo](https://github.com/Dhinuku)-->



## Flow of Implementation

### 1. Google Speech-to-Text (STT)

- **Objective:** Enable voice input for users.

- **Implementation Steps:**
  - Integrate Google STT API.
  - Capture and send spoken words from the frontend.
  - Receive transcribed text on the backend.

### 2. Albert Model for Intent Classification

- **Objective:** Classify user intents based on the transcribed text.

- **Implementation Steps:**
  - Train or use a pre-trained Albert model for intent classification.
  - Integrate the model into the Flask backend.
  - Process transcribed text and determine user intent.

### 3. Google Text-to-Speech (TTS) API

- **Objective:** Provide a voice response to the user based on intent.

- **Implementation Steps:**
  - Utilize Google TTS API to convert text to speech.
  - Send the speech response from the backend to the frontend.
  - Play the speech response on the frontend.

### 4. React as Frontend

- **Objective:** Create an interactive and user-friendly frontend.

- **Implementation Steps:**
  - Develop React components for user interface elements.
  - Connect with the backend to send and receive data.
  - Implement a seamless user experience.

### 5. Flask as Backend

- **Objective:** Handle logic, connect with APIs, and manage data.

- **Implementation Steps:**
  - Set up Flask routes for handling frontend requests.
  - Integrate Google OAuth for user authentication.
  - Connect with Google STT, Albert Model, and TTS APIs.
  - Manage the flow of data between frontend and backend.

### 6. Google OAuth for Login

- **Objective:** Ensure secure and authenticated user access.

- **Implementation Steps:**
  - Integrate Google OAuth for user authentication.
  - Manage user sessions and access tokens.

### 7. Connect Frontend, Backend, and the Model

- **Objective:** Establish seamless communication between frontend, backend, and the Albert Model.

- **Implementation Steps:**
  - Ensure proper API integration between frontend and backend.
  - Transmit data between components efficiently.
  - Test and validate the end-to-end flow.

## Getting Started

To get started with Vmail, follow these steps:

### 1. Clone the Repository

```bash
git clone https://github.com/afreenpoly/V-Mail
```
### 2. Install Node
  Make sure Node.js is installed on your machine. If not, download and install it from the official website: [Node.js](https://nodejs.org/en)
### 3. Install Dependencies
```bash
npm install
```
### 4. Run the Application
```bash
npm start
```

## Contribute

We welcome contributions from the open-source community to improve and expand Vmail. If you'd like to contribute:

1. Fork this repository.

2. Create a new branch for your feature or bug fix: `git checkout -b feature/your-feature-name`.

3. Make your changes and commit them: `git commit -m 'Add a new feature'`.

4. Push your changes to your fork: `git push origin feature/your-feature-name`.

5. Create a Pull Request on the main repository's `main` branch.

6. We will review your contribution and merge it if it aligns with our project's goals.

## Contact

If you have questions, suggestions, or need assistance with Vmail, please feel free to reach out to me. You can contact us through the following channels:

- Email: afreendeby@gmail.com
- Email: aadilsayad@gmail.com

## License

This project is licensed under the MIT License 
