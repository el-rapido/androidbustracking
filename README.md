# androidbustracking
This project comprises of an Android app written in Kotlin that sends a location ping to a web server coded in JS(running locally and forwarded using ngrok) with a web client using Google Maps API to display the location of the android device on the map. The web server can handle multiple devices sending location data and the server assigns each device a unique ID and shows the location of the device on the web server. The server also keeps a history of location data sent to it by each device and can draw the path which the device took based of the previous location data. 


## **Setup & Running the Project**

### **1. Install Dependencies**
Ensure you have **Node.js** installed. If not, download it from [nodejs.org](https://nodejs.org/).

Open a terminal and navigate to your project folder:
```sh
cd path/to/location-tracker
```
Install all required dependencies:
```sh
npm install express body-parser ws sqlite3
```

---

### **2. Start the Backend Server**
Run the following command to start the server:
```sh
node server.js
```
If successful, you should see:
```
Server is running on http://localhost:3000
```

---

### **3. Verify the Database**
The project uses **SQLite** for data storage. Ensure the database file is created:
- Navigate to `C:/Users/preci/location-tracker/`
- Confirm that `locations.db` exists.
- If missing, restart the server to create it automatically.

---

### **4. Start the Frontend (Map Visualization)**
1. Open a **browser** and visit:
   ```
   http://localhost:3000
   ```
2. You should see a **Google Map** displaying bus locations.
3. If the map does not load:
   - Verify your **Google Maps API key** in `index.html`.
   - Check browser **console logs (F12 → Console tab)**.

### **5. Start the Android app **
1. Install the android application and press "Start"

