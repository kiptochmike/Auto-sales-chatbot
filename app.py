from flask import Flask, request, jsonify, render_template
import pandas as pd

# Load the dataset
df = pd.read_csv('Auto Sales data.csv')

app = Flask(__name__)


# Define functions for querying data
def get_order_details(order_number):
    """Get details of a specific order."""
    order = df[df['ORDERNUMBER'] == order_number]
    if order.empty:
        return "Order not found."
    return order.to_dict(orient='records')[0]


# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/query', methods=['POST'])
def query():
    try:
        data = request.get_json()
        user_message = data.get('query', '').strip()  
        print(f"Received user_message: '{user_message}'")  
        
        if user_message:
           
            if user_message.isdigit():
                order_number = int(user_message)
                result = get_order_details(order_number)
            else:
                result = "I'm sorry, I didn't understand that request."

          
            if isinstance(result, str):
                response = {'message': result}
            else:
                response = {'message': str(result)}

            return jsonify(response)
        return jsonify({'message': 'No input provided.'})
    except Exception as e:
        print(f"Error: {e}")  
        return jsonify({'message': 'An error occurred.'})

if __name__ == '__main__':
    app.run(debug=True)
