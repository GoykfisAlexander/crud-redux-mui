from flask import Flask, request, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app, supports_credentials=True)


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin',
                         'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Methods',
                         'GET, POST, OPTIONS, PUT, DELETE')
    response.headers.add('Access-Control-Allow-Headers',
                         'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response


# создание базы данных с примерами записей
database = {
    1: {'name': 'John', 'age': 32, 'city': 'New York'},
    2: {'name': 'Alice', 'age': 25, 'city': 'Los Angeles'},
    3: {'name': 'Bob', 'age': 41, 'city': 'Chicago'},
    4: {'name': 'Karen', 'age': 38, 'city': 'San Francisco'}
}
next_id = 5  # следующий ID для создания новой записи


@app.route('/records', methods=['GET'])
def read_all_records():
    return jsonify(database)
# создание записи


@app.route('/records', methods=['POST'])
def create_record():
    global next_id
    data = request.get_json()
    database[next_id] = data
    next_id += 1
    return jsonify(next_id-1)


# чтение одной записи по ID
@app.route('/records/<int:record_id>', methods=['GET'])
def read_record(record_id):
    record = database.get(record_id)
    if record is None:
        return 'Record not found', 404
    else:
        return jsonify(record)


# изменение записи по ID
@app.route('/records/<int:record_id>', methods=['PUT'])
def update_record(record_id):
    record = database.get(record_id)
    if record is None:
        return 'Record not found', 404
    else:
        data = request.get_json()
        record.update(data)
        return jsonify(database)


# удаление записи по ID
@app.route('/records/<int:record_id>', methods=['DELETE'])
def delete_record(record_id):
    record = database.get(record_id)
    if record is None:
        return 'Record not found', 404
    else:
        del database[record_id]
        return jsonify(database)


if __name__ == '__main__':
    app.run(debug=True)
