from typing import Dict
import pandas as pd
from pandas.core import series
from pandas.core.frame import DataFrame
import joblib
import fasttext
import numpy as np
from pprint import pprint

from pandas.core.series import Series
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

    def _creatdiv(self, raw_frame: DataFrame) -> DataFrame:
        categorieslist = list(raw_frame.columns)
        n = len(categorieslist)
        k = raw_frame.count(axis='index')
        s = pd.Series([k], index=[0])
        s.repeat(n)
        return s.reindex(categorieslist, fill_value=k)

    def _dfToText(self, df: DataFrame) -> Series:
        raw_frame = df.replace(0, np.nan)
        raw_frame = raw_frame.dropna(axis='columns', how='all')
        del raw_frame['TEXT']
        res = raw_frame.count()
        div = self._creatdiv(raw_frame)
        res = res.divide(div)
        return res[0]
    
    def _normalize(self,textObj: Series) -> Series:
        for key in textObj.keys():
            textObj[key] = round(textObj[key],2)
        return textObj
        

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

        knnRes = knnModel.kneighbors(tempDataframe, return_distance=False)
        textObj = self._dfToText(self.categories.loc[knnRes[0], :])
        return self._normalize(textObj).to_json()
