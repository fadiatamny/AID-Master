import pandas as pd
from pandas.core.frame import DataFrame
import joblib
from sklearn.neighbors import NearestNeighbors
import fasttext
from pprint import pprint

class ModelRunner():
    def __init__(self, fastText: str, knn: str, data: str) -> None:
        self.fastTextPath = fastText
        self.knnPath = knn
        self.fastTextModel = fasttext.load_model(fastText)
        self.knnModel = joblib.load(knn)
        self.categories = pd.read_excel(data)

    def changeInstance (self, fastText = '', knn = '') -> None:
        if fastText != '':
            self.fastTextPath = fastText
            self.fastTextModel = fasttext.load_model(fastText)
        if knn != '':
            self.knnPath = knn
            self.knnModelmodel = joblib.load(knn)

    def dfToText(self, df: DataFrame) -> str: 
        return ''

    def predict(self, text: str):
        fasttextmodel = self.fastTextModel
        knnmodel = self.knnModel
        tempDataframe = pd.DataFrame()

        fasttextres = fasttextmodel.predict(text)
        categorieslist = list(self.categories.columns)

        for label in categorieslist:
            tempDataframe[label] = ['0']
        for i in range(len(fasttextres[0])):
            new = fasttextres[0][i].replace('__label__', '')
            tempDataframe[new] = ['1']
        del tempDataframe['TEXT']

        knnres = knnmodel.kneighbors(tempDataframe, return_distance=False)

        pprint(self.categories.loc[knnres[0], :])

        return self.dfToText(self.categories.loc[knnres[0], :])
