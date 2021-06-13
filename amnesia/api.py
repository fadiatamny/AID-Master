from model.modelException import ModelException
from flask import Blueprint, request, abort
from .apiException import ApiException
from model.modelRunner import ModelRunner
from flask_cors import cross_origin
import json

modelPath = './model'

# os.chdir('./model')
model = ModelRunner(f'{modelPath}/bin/currentModels',
                    f'{modelPath}/bin/currentModels/knn')
# os.chdir('../')

router = Blueprint('api', __name__, url_prefix='/api')


@cross_origin()
@router.route('/predict', methods=['POST'])
def predict():
    try:
        text = request.json['text']
        res = model.predict(text)
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
    except ModelException as e:
        print(str(e))
        abort(500, {'message': str(e.message)})
    except ApiException as e:
        abort(e.errorCode, {'message': str(e.message)})
    except Exception as e:
        abort(500, {'message': str(e)})

@cross_origin()
@router.route('/feedback', methods=['POST'])
def predict():
    try:
        scenarios = request.json
        # needs to be implemented.
        model.feedback(scenarios)
        return 'Successfully Inserted Feedback'      
    except ModelException as e:
        print(str(e))
        abort(500, {'message': str(e.message)})
    except Exception as e:
        print(str(e))
        abort(500, {'message': str(e)})