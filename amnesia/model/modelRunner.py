import pandas as pd
from pandas.core.frame import DataFrame
import joblib
import fasttext
import numpy as np
import json
import texthero as hero
import logging
import time
from functools import wraps
from collections import Counter
from pandas.core.series import Series
from modelException import ModelException

logger = logging.getLogger(__name__)
logger.setLevel("DEBUG")
handler = logging.FileHandler("Runner_Model.log")
formatter = "%(asctime)s %(levelname)s -- %(message)s"
handler.setFormatter(logging.Formatter(formatter))
logger.addHandler(handler)


def timed(func):

    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        res = func(*args, **kwargs)
        end = time.time()
        logger.debug("%s runnig time is %0.2fs",
                     func.__name__, round(end-start, 2))
        return res

    return wrapper


class ModelRunner():
    def __init__(self, fastText: str, knn: str, data: str) -> None:
        self.fastTextPath = fastText
        self.knnPath = knn
        self.categories = pd.read_csv(data)
        self.fastTextModels = None
        self._loadModels()

        input()

    def _loadFasttextModels(self)->list:
        modelsFasttext = []
        try:
            for j in os.scandir(self.fastTextPath):
                if os.path.splitext(j)[1] == '.bin':
                    modelsFasttext.append(
                        fasttext.load_model(f'{os.path.abspath(j)}'))
            if len(modelsFasttext) != 3:
                raise 'Not enough models'
        except:
            logger(f'unable to load the 3 FastText models')
            raise ModelException('runner:load_ft_model', 'error occured not load model')
        return modelsFasttext

    def _loadModels(self) -> None:
        try:
            self.fastTextModels = self._loadFasttextModels()
            self.knnModel = joblib.load(self.knnPath)
        except:
            self.fastTextModel = None
            self.knnModel = None
            logger.critical("loadModels fail")

    def changeInstance(self, fastText='', knn='') -> None:
        if fastText != '':
            self.fastTextPath = fastText
        if knn != '':
            self.knnPath = knn

        self._loadModels()

    def fullPredic(self,text:str)->list:
        resF = []
        for i in range(len(self.fastTextModels)):
           resF.append(self.fastTextModels[i].predict(text, k=10))
        allres = (tuple(list(resF[0][0])+list(resF[1][0])+list(resF[2][0])))
        return [key for key in Counter(allres).keys() if Counter(allres)[key] > 1]

# creat the Series to divid with frame
    def _creatDiv(self, raw_frame: DataFrame) -> DataFrame:
        categorieslist = list(raw_frame.columns)
        n = len(categorieslist)
        k = len(raw_frame.index)
        s = Series([n], index=[0])
        s.repeat(n)
        return s.reindex(categorieslist, fill_value=k)

 # convert the data frame to text
    def _dfToText(self, df: DataFrame) -> Series:
        raw_frame = df.replace(0, np.nan)
        raw_frame = raw_frame.dropna(axis='columns', how='all')
        del raw_frame['TEXT']
        res = raw_frame.count()
        div = self._creatDiv(raw_frame)
        res = res.divide(div)
        return res
    # normolize the % of the payload

    def _normalize(self, textObj: Series) -> Series:
        for key in textObj.keys():
            textObj[key] = round(textObj[key], 2)
        return textObj

    # clean the reciving text
    def _cleanText(self, text) -> str:
        textSeries = Series([text])
        textSeries = hero.clean(textSeries)
        text = Series.to_string(textSeries, index=False)
        return text

    @timed
    def predict(self, text: str):
        if self.fastTextModels is None or self.knnModel is None:
            self._loadModels()
        if self.fastTextModels is None or self.knnModel is None:
            logger.critical("unable load model")
            raise ModelException('runner:load_ft_model', 'error occured not load model')

        tempDataframe = pd.DataFrame()
        cleanText = self._cleanText(text)
        try:
            fastTextRes = self.fullPredic(cleanText)
        except:
            logger.critical("unable to predict")
            return json.loads("unable to predict")
        categorieslist = list(self.categories.columns)

        for label in categorieslist:
            tempDataframe[label] = ['0']
        for i in range(len(fastTextRes[0])):
            new = fastTextRes[0][i].replace('__label__', '')
            tempDataframe[new] = ['1']
        del tempDataframe['TEXT']

        knnRes = self.knnModel.kneighbors(tempDataframe, return_distance=False)
        textObj = self._dfToText(self.categories.loc[knnRes[0], :])
        jsonPayload = self._normalize(textObj).to_json()

        return jsonPayload
