from modelUtils import ModelUtils
from pandas.core.frame import DataFrame
from crawler import Crawler
import pandas as pd
import json
from modelRunner import ModelRunner
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
    def runing(dataPath:str,saveModelsPath:str,saveDataPath:str,hase:str,modelsPath:str,numberCrawler:int):
        cwd = os.getcwd()
        cwdcut = cwd.partition('amnesia')
        os.chdir(f'{cwdcut[0]}/amnesia/model/')
        models = ModelUtils.loadFasttextModels(f'{modelsPath}')
        headers = ModelUtils.fetchDatasetHeaders()
        crawledData = DataInjector.fetchCrawledData(numberCrawler = numberCrawler)
        predictions = []
        for i in range(len(crawledData)):
            try:
                series = pd.Series(crawledData[i])
                series = hero.clean(series)
                toString = pd.Series.to_string(series, index=False)
                predictions.append(ModelUtils.fastPredict(toString, models))

            except:
                input()

        resFrame = pd.DataFrame()
        for i in range(len(predictions)):
            for j in range(len(predictions[i])):
                dataframe = headers.copy()
                new = predictions[i][j].replace('__label__', '')
                dataframe[new] = [1]
            dataframe["TEXT"] = crawledData[i]
            resFrame = pd.concat([resFrame, dataframe], ignore_index=True)

        data = pd.read_csv(f'{dataPath}')
        newdata = pd.concat([data, resFrame, data], ignore_index=True)
        newdata.to_csv(f'{saveDataPath}/injectedData_{hase}.csv', index=False)
        input('1')
        ModelBuilder.createFastText(
            f'{saveDataPath}/injectedData_{hase}.csv', f'{saveModelsPath}', f'{hase}', 5400)
        ModelBuilder.createKNN(f'{saveDataPath}/injectedData_{hase}.csv', f'{saveModelsPath}', 10, f'{hase}')
        ModelTester.fastTextTest(
            f'{saveDataPath}/injectedData_{hase}.csv', f'{saveModelsPath}')
        os.chdir(cwd)



if __name__ == '__main__':
    if sys.argv[1] == '-h' or sys.argv[1] == '-help':
        print(
            'Please follow format of datainjector.py [data_path] [save_models_path] [hase] [original_models_path] [number of crawler rounds]')
        print('[new_models_path] = new models folder path')
        print('[current_models_path] = new models folder path')
        print('[old_models_path] = old models folder path')
        print('[number of crawler rounds] = the number of crawler rounds, diffult = 10')
        sys.exit()

    if len(sys.argv) < 2:
        logger.error(
            'Please follow format of modeslChanger.py -d [data_path] -s [save_models_path] -h [hase] -o [original_models_path] -n [number of crawler rounds]')
        sys.exit()

    d: int = 3
    s: str = ''
    h: str = ''
    n: str = ''
    o: str = ''

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

    try:

        DataInjector.runing(d,s,h,o,n)
        

        # add http call to server to change model based on name and hash.
    except ModelException as e:
        logger.critical(str(e))
    except Exception as e:
        logger.critical('Stack:', str(e))
    finally:
        print('Please check -h for help.')
