from flask import Blueprint, request, abort
from apiException import ApiException
from model.modelRunner import ModelRunner
from flask_cors import cross_origin
import json

modelPath = './model'
fastTextName = 'fasttextmodel.bin'
knnName = 'knnmodel.pkl'
model = ModelRunner(f'{modelPath}/build/{fastTextName}',
                    f'{modelPath}/build/{knnName}', f'{modelPath}/data/data.xls')

router = Blueprint('api', __name__, url_prefix='/api')


@cross_origin()
@router.route('/predict', methods=['POST'])
def predict():
    try:
        text = request.json['text']
        res = model.predict(text)
        return json.dumps(res)
    except ApiException as e:
        abort(e.errorCode, {'message': str(e.message)})
    except Exception as e:
        abort(500, {'message': str(e)})


@cross_origin()
@router.route('/model', methods=['POST'])
def switchModels():
    try:
        fasttextPath = request.json['fasttext']
        knnPath = request.json['knn']
        model.changeInstance(fasttextPath, knnPath)
        return 'Successfully swapped'
    except ApiException as e:
        abort(e.errorCode, {'message': str(e.message)})
    except Exception as e:
        abort(500, {'message': str(e)})
