import pandas as pd
from pandas.core.frame import DataFrame
import joblib
import fasttext
import numpy as np
from pprint import pprint
from apiException import ApiException


class ModelRunner():
    def __init__(self, fastText: str, knn: str, data: str) -> None:
        self.fastTextPath = fastText
        self.knnPath = knn
        self.categories = pd.read_excel(data)
        self._loadModels()

    def _loadModels(self) -> None:
        try:
            self.fastTextModel = fasttext.load_model(self.fastTextPath)
            self.knnModel = joblib.load(self.knnPath)
        except:
            self.fastTextModel = None
            self.knnModel = None

    def changeInstance(self, fastText='', knn='') -> None:
        if fastText != '':
            self.fastTextPath = fastText
        if knn != '':
            self.knnPath = knn

        self._loadModels()

    def _creatdiv(self, raw_frame: DataFrame):
        categorieslist = list(raw_frame.columns)
        n = len(categorieslist)
        k = raw_frame.count(axis='index')
        s = pd.Series([k], index=[0])
        s.repeat(n)
        return s.reindex(categorieslist, fill_value=k)

    def _dfToText(self, df: DataFrame) -> str:
        raw_frame = df.replace(0, np.nan)
        raw_frame = raw_frame.dropna(axis='columns', how='all')
        del raw_frame['TEXT']
        res = raw_frame.count()
        div = self._creatdiv(raw_frame)
        res = res.divide(div)
        return res[0].to_json()

    def predict(self, text: str):
        if self.fastTextModel is None or self.knnModel is None:
            self._loadModels()
        if self.fastTextModel is None or self.knnModel is None:
            raise ApiException(500, 'error occured in server')

        fastTextmodel = self.fastTextModel
        knnModel = self.knnModel
        tempDataframe = pd.DataFrame()

        fastTextRes = fastTextmodel.predict(text, k=10)
        categorieslist = list(self.categories.columns)

        for label in categorieslist:
            tempDataframe[label] = ['0']
        for i in range(len(fastTextRes[0])):
            new = fastTextRes[0][i].replace('__label__', '')
            tempDataframe[new] = ['1']
        del tempDataframe['TEXT']

        knnres = knnModel.kneighbors(tempDataframe, return_distance=False)

        return self._dfToText(self.categories.loc[knnres[0], :])
