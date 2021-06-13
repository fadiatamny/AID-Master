import os
import json
import pandas as pd
import fasttext
from collections import Counter
from .modelException import ModelException


class ModelUtils():
    @staticmethod
    def fetchDatasetConfig() -> dict:
        prefix = os.path.dirname(os.path.realpath(__file__))
        if not os.path.isfile(f'{prefix}/dataset.config.json'):
            raise ModelException(
                'Utils:load_dataset_config', 'ERROR: your data location config does not exist')

        with open(f'{prefix}/dataset.config.json') as f:
            text = f.read()
            return json.loads(text)

    @staticmethod
    def fetchDatasetHeaders():
        prefix = os.path.dirname(os.path.realpath(__file__))
        if not os.path.isfile(f'{prefix}/dataset.headers.json'):
            raise ModelException(
                'Utils:load_categories', 'Please make sure that the dataset.headers.json file exist.')

        with open(f'{prefix}/dataset.headers.json') as f:
            categoriesDict = json.loads((f.read()))
            return pd.DataFrame(categoriesDict)

    @staticmethod
    def loadFasttextModels(path: str, numModels: int = 3) -> list:
        modelsFasttext = []
        dir = os.scandir(path)
        # bug in mac adding a hideing folder adding .DS_store to ignore
        if not dir or len(os.listdir(path)) != numModels:
            raise ModelException(
                'runner:load_ft_model', 'error occured not load model, Too many files in directory')

        for j in dir:
            if os.path.splitext(j)[1] == '.bin':
                modelsFasttext.append(
                    fasttext.load_model(f'{os.path.abspath(j)}'))
        if len(modelsFasttext) != numModels:
            raise ModelException(
                'runner:load_ft_model', 'error occured not load model, Not enough .bin files in directory')

        return modelsFasttext

    @staticmethod
    def fastPredict(text: str, models: list) -> list:
        resF = []
        for i in range(len(models)):
            resF.append(models[i].predict(text, k=10))
        res = (tuple(list(resF[0][0])+list(resF[1][0])+list(resF[2][0])))
        return [key for key in Counter(res).keys() if Counter(res)[key] > 1]

    @staticmethod
    def fetchCurrentHash(filePath: str) -> str:
        files = os.listdir(f'{filePath}')
        return files[0].split('_')[1].split('.')[0]

