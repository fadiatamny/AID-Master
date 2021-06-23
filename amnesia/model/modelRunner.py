
from .modelUtils import ModelUtils
from .modelException import ModelException
import pandas as pd
from pandas.core.frame import DataFrame
import joblib
import numpy as np
import texthero as hero
import logging
import time
from functools import wraps
from pandas.core.series import Series
import os
import sys
from pathlib import Path
from datetime import datetime

prefix = os.path.dirname(os.path.realpath(__file__))

if not os.path.isdir(f'{prefix}/logs'):
    os.mkdir(f'{prefix}/logs')
logger = logging.getLogger(__name__)
logger.setLevel('DEBUG')
handler = logging.FileHandler(f'{prefix}/logs/logs_runner_{datetime.now().date()}.log')
formatter = '%(asctime)s %(levelname)s -- %(message)s'
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
    def __init__(self, fastText: str, knn: str, fastTextCount: int, dataPath: str) -> None:
        self.categories = ModelUtils.fetchDatasetHeaders()
        self.datasetConfig = ModelUtils.fetchDatasetConfig()

        if not os.path.isdir(dataPath):
            raise ModelException('runner:init', 'folder for data does not exist')
        if not os.path.isfile(os.path.join(dataPath, Path(f'./data.{self.datasetConfig["type"]}'))):
            raise ModelException('runner:init', 'the file data does not exist in the datapath')

        self.fastTextPath = fastText
        self.fastTextCount = fastTextCount
        self.knnPath = knn
        self.dataPath = dataPath

        self.forDf = pd.read_csv(os.path.join(
            dataPath, Path(f'./data.{self.datasetConfig["type"]}')))
        self.fastTextModels = None
        self._loadModels()

    def feedback(self, newData) -> None:
        data = pd.DataFrame.from_dict(newData)
        data = pd.DataFrame(data)
        allData = pd.DataFrame()
        for index in data.index:
            dataFrame = self.categories.copy()
            for category in data['prediction'][index].keys():
                dataFrame[category] = [1]
            dataFrame['TEXT'] = data['text'][index]
            allData = pd.concat([allData, dataFrame], ignore_index=True)
        oldData = pd.read_csv(os.path.join(
            self.dataPath, Path(f'./data.{self.datasetConfig["type"]}')))
        allData = pd.concat([oldData, allData], ignore_index=True)
        allData.to_csv(os.path.join(
            self.dataPath, Path(f'./data.{self.datasetConfig["type"]}')))

    def _loadModels(self) -> None:
        self.fastTextModels = ModelUtils.loadFasttextModels(self.fastTextPath)
        hash = ModelUtils.fetchCurrentHash(self.knnPath)
        self.knnModel = joblib.load(os.path.join(
            self.knnPath, Path(f'./knnmodel_{hash}.pkl')))

    def _verifyFastText(self, path: str):
        fCount: int = 0
        dir = os.scandir(path)
        if not dir or len(os.listdir(path)) != self.fastTextCount:
            raise ModelException(
                'runner:load_ft_model', 'error occured not load model, Too many files in directory')
        for j in dir:
            if os.path.splitext(j)[1] == '.bin':
                fCount += 1
        if fCount != self.fastTextCount:
            raise ModelException(
                'runner:load_ft_model', 'error occured not load model, Not enough .bin files in directory')

    def _verifyKNN(self, path: str):
        fCount: int = 0
        dir = os.scandir(path)
        if not dir:
            raise ModelException(
                'runner:load_ft_model', 'error occured not load model, Too many files in directory')
        for j in dir:
            if os.path.splitext(j)[1] == '.pkl':
                fCount += 1
        if fCount != 1:
            raise ModelException(
                'runner:load_ft_model', 'error occured not load model, Not enough .pkl files in directory')

    def _checkPaths(self, fastText=None, knn=None):
        if fastText:
            self._verifyFastText(fastText)
        if knn:
            self._verifyKNN(knn)

    def changeInstance(self, fastText='', knn='') -> None:
        self._checkPaths(fastText, knn)

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
        cwd = os.getcwd()
        cwdcat = cwd.partition('model')
        os.chdir(f'{cwdcat[0]}/model/')
        if self.fastTextModels is None or self.knnModel is None:
            self._loadModels()

        tempDataframe = ModelUtils.fetchDatasetHeaders()
        cleanText = self._cleanText(text)

        try:
            fastTextRes = ModelUtils.fastPredict(
                cleanText, self.fastTextModels)

        except:
            raise ModelException('runner:predict', "unable to predict")

        for i in range(len(fastTextRes)):
            new = fastTextRes[i].replace('__label__', '')
            tempDataframe[new] = ['1']
        del tempDataframe['TEXT']

        knnRes = self.knnModel.kneighbors(tempDataframe, return_distance=False)
        textObj = self._dfToText(self.forDf.loc[knnRes[0], :])
        jsonPayload = self._normalize(textObj).to_json()
        os.chdir(cwd)
        return jsonPayload


if __name__ == '__main__':
    if sys.argv[1] == '-h' or sys.argv[1] == '-help':
        print(
            'Please follow format of modelRunner.py -f [FastText] -fn [FastText Number] -k [KNN] -d [Data]')
        print('[FastText] = the FastText models bin path')
        print('[FastText Number] = Number of FastText models')
        print('[KNN] = the KNN model bin path')
        print('[Data] = the location where your data is')
        sys.exit()

    if len(sys.argv) < 2:
        logger.error(
            'Please follow format of modelBuilder.py -f [FastText] -k [KNN]')
        sys.exit()

    fastText: str = ''
    knn: str = ''
    dataPath: str = ''
    fastTextCount: int = 3

    for index, item in enumerate(sys.argv, 0):
        if item == '-k' and index + 1 < len(sys.argv):
            knn = str(sys.argv[index + 1])
        if item == '-f' and index + 1 < len(sys.argv):
            fastText = str(sys.argv[index + 1])
        if item == '-fn' and index + 1 < len(sys.argv):
            fastTextCount = int(sys.argv[index + 1])
        if item == '-d' and index + 1 < len(sys.argv):
            dataPath = str(sys.argv[index + 1])

    try:
        runner = ModelRunner(fastText, knn, fastTextCount, dataPath)

        text = input('Please insert text to be predicted')
        prediction = runner.predict(text)

        logger.debug(f'Prediction is:\n{prediction}')
    except ModelException as e:
        logger.critical(str(e))
        print('Please check -h for help.')
    except Exception as e:
        logger.critical('Stack:', str(e))
        print('Please check -h for help.')
