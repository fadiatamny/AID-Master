from flask import Blueprint, request, abort
from pprint import pprint
from model.modelRunner import ModelRunner

modelPath = './model'
fastTextName = 'fasttextmodel.bin'
knnName = 'knnmodel.pkl'
model = ModelRunner(f'{modelPath}/build/{fastTextName}', f'{modelPath}/build/{knnName}', f'{modelPath}/data/data.xls')

router = Blueprint('api', __name__, url_prefix='/api')

@router.route('/predict', methods=['POST'])
def predict():
    try:
        text = request.json['text']
        res = model.predict(text)
        return res
    except Exception as e:
        abort(404, {'message': str(e)})
