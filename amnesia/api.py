from flask import Blueprint, request, abort
from pprint import pprint

bp = Blueprint('api', __name__, url_prefix='/api')

@bp.route('/predict/', methods=['POST'])
def predict():
    try:
        text = request.json['text']

        text = request.json.get('text2')
        if text is None:
            abort(404, {'message': str(text)})

        return text
    except Exception as e:
        abort(404, {'message': str(e)})
