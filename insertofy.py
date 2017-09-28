hostname = 'localhost'
username = 'root'
password = ''
database = 'datathon'
import pymysql

myConnection = pymysql.connect(host=hostname, user=username, passwd=password, db=database)

cur = myConnection.cursor()

with open("mock_incidence_data_1.json", "r") as f:
    import json
    d = json.load(f)
    for x in d:
        if type(x['latitude']) == "unicode":
            continue
            print "yeet"
        cur.execute("INSERT INTO fuck_ems_mock_data(`lat`, `lon`) VALUES("+str(x['latitude'])+", "+str(x['longitude'])+")")
        myConnection.commit()