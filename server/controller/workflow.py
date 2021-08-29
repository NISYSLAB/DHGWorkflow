from model.workflows import *
from flask import request, make_response, Blueprint
import xml.etree.ElementTree as ET

workFlow = Blueprint('workflow', __name__)
workFlowModel = WorkFlowModel()


@workFlow.route("/", methods=['POST'])
def postWorkflow():
    try:
        ET.fromstring(request.data)
    except:
        return "Invalid GraphML", 400
    graphML = request.data.decode('utf')
    return workFlowModel.insert(graphML)


@workFlow.route("/<id>")
def getWorkflow(id):
    res = workFlowModel.get(id)
    if res is None: return "Not Found", 404
    r = make_response(res["graphml"])
    r.headers.set('X-Write-Time', str(res["writeTime"]))
    r.headers.set('Content-Type', "application/xml")
    return r


@workFlow.route("/<id>", methods=['POST'])
def updateWorkflow(id):
    try:
        ET.fromstring(request.data)
    except:
        return "Invalid GraphML", 400
    graphML = request.data.decode('utf')
    writeTime = float(request.headers['X-Write-Time'])
    newWriteTime = workFlowModel.update(id, writeTime, graphML)
    if not newWriteTime:
        return "WriteTime or GraphID do not match", 400
    return str(newWriteTime)
