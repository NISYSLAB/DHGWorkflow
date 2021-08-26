from model.workflows import *
from flask import Flask
from dotenv import load_dotenv
import os
load_dotenv()

app = Flask(__name__)
workFlowModel = WorkFlowModel()

@app.route("/")
def Home():
    return "DHGWorkflow"
    
@app.route("/workflow/<id>")
def getWorkflow(id):
    return workFlowModel.get(id) or "Not Found"

if __name__ == '__main__':
    app.run(port=os.getenv('PORT'), debug=True)
