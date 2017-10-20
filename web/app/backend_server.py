hostname = 'localhost'
username = 'root'
password = ''
database = 'datathon'

import pymysql

myConnection = pymysql.connect(host=hostname, user=username, passwd=password, db=database)

from flask import Flask
from flask import request
from flask import jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/options', methods=['GET'])
def options():
    field = request.args['field']
    cur = myConnection.cursor()
    cur.execute('SELECT DISTINCT ' + field + ' FROM opoid_dashboard_with_age')
    myConnection.commit()
    try:
        results = cur.fetchall()
        print 'works'
        return jsonify([x[0] for x in results])
    except Exception as e:
        print 'no'
        return e.message


# Use this function, example link http://localhost:5000/search?fieldFilters={"name":"year","type":"number","value":2011};{"name":"type","type":"text","value":"ED%20Heroin%20Overdose"};{"name":"locality"}&requestedColumns=locality, COUNT(*)
@app.route('/search', methods=['GET'])
def search():
    cur = myConnection.cursor()
    requestedColumns = request.args['requestedColumns'].split(",")
    query = 'SELECT ' + ', '.join(
        requestedColumns) + ' FROM opoid_dashboard_with_age WHERE rate NOT LIKE \"N/A\" AND rate NOT LIKE \"0\" '
    if request.args.get('year'):
        query += " AND year = " + request.args['year']
    if request.args.get('locality'):
        query += " AND locality LIKE " + request.args['locality']
    if request.args.get('type'):
        query += " AND type LIKE " + request.args['type']

    print query
    cur.execute(query)
    myConnection.commit()
    results = cur.fetchall()
    rows = []
    for result in results:
        rows.append({header: resVal for header, resVal in zip(requestedColumns, result)})
    return jsonify(rows)


@app.route('/treatment_facilities', methods=['GET'])
def treatment_facilities():
    cur = myConnection.cursor()
    requestedColumns = request.args['requestedColumns'].split(",")
    query = 'SELECT name1, latitude, longitude FROM treatment_facilities'

    cur.execute(query)
    myConnection.commit()
    results = cur.fetchall()
    rows = []
    for result in results:
        rows.append({header: resVal for header, resVal in zip(requestedColumns, result)})
    return jsonify(rows)


@app.route('/searchGroup', methods=['GET'])
def searchGroup():
    cur = myConnection.cursor()
    import json
    fieldFilters = [json.loads(x) for x in request.args['fieldFilters'].split(";")]
    requestedColumns = request.args['requestedColumns'].split(",")
    query = 'SELECT ' + ', '.join(requestedColumns) + ' FROM opoid_dashboard_with_age '
    print query
    whereAdded = False
    for filt in fieldFilters[:len(fieldFilters) - 2]:
        if not whereAdded:
            query += "WHERE "
            whereAdded = True
        query += filt['name']
        if filt['type'] == 'number':
            query += ' = ' + str(filt['value']) + ' AND '
        elif filt['type'] == 'text':
            query += ' LIKE "' + filt['value'] + '" AND '
    # Final filt without conditional
    filt = fieldFilters[-1]
    if fieldFilters[-2]:
        if not whereAdded:
            query += "WHERE "
            whereAdded = True
        if fieldFilters[-2]['type'] == 'number':
            query += fieldFilters[-2]['name'] + ' = ' + str(fieldFilters[-2]['value'])
        else:
            query += fieldFilters[-2]['name'] + ' LIKE \"' + fieldFilters[-2]['value'] + "\""
    # Final filt without conditional
    print query
    query += " GROUP BY " + filt['name']
    cur.execute(query)
    myConnection.commit()
    results = cur.fetchall()
    rows = []
    for result in results:
        rows.append({header: resVal for header, resVal in zip(requestedColumns, result)})
    return jsonify(rows)


@app.route('/randomLocs', methods=['GET'])
def randomLocs():
    cur = myConnection.cursor()
    cur.execute('SELECT lat, lon FROM fuck_ems_mock_data ORDER BY RAND() LIMIT 50')
    myConnection.commit()
    try:
        results = cur.fetchall()
        print 'works'
        return jsonify([{"lat": x[0], "lon": x[1]} for x in results])
    except Exception as e:
        print 'no'
        return e.message


@app.route('/getCenters', methods=['GET'])
def getCenters():
    cur = myConnection.cursor()
    cur.execute('SELECT lat, lon, name FROM treatment_centers ORDER BY RAND()')
    myConnection.commit()
    try:
        results = cur.fetchall()
        print 'works'
        return jsonify([{"lat": float(x[0]), "lon": float(x[1]), "name": x[2]} for x in results])
    except Exception as e:
        print 'no'
        return e.message

if __name__ == "__main__":
    app.run(host='localhost')
