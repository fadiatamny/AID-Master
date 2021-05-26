
from modelUtils import ModelUtils
import pandas as pd
from pandas.core.frame import DataFrame
import joblib
import fasttext
import numpy as np
import texthero as hero
import logging
import time
from functools import wraps
from collections import Counter
from pandas.core.series import Series
from modelException import ModelException
import os
import sys
import json

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
    def __init__(self, fastText: str, knn: str) -> None:
        self.fastTextPath = fastText
        self.knnPath = knn
        self.categories = ModelUtils.fetchDatasetHeaders()
        self.forDf =pd.read_csv('data/data.csv')
        self.fastTextModels = None
        self._loadModels()

    def _loadModels(self) -> None:
        self.fastTextModels = ModelUtils.loadFasttextModels(self.fastTextPath)
        self.knnModel = joblib.load(self.knnPath)

    def changeInstance(self, fastText='', knn='') -> None:
        if fastText != '':
            self.fastTextPath = fastText
        if knn != '':
            self.knnPath = knn

        # have to handle if changing failed to return to old state
        self._loadModels()

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

        tempDataframe = ModelUtils.fetchDatasetHeaders()
        cleanText = self._cleanText(text)
        try:
            fastTextRes = ModelUtils.fastPredict(cleanText, self.fastTextModels)
            
        except:
            raise ModelException('runner:predict', "unable to predict")
        
        for i in range(len(fastTextRes)):
            new = fastTextRes[i].replace('__label__', '')
            tempDataframe[new] = ['1']
        del tempDataframe['TEXT']
        

        knnRes = self.knnModel.kneighbors(tempDataframe, return_distance=False)
        textObj = self._dfToText(self.forDf.loc[knnRes[0], :])
        jsonPayload = self._normalize(textObj).to_json()

        return jsonPayload

if __name__ == '__main__':
    if sys.argv[1] == '-h' or sys.argv[1] == '-help':
        print('Please follow format of modelRunner.py -f [FastText] -k [KNN]')
        print('[FastText] = the FastText model bin path')
        print('[KNN] = the KNN model bin path')
        sys.exit()

    if len(sys.argv) < 2:
        logger.error(
            'Please follow format of modelBuilder.py -f [FastText] -k [KNN]')
        sys.exit()

    fastText: str = ''
    knn: str = ''

    for index, item in enumerate(sys.argv, 0):
        if item == '-k' and index + 1 < len(sys.argv):
            knn = str(sys.argv[index + 1])
        if item == '-f' and index + 1 < len(sys.argv):
            fastText = str(sys.argv[index + 1])

    try:
        runner = ModelRunner(fastText, knn)

        text = input('Please insert text to be predicted')
        prediction = runner.predict(text)

        print(f'Prediction is:\n{prediction}')
    except ModelException as e:
        logger.critical(str(e))
    except Exception as e:
        logger.critical('Stack:', str(e))
    finally:
        print('Please check -h for help.')
