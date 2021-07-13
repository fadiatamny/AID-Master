from api import router
from flask import Flask
from flask_cors import CORS, cross_origin
import os
from pprint import pprint

app = Flask('AIDMaster')
cors = CORS(app, origins=[app.config['AMNESIA_URI'], app.config['BLEACH_URI'], app.config['FATE_URI'], 'localhost'])
app.config['CORS_HEADERS'] = 'Content-Type'

app.register_blueprint(router)


@cross_origin()
@app.route('/', methods=['GET'])
def index():
    return 'Welcome To AID Master Prediction Service'


if __name__ == '__main__':
    config = f'{os.path.dirname(os.path.realpath(__file__))}/.config.json'
    app.config.from_json(config)
    app.run()
