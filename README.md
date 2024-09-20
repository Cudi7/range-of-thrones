# Range of Thrones

Welcome to **Range of Thrones**, a custom range selection web application with draggable bullet controls built using React, Next.js, and TypeScript. The app includes two exercises: a normal range input with customizable values and a fixed-range input, both of which demonstrate interactive range selection.

This project uses AWS Lambda for data fetching and provides a modern, user-friendly experience. Note: The app has not been tested for mobile devices.

## Demo

[Range of Thrones Demo](https://range-of-thrones.vercel.app/)

## Features

### Exercise 1: Normal Range

- **Custom Range Slider**: A fully customized range slider that allows users to drag two bullets to select a range between a minimum and maximum value.
- **Interactive Labels**: Users can also click on and edit the min/max values directly using input fields.
- **Bullet Interaction**: Hovering over bullets enlarges them and changes the cursor to indicate draggable behavior. While dragging, the cursor changes to a grabbing hand.
- **Range Validation**: Ensures that the minimum and maximum values cannot cross, and the input values are constrained within the given range.
- **Mocked API**: Fetches min and max values from a mocked AWS Lambda service.

### Exercise 2: Fixed Range

- **Fixed Value Selection**: A slider where users can only select predefined, fixed values (e.g., [1.99, 5.99, 10.99, 30.99, 50.99, 70.99]).
- **No Input Editing**: Unlike Exercise 1, values cannot be manually changed, ensuring that users can only select from the predefined options.
- **Mocked API**: Data is fetched from a mocked AWS Lambda service that returns the predefined set of fixed values.
- **Bullet Interaction and Validation**: Similar to the normal range, users can drag bullets without crossing the min/max values.

## Key Technologies

- **React**
- **Next.js**
- **TypeScript**
- **AWS Lambda**
- **Tailwind CSS**
- **Jest and React Testing Library**

## Setup and Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Cudi7/range-of-thrones.git
   cd range-of-thrones
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file and configure the necessary environment variables for the AWS Lambda functions:

   ```bash
   LAMBDA_FN_1_URL=https://example.com/lambda1
   LAMBDA_FN_2_URL=https://example.com/lambda2
   ```

4. **AWS Lambda Example Templates**:  
   Below are the example AWS Lambda functions that should be used for fetching the data in this project. These functions return the necessary values for the range components.

   - **Lambda Function 1**: This function returns the `min` and `max` values for the **Normal Range** component:

     ```javascript
     export const handler = async (event) => {
       const response = {
         statusCode: 200,
         headers: {
           "Content-Type": "application/json",
           "Access-Control-Allow-Origin": "*",
         },
         body: JSON.stringify({
           min: 0,
           max: 100,
         }),
       };
       return response;
     };
     ```

   - **Lambda Function 2**: This function returns an array of fixed values for the **Fixed Range** component:

     ```javascript
     export const handler = async (event) => {
       const response = {
         statusCode: 200,
         headers: {
           "Content-Type": "application/json",
           "Access-Control-Allow-Origin": "*",
         },
         body: JSON.stringify([1.99, 5.99, 10.99, 30.99, 50.99, 70.99]),
       };
       return response;
     };
     ```

5. **Run the development server**:

   ```bash
   npm run dev
   ```

   Open [http://localhost:8080](http://localhost:8080) in your browser to view the app.

## Usage

### Exercise 1: Normal Range

- Navigate to [Exercise 1](http://localhost:8080/exercise1).
- Drag the bullets to select a range between the minimum and maximum values (default: 1 to 100).
- Alternatively, click the input boxes and directly edit the values.

### Exercise 2: Fixed Range

- Navigate to [Exercise 2](http://localhost:8080/exercise2).
- Drag the bullets to select one of the fixed values in the range (e.g., 1.99, 5.99, etc.).
- Input values are not editable, ensuring fixed value selection.

## Testing

The application is thoroughly tested using **Jest** and **React Testing Library**:

- **Unit Tests**: Cover key components like `NormalRange`, `FixedRange`, and all range logic.
- **Mocking**: The `useDrag` hook and AWS Lambda responses are mocked for predictable tests.
- **Run tests**:

  ```bash
  npm run test
  ```

---

This project demonstrates my ability to build interactive web applications with a focus on user experience, clean code, and testability. I hope you find the project interesting and useful!

---

Feel free to reach out for any questions or feedback!
