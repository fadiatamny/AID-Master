from modelUtils import ModelUtils
from .crawler import Crawler
import pandas as pd
import texthero as hero
from modelBuilder import ModelBuilder
from modelTester import ModelTester
import os
import sys
import logging
from modelException import ModelException

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
    def inject(dataPath: str, saveModelsPath: str, hash: str, modelsPath: str, numberCrawler: int):
        models = ModelUtils.loadFasttextModels(f'{modelsPath}')
        currentAccuracy = ModelTester.fastTextTest(dataPath, modelsPath)
        headers = ModelUtils.fetchDatasetHeaders()
        crawledData = DataInjector.fetchCrawledData(numberCrawler)
        processed  = DataInjector.preProcess(crawledData, models, headers)
                
        data = pd.read_csv(f'{dataPath}')
        newdata = pd.concat([data, processed, data], ignore_index=True)
        newdata.to_csv(f'{dataPath}/injectedData/injectedData_{hash}.csv', index=False)

        ModelBuilder.createFastText(
            f'{dataPath}/injectedData/injectedData_{hash}.csv', f'{saveModelsPath}', f'{hash}', 5400)
        ModelBuilder.createKNN(
            f'{dataPath}/injectedData/injectedData_{hash}.csv', f'{saveModelsPath}', 10, f'{hash}')
        accuracy = ModelTester.fastTextTest(
            f'{dataPath}/injectedData/injectedData_{hash}.csv', f'{saveModelsPath}')

        if accuracy > currentAccuracy:
            # swap the model
            # swap the data
            pass
        
        #clean the csv
        #clean the temp model files

        os.chdir(cwd)

    @staticmethod
    def injectionLoop(dataPath: str, saveModelsPath: str, hash: str, modelsPath: str, numberCrawler: int, loopCount: int = 1):
        for i in range(loopCount):
            DataInjector.inject(dataPath=dataPath,saveModelsPath=saveModelsPath,hash=hash,modelsPath=modelsPath,numberCrawler=numberCrawler)

if __name__ == '__main__':
    if sys.argv[1] == '-h' or sys.argv[1] == '-help':
        print(
            'Please follow format of datainjector.py -d [data_path] -sm [save_models_path] -h [hash] -on [original_models_path] -n [number of crawler rounds] -l [LOOP]')
        print('[data_Path] = new models folder path')
        print('[save_Models_Path] = new models folder path')
        print('[hash] = hash for new models = 10')
        print('[original_models_path] = current models path')
        print('[number_Crawler] = the number of crawler rounds, diffult = 10')
        print('[loop] = number of loops')
        sys.exit()

    if len(sys.argv) < 2:
        logger.error(
            'Please follow format of modeslChanger.py -d [data_path] -s [save_models_path] -h [hash] -o [original_models_path] -n [number of crawler rounds] -l [LOOP]')
        sys.exit()

    data: int = 3
    save: str = ''
    h: str = ''
    n: str = ''
    o: str = ''
    l: int = 1

    for index, item in enumerate(sys.argv, 0):
        if item == '-d' and index + 1 < len(sys.argv):
            d = f'{sys.argv[index + 1]}'
        if item == '-s' and index + 1 < len(sys.argv):
            s = f'{sys.argv[index + 1]}'
        if item == '-h' and index + 1 < len(sys.argv):
            h = f'{sys.argv[index+1]}'
        if item == '-o' and index + 1 < len(sys.argv):
            o = f'{sys.argv[index+1]}'
        if item == '-n' and index + 1 < len(sys.argv):
            n = f'{sys.argv[index+1]}'
        if item == '-l' and index + 1 < len(sys.argv):
            l = int(sys.argv[index+1])

    cwd = os.getcwd()
    cwdcut = cwd.partition('amnesia')
    os.chdir(f'{cwdcut[0]}/amnesia/model/')

    if not os.path.isdir(f'{d}/injectedData'):
        os.mkdir(f'{d}/injectedData')

    try:
        DataInjector.injectionLoop(d, s, h, o, n, l)
        # add http call to server to change model based on name and hash.
    except ModelException as e:
        print('Please check -h for help.')
        logger.critical(str(e))
    except Exception as e:
        print('Please check -h for help.')
        logger.critical('Stack:', str(e))
    finally:
        os.chdir(cwd)

