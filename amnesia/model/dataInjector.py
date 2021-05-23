from modelUtils import ModelUtils
from pandas.core.frame import DataFrame
from crawler import Crawler
import pandas as pd
import json
from modelRunner import ModelRunner
import texthero as hero
from modelBuilder import ModelBuilder

class DataInjector():
    @staticmethod
    def fetchCrawledData(): 
        urls = [
            'https://www.kassoon.com/dnd/random-plot-hooks-generator/',
            'https://www.kassoon.com/dnd/plot-twist-generator/',
            'https://www.kassoon.com/dnd/puzzle-generator/'
        ]
        crawler = Crawler(urls, 10)
        return crawler.crawl()

    @staticmethod
    def runing():
        models = ModelUtils.loadFasttextModels('finModel/fastText')
        headers = ModelUtils.fetchDatasetHeaders()
        crawledData = DataInjector.fetchCrawledData()
        predictions = []
        for i in range(len(crawledData)):
            try:
                print('\n\n\n\n________________________________________________________________')
                series = pd.Series(crawledData[i])
                series = hero.clean(series)
                toString = pd.Series.to_string(series,index=False)
                predictions.append(ModelUtils.fastPredict(toString,models))

            except:
                input()

        print(len(predictions))
        print(len(crawledData))
        resFrame = pd.DataFrame()
        for i in range(len(predictions)):
            for j in range(len(predictions[i])):
                dataframe = headers.copy()
                new = predictions[i][j].replace('__label__', '')
                dataframe[new] = [1]
            dataframe["TEXT"] = crawledData[i] 
            resFrame = pd.concat([resFrame, dataframe], ignore_index=True)


        data = pd.read_csv("./data/data.csv")
        newdata = pd.concat([data,resFrame,data], ignore_index=True)
        newdata.to_csv('data/injectordata/injecteddata.csv',index=False)
        ModelBuilder.createFastText('data/injectordata/injecteddata.csv','finModel/injectorModels/', '1234',10)
        


if __name__ == '__main__':
    # modelPath = './'
    # fastTextName = 'fasttextmodel.bin'
    # knnName = 'knnmodel.pkl'
    # runner = ModelRunner(f'{modelPath}/build/{fastTextName}',
    #                      f'{modelPath}/build/{knnName}', f'{modelPath}/data/data.csv')
    # dataPath = f'{modelPath}/data/data.csv'
    # headersPath = 'dataset.headers.json'
    DataInjector.runing()


