from .modelUtils import ModelUtils
from .modelBuilder import ModelBuilder
from .modelTester import ModelTester
from .modelException import ModelException
from .modelChanger import ModelChanger
from .crawler import Crawler
import pandas as pd
import texthero as hero
import os
import sys
import logging
import shutil

logger = logging.getLogger(__name__)
logger.setLevel("DEBUG")
handler = logging.FileHandler("injector.log")
formatter = "%(asctime)s %(levelname)s -- %(message)s"
handler.setFormatter(logging.Formatter(formatter))
logger.addHandler(handler)


class DataInjector():
    @staticmethod
    def fetchCrawledData(numberCrawler):
        urls = [
            'https://www.kassoon.com/dnd/random-plot-hooks-generator/',
            'https://www.kassoon.com/dnd/plot-twist-generator/',
            'https://www.kassoon.com/dnd/puzzle-generator/'
        ]
        crawler = Crawler(urls, numberCrawler)
        return crawler.crawl()

    @staticmethod
    def preProcess(crawledData: list, models, headers):
        predictions = []
        for i in range(len(crawledData)):
            series = pd.Series(crawledData[i])
            series = hero.clean(series)
            toString = pd.Series.to_string(series, index=False)
            predictions.append(ModelUtils.fastPredict(toString, models))

        resFrame = pd.DataFrame()
        for i in range(len(predictions)):
            for j in range(len(predictions[i])):
                dataframe = headers.copy()
                new = predictions[i][j].replace('__label__', '')
                dataframe[new] = [1]
            dataframe["TEXT"] = crawledData[i]
            resFrame = pd.concat([resFrame, dataframe], ignore_index=True)

        return resFrame

    @staticmethod
    def _movingData(dataPath: str):
        if len(os.listdir(f'{dataPath}/injectedData/')) != 1:
            raise ModelException(
                'dataInjector', 'no data in the folder or more thare one file')
        for file in (os.listdir(dataPath)):
            if file.endswith('csv'):
                os.remove(f'{dataPath}/{file}')
                break
        for file in (os.listdir(f'{dataPath}/injectedData/')):
            if file.endswith('csv'):
                shutil.move(f'{dataPath}/injectedData/{file}',
                            f'{dataPath}/{file}')

    @staticmethod
    def _cleanFiles(dataPath: str, modelsPath: str):
        if len(os.listdir(f'{dataPath}/injectedData/')) > 0:
            for file in os.scandir(f'{dataPath}/injectedData/'):
                os.remove(file.path)
        if len(os.listdir(f'{modelsPath}/fasttext/')) > 0:
            for file in os.scandir(f'{modelsPath}/fasttext/'):
                os.remove(file.path)

    @staticmethod
    def inject(dataPath: str, saveModelsPath: str, hash: str,numOfModels:int, modelsPath: str, numberCrawler: int, oldPath: str):
        models = ModelUtils.loadFasttextModels(f'{modelsPath}/fasttext')
        currentAccuracy = ModelTester.fastTextTest(
           dataPath=dataPath,fastTextPath=f'{modelsPath}/fasttext',numberModels=numOfModels)
        dirPath = os.path.dirname(f'{dataPath}')
        headers = ModelUtils.fetchDatasetHeaders()
        crawledData = DataInjector.fetchCrawledData(numberCrawler)
        processed = DataInjector.preProcess(crawledData, models, headers)
        dirPath = os.path.dirname(f'{dataPath}')
        data = pd.read_csv(f'{dataPath}')
        newdata = pd.concat([data, processed, data], ignore_index=True)
        newdata.to_csv(
            f'{dirPath}/injectedData/injectedData_{hash}.csv', index=False)
        ModelBuilder.createFastText(
            filePath=f'{dirPath}/injectedData/injectedData_{hash}.csv', savePath=f'{saveModelsPath}/fasttext', hashbase=f'{hash}', time=10)
        ModelBuilder.createKNN(
            f'{dirPath}/injectedData/injectedData_{hash}.csv', f'{saveModelsPath}/knn', 10, f'{hash}')
        accuracy = ModelTester.fastTextTest(
           dataPath=f'{dirPath}/injectedData/injectedData_{hash}.csv',fastTextPath=f'{saveModelsPath}/fasttext',numberModels=numOfModels)
        if accuracy > currentAccuracy:
            changer = ModelChanger(
                newPath=saveModelsPath, currentPath=modelsPath, oldPath=oldPath)
            changer.modelsMoving()
            DataInjector._movingData(dataPath=dirPath)
        else:
            DataInjector._cleanFiles(
                dataPath=dirPath, modelsPath=saveModelsPath)
        os.chdir(cwd)

    @staticmethod
    def injectionLoop(dataPath: str, saveModelsPath: str, hash: str, modelsPath: str, numberCrawler: int, oldPath: str, loopCount: int = 1):
        for i in range(loopCount):
            input("0")
            DataInjector.inject(dataPath=dataPath, saveModelsPath=saveModelsPath, hash=hash,
                                modelsPath=modelsPath, numberCrawler=numberCrawler, oldPath=oldPath)


if __name__ == '__main__':
    if sys.argv[1] == '-h' or sys.argv[1] == '-help':
        print(
            'Please follow format of datainjector.py -d [data_path] -sm [save_models_path] -h [hash] -nm [number_of_models] -on [original_models_path] -o [old_Models_Path] -n [number of crawler rounds] -l [LOOP]')
        print('[data_Path] = new models folder path')
        print('[save_Models_Path] = new models folder path')
        print('[hash] = hash for new models = 10')
        print('[number_of_models] =number of new to creat and existing models')
        print('[original_models_path] = current models path')
        print('[old_Models_Path] = old models folder path')
        print('[number_Crawler] = the number of crawler rounds, diffult = 10')
        print('[loop] = number of loops')
        sys.exit()

    if len(sys.argv) < 2:
        logger.error(
            'Please follow format of modeslChanger.py -d [data_path] -sm [save_models_path] -h [hash] -nm [number_of_models] -on [original_models_path] -o [old_Models_Path] -n [number of crawler rounds] -l [LOOP]')
        sys.exit()

    data: str = ''
    save: str = ''
    hash: str = ''
    crawlerRounds: int = ''
    originalmodels: str = ''
    loop: int = 1
    oldModels: str = ''
    numOfModels: int = 3 

    for index, item in enumerate(sys.argv, 0):
        if item == '-d' and index + 1 < len(sys.argv):
            data = f'{sys.argv[index + 1]}'
        if item == '-sm' and index + 1 < len(sys.argv):
            save = f'{sys.argv[index + 1]}'
        if item == '-h' and index + 1 < len(sys.argv):
            hash = f'{sys.argv[index+1]}'
        if item == '-on' and index + 1 < len(sys.argv):
            originalmodels = f'{sys.argv[index+1]}'
        if item == '-n' and index + 1 < len(sys.argv):
            crawlerRounds = int(sys.argv[index+1])
        if item == '-l' and index + 1 < len(sys.argv):
            loop = int(sys.argv[index+1])
        if item == '-nm' and index + 1 < len(sys.argv):
            numOfModels = int(sys.argv[index+1])
        if item == '-o' and index + 1 < len(sys.argv):
            oldModels = f'{sys.argv[index+1]}'

    cwd = os.getcwd()
    cwdcut = cwd.partition('amnesia')
    os.chdir(f'{cwdcut[0]}/amnesia/model/')
    datadir = os.path.dirname(f'{data}')
    if not os.path.isdir(f'{datadir}/injectedData'):
        os.mkdir(f'{datadir}/injectedData')

    try:
        DataInjector.injectionLoop(dataPath=data, saveModelsPath=save, hash=hash,
                                   modelsPath=originalmodels, numberCrawler=crawlerRounds, oldPath=oldModels)
        # add http call to server to change model based on name and hash.
    except ModelException as e:
        print('Please check -h for help.')
        logger.critical(str(e))
    except Exception as e:
        print('Please check -h for help.')
        logger.critical('Stack:', str(e))
    finally:
        os.chdir(cwd)

# python dataInjector.py -d dataset/data.csv -sm bin/newModels/injectModels -h 9876 -nm 3 -on bin/currentModels/ -o bin/oldModels -n 4 -l 1
