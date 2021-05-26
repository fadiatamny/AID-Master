from model.modelException import ModelException
from flask import Blueprint, request, abort
from apiException import ApiException
from model.modelRunner import ModelRunner
from flask_cors import cross_origin
import json
import os

modelPath = './model'
fastTextName = ''
knnName = 'knnmodel.pkl'

# os.chdir('./model')
model = ModelRunner(f'{modelPath}/finModel/fastText',
                    f'{modelPath}/finModel/knn/{knnName}')
# os.chdir('../')

router = Blueprint('api', __name__, url_prefix='/api')


@cross_origin()
@router.route('/predict', methods=['POST'])
def predict():
    try:
        print('1')
        text = request.json['text']
        
        print('2')
        res = model.predict(text)
        
        print('3')
        return json.dumps(res)
    except ModelException as e:
        print(str(e))
        abort(500, {'message': str(e.message)})
    except Exception as e:
        print(str(e))
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
