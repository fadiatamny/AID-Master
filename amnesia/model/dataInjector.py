from amnesia.model.modelUtils import ModelUtils
from pandas.core.frame import DataFrame
from amnesia.model.crawler import Crawler
import pandas as pd
import json
from amnesia.model.modelRunner import ModelRunner
import texthero as hero

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
        fleg =0
        headers = ModelUtils.fetchDatasetHeaders()
        crawledData = DataInjector.fetchCrawledData()
        predictions = []
        for i in range(len(crawledData)):
            try:
                print('\n\n\n\n________________________________________________________________')
                print(crawledData[i])
                series = pd.Series(crawledData[i])
                print(series)
                series = hero.clean(series)
                print(series)
                toString = pd.Series.to_string(series,index=False)
                print(f'String:   {toString}')
                predictions.append(ModelUtils.fastPredict(toString))
            except:
                input()

        print(len(predictions))

        resFrame = pd.DataFrame()
        for i in range(len(predictions)):
            for j in range(len(predictions[i])):
                dataframe = headers.copy()
                new = predictions[i][j].replace('__label__', '')
                dataframe[new] = [1]
                dataframe["TEXT"] = crawledData[i]
                resFrame = pd.concat([resFrame, dataframe], ignore_index=True)

        # for label in categorieslist:
        #     dataframe[label] = ['0']
        print(resFrame)
        input()

        data = pd.read_csv("./data/data.csv")
        newdata = pd.concat([data,finalframe], ignore_index=True)
        newdata.to_csv('temp.csv',index=False)
        


if __name__ == '__main__':
    # modelPath = './'
    # fastTextName = 'fasttextmodel.bin'
    # knnName = 'knnmodel.pkl'
    # runner = ModelRunner(f'{modelPath}/build/{fastTextName}',
    #                      f'{modelPath}/build/{knnName}', f'{modelPath}/data/data.csv')
    # dataPath = f'{modelPath}/data/data.csv'
    # headersPath = 'dataset.headers.json'
    DataInjector.runing()


