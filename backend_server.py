hostname = 'localhost'
username = 'root'
password = ''
database = 'datathon'

import pymysql

myConnection = pymysql.connect(host=hostname, user=username, passwd=password, db=database)

from flask import Flask
from flask import request
from flask import jsonify

app = Flask(__name__)


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

#Use this function, example link http://localhost:5000/search?fieldFilters={"name":"year","type":"number","value":2011};{"name":"type","type":"text","value":"ED%20Heroin%20Overdose"};{"name":"locality"}&requestedColumns=locality, COUNT(*)
@app.route('/search', methods=['GET'])
def search():
    cur = myConnection.cursor()
    import json
    fieldFilters = [json.loads(x) for x in request.args['fieldFilters'].split(";")]
    requestedColumns = request.args['requestedColumns'].split(",")
    query = 'SELECT ' + ', '.join(requestedColumns) + ' FROM opoid_dashboard_with_age '
    print query
    whereAdded = False
    for filt in fieldFilters[:len(fieldFilters) - 1]:
        if not whereAdded:
            query += "WHERE "
            whereAdded = True
        query += filt['name']
        if filt['type'] == 'number':
            query += ' = ' + filt['value'] + ' AND '
        elif filt['type'] == 'text':
            query += ' LIKE "' + filt['value'] + '" AND '
    # Final filt without conditional
    filt = fieldFilters[-1]
    if not whereAdded:
        query += "WHERE "
        whereAdded = True
    query += filt['name']
    if filt['type'] == 'number':
        query += ' = ' + str(filt['value'])
    elif filt['type'] == 'text':
        query += ' LIKE "' + filt['value'] + '"'
    # Final filt without conditional
    print query
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
if __name__ == "__main__":
    app.run(host='localhost')
