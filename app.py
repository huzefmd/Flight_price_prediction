from flask import Flask, request, jsonify
import pickle
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# In-memory user storage (use a database like SQLite/PostgreSQL in production)
users = {}

# Load the pre-trained model
model = pickle.load(open('model.pkl', 'rb'))

# Dictionaries for categorical variables
airline_dict = {'AirAsia': 0, "Indigo": 1, "GO_FIRST": 2, "SpiceJet": 3, "Air_India": 4, "Vistara": 5}
source_dict = {'Delhi': 0, "Hyderabad": 1, "Bangalore": 2, "Mumbai": 3, "Kolkata": 4, "Chennai": 5}
departure_dict = {'Early_Morning': 0, "Morning": 1, "Afternoon": 2, "Evening": 3, "Night": 4, "Late_Night": 5}
stops_dict = {'zero': 0, "one": 1, "two_or_more": 2}
arrival_dict = {'Early_Morning': 0, "Morning": 1, "Afternoon": 2, "Evening": 3, "Night": 4, "Late_Night": 5}
destination_dict = {'Delhi': 0, "Hyderabad": 1, "Mumbai": 2, "Bangalore": 3, "Chennai": 4, "Kolkata": 5}
class_dict = {'Economy': 0, 'Business': 1}

# ------------------ SIGNUP ------------------
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password')
    confirm_password = data.get('confirmPassword')

    if not username or not password or not confirm_password:
        return jsonify({'error': 'All fields are required'}), 400

    if password != confirm_password:
        return jsonify({'error': 'Passwords do not match'}), 400

    if username in users:
        return jsonify({'error': 'User already exists'}), 400

    users[username] = password
    return jsonify({'message': 'Signup successful'}), 201


# ------------------ LOGIN ------------------
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    print('Current users:', users)

    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400

    if username not in users or users[username] != password:
        return jsonify({'error': 'Invalid credentials'}), 401

    # Return user data or a success message upon successful login
    return jsonify({'message': 'Login successful', 'user': {'username': username}}), 200
    
    



# ------------------ PREDICT ------------------
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    try:
        airline = airline_dict[data['airline']]
        source_city = source_dict[data['source_city']]
        departure_time = departure_dict[data['departure_time']]
        stops = stops_dict[data['stops']]
        arrival_time = arrival_dict[data['arrival_time']]
        destination_city = destination_dict[data['destination_city']]
        travel_class = class_dict[data['class']]

        # Calculate date difference
        departure_date = datetime.strptime(data['departure_date'], '%Y-%m-%d')
        date_diff = (departure_date - datetime.today()).days + 1

        # Prepare features for prediction
        features = [airline, source_city, departure_time, stops, arrival_time, destination_city, travel_class, date_diff]
        prediction = model.predict([features])[0]

        return jsonify({'prediction': round(prediction, 2)})

    except KeyError as e:
        return jsonify({'error': f'Missing data for: {e}'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ------------------ RUN APP ------------------
if __name__ == '__main__':
    app.run(debug=True)
