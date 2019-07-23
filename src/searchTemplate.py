#!/usr/bin/env python

import sys, os
from flask import Flask

app = Flask(__name__)

@app.route('/')
def search(apiName,tempName,extension):
    dataFolder = "./data/"
    fullPath = dataFolder + apiName + "/" + tempName + "." + extention
    template = open(fullPath,"r")
    result = template.read()
    result = result.replace('<',"&lt;")
    result = result.replace('>',"&rt;")
    return result

if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0',port=int(os.environ.get('PORT',8080)))
