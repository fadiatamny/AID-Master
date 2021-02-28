from flask import Flask
import os

app = Flask('AIDMaster')

@app.route('/', methods = ['GET'])
def index():
    return 'Welcome To AID Master Prediction Service'

if __name__ == '__main__':
    config = f'{os.path.dirname(os.path.realpath(__file__))}/.config.json'
    app.config.from_json(config)
    app.run()