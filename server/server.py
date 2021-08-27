from dotenv import load_dotenv
load_dotenv()
from controller.workflow import workFlow
from model.workflows import *
from flask import Flask

app = Flask(__name__)
app.register_blueprint(workFlow, url_prefix='/workflow')

@app.route("/")
def Home():
    return "DHGWorkflow"

if __name__ == '__main__':
    app.run(port=os.getenv('PORT'), debug=True)
