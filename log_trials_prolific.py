#!/usr/bin/python

from datetime import datetime
import sys, cgi, os

# get form data from JavaScript
formdata = cgi.FieldStorage()

# get prolificPID, studyID, expCode, and expData (JSON stringified array)
prolificPID = formdata.getvalue('prolificPID', 'prolificPID_NULL')
studyID = formdata.getvalue('studyID', 'studyID_NULL')
expCode = formdata.getvalue('sessionID', 'sessionID_NULL')
expData = formdata.getvalue('expData', 'expData_NULL')

# get formatted current date and time
now = datetime.now().strftime('%Y-%m-%d_%H_%M_%S')

# ensure the "data" folder exists
data_folder = "data"
if not os.path.exists(data_folder):
    os.makedirs(data_folder)

# write file in the "data" folder
output_filename = f'{data_folder}/{now}_{prolificPID}_{studyID}_{expCode}.txt'
with open(output_filename, 'w') as output_file:
    output_file.write(expData)

# print header and 'Done.' message
sys.stdout.write('Content-type: text/plain; charset=UTF-8\n\n')
sys.stdout.write('Done.')
