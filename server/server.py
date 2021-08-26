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

if __name__ == '__main__':
    app.run(port=os.getenv('PORT'), debug=True)
