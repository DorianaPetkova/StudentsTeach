from flask import Flask, render_template, request, redirect, url_for
import mysql.connector

app = Flask(__name__)

# MySQL configuration
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Kookie.679234',
    'database': 'studybuddy'
}

@app.route('/home', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        # Extract form data
        username = request.form['username']
        language = request.form['language']
        country = request.form['country']
        education = request.form['education']

        # Connect to MySQL database
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Execute SQL query to update profile information
        update_query = "UPDATE profile SET language = %s, country = %s, education = %s WHERE username = %s"
        cursor.execute(update_query, (language, country, education, username))
        conn.commit()

        # Close database connection
        cursor.close()
        conn.close()

        # Redirect back to the home page
        return redirect(url_for('home'))

    # Render the home page
    return render_template('home.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        # Extract form data
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']

        # Connect to MySQL database
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Execute SQL query to insert user data
        insert_query = "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)"
        cursor.execute(insert_query, (username, email, password))
        conn.commit()

        # Close database connection
        cursor.close()
        conn.close()

        # Redirect to login page after registration
        return redirect(url_for('login'))
    else:
        # Render register form
        return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    error_message = None
    if request.method == 'POST':
        # Extract form data
        username = request.form['username']
        password = request.form['password']

        # Connect to MySQL database
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Execute SQL query to retrieve user data
        select_query = "SELECT * FROM users WHERE username = %s AND password = %s"
        cursor.execute(select_query, (username, password))
        user = cursor.fetchone()

        # Close database connection
        cursor.close()
        conn.close()

        if user:
            # Redirect to home page if login is successful
            return redirect(url_for('home'))
        else:
            # Set error message
            error_message = "Wrong username or password."

    # Render login form with error message if any
    return render_template('login.html', error=error_message)

if __name__ == '__main__':
    app.run(debug=True)
