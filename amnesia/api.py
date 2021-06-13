from flask import Blueprint, request, abort
from apiException import ApiException
from model.modelRunner import ModelRunner
from model.modelException import ModelException
from flask_cors import cross_origin
import json
import os
from pathlib import Path

prefix = os.path.dirname(os.path.realpath(__file__))
config = None
with open(f'{prefix}/.config.json') as f:
    config = json.load(f)

model = ModelRunner( fastText=os.path.join(prefix, Path(config['FASTTEXT_MODEL_PATH'])), 
                     knn=os.path.join(prefix, Path(config['KNN_MODEL_PATH'])),
                     fastTextCount=config['FASTTEXT_MODEL_COUNT'],
                     dataPath=os.path.join(prefix, Path(config['DATASET_PATH']))
)

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
def feedback():
    try:
        scenarios = request.json
        # needs to be implemented.
        #model.feedback(scenarios)
        return 'Successfully Inserted Feedback'      
    except ModelException as e:
        print(str(e))
        abort(500, {'message': str(e.message)})
    except Exception as e:
        print(str(e))
        abort(500, {'message': str(e)})