from flask import Flask
import os
from model.modelRunner import ModelRunner

modelPath = './model'
fastTextName = 'fasttextmodel.bin'
knnName = 'knnmodel.pkl'
model = ModelRunner(f'{modelPath}/build/{fastTextName}', f'{modelPath}/build/{knnName}', f'{modelPath}/data/data.xls')

app = Flask('AIDMaster')

@app.route('/', methods = ['GET'])
def index():
    model.predict("Which baking dish is best to bake a banana bread ?")
    return 'Welcome To AID Master Prediction Service'

if __name__ == '__main__':
    config = f'{os.path.dirname(os.path.realpath(__file__))}/.config.json'
    app.config.from_json(config)
    app.run()